import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/common/Header";
import BottomFixedButton from "../../components/common/Button/BottomFixedButton";
import SelectionGrid from "../../components/common/SelectionGrid";
import ImageUpload from "../../components/common/ImageUpload";
import ThinDivider from "../../components/common/ThinDivider";
import { STORE_REVIEW_TAGS, FOOD_REVIEW_TAGS, LAYOUT_CONFIGS } from "../../constants/options";
import { usePostReview } from "../../hooks/queries/usePostReview";
import { getUserInfo } from "../../utils/auth";
import { ReviewLocationState } from "../../types/review";

const ReviewDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { submitReview, isLoading, error, isSuccess } = usePostReview();
    
    // 이전 페이지에서 전달받은 데이터
    const locationState = location.state as ReviewLocationState;
    const storeId = locationState?.storeId || "temp-store-id"; // 임시 ID
    const storeName = locationState?.storeName || "모토이시";
    const isPositive = locationState?.isPositive ?? true;
    const score = locationState?.score || 5;
    
    const [selectedStoreTags, setSelectedStoreTags] = useState<string[]>([]);
    const [selectedFoodTags, setSelectedFoodTags] = useState<string[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    // 리뷰 등록 성공 시 완료 페이지로 이동
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

    const handleImageSelect = (file: File) => {
        setSelectedImages(prev => [...prev, file]);
        
        // 실제 프로젝트에서는 이미지를 서버에 업로드하고 URL을 받아야 함
        // 현재는 임시로 파일명을 URL로 사용
        const tempImageUrl = `https://example.com/images/${file.name}`;
        setImageUrls(prev => [...prev, tempImageUrl]);
    };

    const handleSubmit = () => {
        // 사용자 정보 확인
        const userInfo = getUserInfo();
        if (!userInfo) {
            alert("로그인이 필요합니다.");
            navigate("/auth");
            return;
        }

        // 필수 선택 확인
        if (selectedStoreTags.length === 0 && selectedFoodTags.length === 0) {
            alert("최소 하나의 평가를 선택해주세요.");
            return;
        }

        // 리뷰 데이터 구성
        const reviewData = {
            storeId: storeId,
            userId: userInfo.id,
            isPositive: isPositive,
            score: score,
            foodReviews: selectedFoodTags,
            storeReviews: selectedStoreTags,
            imageUrls: imageUrls,
        };

        console.log("Submitting review data:", reviewData);
        
        // 리뷰 등록 API 호출
        submitReview(reviewData);
        // 성공/실패는 useEffect와 usePostReview 훅에서 자동 처리됨
    };

    const isSubmitDisabled = (selectedStoreTags.length === 0 && selectedFoodTags.length === 0) || isLoading;

    return (
        <div className="min-h-screen bg-white">
            <Header 
                onBack={() => navigate(-1)}
                center="평가하기"
            />
            
            <div className="px-6 sm:px-8 md:px-10 lg:px-12 pb-32">
                {/* 메인 질문 */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-black mt-2 mb-1 text-center">
                        '{storeName}'는 어떠셨나요?
                    </h2>
                    <p className="text-sm text-black text-center">
                        솔직한 리뷰를 남겨주세요!
                    </p>
                    {error && (
                        <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm text-center">
                            {error.message}
                        </div>
                    )}
                </div>

                <ThinDivider width="240px" className="my-8" />

                {/* 매장 평가 섹션 */}
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
                        className="[&_button]:text-[16px] [&>div]:justify-between"
                    />
                </div>

                <ThinDivider className="my-8" />

                {/* 음식 평가 섹션 */}
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

                {/* 사진 첨부 섹션 */}
                <div className="mb-8">
                    <h3 className="text-[18px] font-bold text-black mb-4">
                        사진 첨부하기 <span className="text-sm font-normal text-gray-500">(선택사항)</span>
                    </h3>
                    <ImageUpload
                        onImageSelect={handleImageSelect}
                        size="small"
                        className="w-[100px] h-[100px]"
                    />
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

