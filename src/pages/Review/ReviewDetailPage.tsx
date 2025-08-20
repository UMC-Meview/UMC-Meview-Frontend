import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/common/Header";
import BottomFixedButton from "../../components/common/Button/BottomFixedButton";
import SelectionGrid from "../../components/common/SelectionGrid";
import ThinDivider from "../../components/common/ThinDivider";
import StoreImageSection from "../../components/store/StoreImageSection";
import ErrorMessage from "../../components/common/ErrorMessage";
import { STORE_REVIEW_TAGS, FOOD_REVIEW_TAGS, LAYOUT_CONFIGS } from "../../constants/options";
import { usePostReview } from "../../hooks/queries/usePostReview";
import { usePostImageUpload } from "../../hooks/queries/usePostImageUpload";
import { getUserInfo, saveReviewDraft, getReviewDraft } from "../../utils/auth";
import { ReviewLocationState } from "../../types/review";
import { processImageForUpload } from "../../utils/imageConversion";

const ReviewDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { submitReview, isLoading, error, isSuccess } = usePostReview();
    const { uploadImageAsync } = usePostImageUpload();
    
    const locationState = location.state as ReviewLocationState;
    const storeId = locationState?.storeId || "temp-store-id";
    const storeName = locationState?.storeName || "모토이시";
    const isPositive = locationState?.isPositive ?? true;
    const score = locationState?.score || 5;
    
    const [selectedStoreTags, setSelectedStoreTags] = useState<string[]>([]);
    const [selectedFoodTags, setSelectedFoodTags] = useState<string[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [uploadedImageUrls, setUploadedImageUrls] = useState<Map<File, string>>(new Map());
    
    useEffect(() => {
        const draft = getReviewDraft();
        if (draft && draft.storeId === storeId) {
            setSelectedStoreTags(draft.storeReviews || []);
            setSelectedFoodTags(draft.foodReviews || []);
            
            if (draft.imageDataUrls && draft.imageDataUrls.length > 0) {
                setPreviewUrls(draft.imageDataUrls);
                
                const convertDataUrlsToFiles = async () => {
                    try {
                        const filePromises = draft.imageDataUrls.map((dataUrl, index) => 
                            dataUrlToFile(dataUrl, `restored-image-${index}.png`)
                        );
                        const files = await Promise.all(filePromises);
                        setSelectedImages(files);
                    } catch (error) {
                        console.error("Failed to convert data URLs to files:", error);
                    }
                };
                
                convertDataUrlsToFiles();
            }
        }
    }, [storeId]);
    
    const handleRemoveImage = (idx: number) => {
        const removedFile = selectedImages[idx];
        
        if (previewUrls[idx] && previewUrls[idx].startsWith('blob:')) {
            URL.revokeObjectURL(previewUrls[idx]);
        }
        
        setSelectedImages(prev => prev.filter((_, i) => i !== idx));
        setPreviewUrls(prev => prev.filter((_, i) => i !== idx));
        
        setUploadedImageUrls(prev => {
            const newMap = new Map(prev);
            newMap.delete(removedFile);
            return newMap;
        });
    };
    
    const fileToDataUrl = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };
    
    const dataUrlToFile = async (dataUrl: string, filename: string = 'image.png'): Promise<File> => {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
    };

    useEffect(() => {
        if (isSuccess) {
            navigate("/review/complete");
        }
    }, [isSuccess, navigate]);
    
    const handleTagClick = (tag: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const processAndAddImage = async (file: File, isReplacement = false, replaceIndex?: number) => {
        try {
            const processedFile = await processImageForUpload(file, { 
                sizeThreshold: 1_500_000, 
                maxDimension: 2000, 
                quality: 0.85 
            });
            
            const result = await uploadImageAsync(processedFile);
            
            const dataUrl = await fileToDataUrl(processedFile);
            
            if (isReplacement && replaceIndex !== undefined) {
                const oldFile = selectedImages[replaceIndex];
                setUploadedImageUrls(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(oldFile);
                    newMap.set(processedFile, result.url);
                    return newMap;
                });
                
                if (previewUrls[replaceIndex] && previewUrls[replaceIndex].startsWith('blob:')) {
                    URL.revokeObjectURL(previewUrls[replaceIndex]);
                }
                
                setSelectedImages(prev => {
                    const newImages = [...prev];
                    newImages[replaceIndex] = processedFile;
                    return newImages;
                });
                
                setPreviewUrls(prev => {
                    const newUrls = [...prev];
                    newUrls[replaceIndex] = dataUrl;
                    return newUrls;
                });
            } else {
                setSelectedImages(prev => [...prev, processedFile]);
                setPreviewUrls(prev => [...prev, dataUrl]);
                setUploadedImageUrls(prev => new Map(prev).set(processedFile, result.url));
            }
        } catch (error) {
            console.error("이미지 처리 실패:", error);
            alert("이미지 처리에 실패했습니다. 다른 이미지를 선택해주세요.");
        }
    };

    const handleImageSelect = async (file: File) => {
        if (selectedImages.length >= 3) {
            alert("이미지는 최대 3개까지 선택 가능합니다.");
            return;
        }
        
        await processAndAddImage(file);
    };

    const handleReplaceImage = async (idx: number, file: File) => {
        await processAndAddImage(file, true, idx);
    };

    useEffect(() => {
        return () => {
            previewUrls.forEach(url => {
                if (url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [previewUrls]);

    const handleSubmit = async () => {
        const userInfo = getUserInfo();
        
        if (selectedStoreTags.length === 0 || selectedFoodTags.length === 0) {
            return;
        }

        if (!userInfo) {
            try {
                const imageDataUrls = previewUrls.filter(url => url.startsWith('data:'));
                saveReviewDraft({
                    storeId,
                    storeName,
                    isPositive,
                    score,
                    foodReviews: selectedFoodTags,
                    storeReviews: selectedStoreTags,
                    imageDataUrls,
                });
            } catch (e) {
                console.error("임시 리뷰 저장 실패", e);
            }
            navigate("/review/login", { replace: true });
            return;
        }

        try {
            let imageUrls: string[] = [];
            
            if (selectedImages.length > 0) {
                const alreadyUploadedUrls = selectedImages.map(file => uploadedImageUrls.get(file)).filter(Boolean) as string[];
                
                if (alreadyUploadedUrls.length === selectedImages.length) {
                    imageUrls = alreadyUploadedUrls;
                } else {
                    const uploadPromises = selectedImages.map(async (file) => {
                        const existingUrl = uploadedImageUrls.get(file);
                        if (existingUrl) {
                            return existingUrl;
                        }
                        
                        try {
                            const result = await uploadImageAsync(file);
                            return result.url;
                        } catch (error) {
                            console.error("Image upload failed:", error);
                            return null;
                        }
                    });
                    
                    const uploadResults = await Promise.all(uploadPromises);
                    imageUrls = uploadResults.filter(url => url !== null) as string[];
                }
            }

            const reviewData = {
                storeId: storeId,
                userId: userInfo.id,
                isPositive: isPositive,
                score: score,
                foodReviews: selectedFoodTags,
                storeReviews: selectedStoreTags,
                imageUrls: imageUrls,
            };
            
            submitReview(reviewData);
        } catch (error) {
            console.error("리뷰 등록 실패:", error);
            alert("리뷰 등록에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const isSubmitDisabled = (selectedStoreTags.length === 0 || selectedFoodTags.length === 0) || isLoading;

    return (
        <div className="bg-white mx-auto max-w-[390px]">
            <div className="sticky top-0 z-30 bg-white">
                <Header 
                    onBack={() => navigate(-1)}
                    center="평가하기"
                />
            </div>
            
            <div className="overflow-y-auto" style={{ height: "calc(100dvh - 180px)", maxHeight: "calc(100dvh - 180px)" }}>
                <div className="px-6 pb-32">
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-black mt-2 mb-1 text-center">
                        '{storeName}'는 어떠셨나요?
                    </h2>
                    <p className="text-sm text-black text-center">
                        솔직한 리뷰를 남겨주세요!
                    </p>
                    <p className="mt-2 text-center text-sm text-gray-500">
                        매장과 음식 평가를 각각 최소 1개 이상 선택해주세요.
                    </p>
                    {error && (
                        <ErrorMessage message={error.message} className="mt-2" variant="compact" />
                    )}
                </div>

                <ThinDivider width="240px" className="my-8" />

                <div className="mb-8">
                    <h3 className="text-[18px] font-bold text-black mb-4">
                        매장은 어떠셨나요?
                    </h3>
                    <SelectionGrid
                        options={STORE_REVIEW_TAGS}
                        selectedItems={selectedStoreTags}
                        onToggle={(tag) => handleTagClick(tag, setSelectedStoreTags)}
                        maxSelections={999}
                        layout={LAYOUT_CONFIGS.STORE_REVIEW}
                        layoutType="grid"
                        className="[&_button]:text-[16px] [&>div]:justify-center"
                    />
                </div>

                <ThinDivider className="my-8" />

                <div className="mb-8">
                    <h3 className="text-[18px] font-bold text-black mb-4">
                        음식은 어떠셨나요?
                    </h3>
                    <SelectionGrid
                        options={FOOD_REVIEW_TAGS}
                        selectedItems={selectedFoodTags}
                        onToggle={(tag) => handleTagClick(tag, setSelectedFoodTags)}
                        maxSelections={999}
                        layout={LAYOUT_CONFIGS.FOOD_REVIEW}
                        className="[&_button]:text-[16px]"
                    />
                </div>

                <ThinDivider className="my-8" />

                <div className="mb-8">
                    <h3 className="text-[18px] font-bold text-black mb-4">
                        사진 첨부하기 <span className="text-sm font-normal text-gray-500">(선택사항, 최대 3개)</span>
                    </h3>
                    
                    <StoreImageSection
                        mainImages={selectedImages}
                        onImageSelect={handleImageSelect}
                        onReplaceImage={handleReplaceImage}
                        onRemoveImage={handleRemoveImage}
                        maxImages={3}
                        variant="review"
                        previewUrls={previewUrls}
                    />
                </div>
                </div>
            </div>

            <BottomFixedButton
                onClick={handleSubmit}
                variant={isSubmitDisabled ? "disabled" : "primary"}
                disabled={isSubmitDisabled}
            >
                {isLoading ? "리뷰 등록 중..." : "리뷰 작성 완료"}
            </BottomFixedButton>
        </div>
    );
};

export default ReviewDetailPage;

