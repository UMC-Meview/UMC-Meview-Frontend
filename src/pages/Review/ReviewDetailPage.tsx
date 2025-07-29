import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import BottomFixedButton from "../../components/common/Button/BottomFixedButton";
import SelectionGrid from "../../components/common/SelectionGrid";
import ImageUpload from "../../components/common/ImageUpload";
import ThinDivider from "../../components/common/ThinDivider";
import { STORE_REVIEW_TAGS, FOOD_REVIEW_TAGS, LAYOUT_CONFIGS } from "../../constants/options";

const ReviewDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedStoreTags, setSelectedStoreTags] = useState<string[]>([]);
    const [selectedFoodTags, setSelectedFoodTags] = useState<string[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);

    const handleTagClick = (tag: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const handleImageSelect = (file: File) => {
        setSelectedImages(prev => [...prev, file]);
    };

    const handleSubmit = () => {
        console.log("Selected store tags:", selectedStoreTags);
        console.log("Selected food tags:", selectedFoodTags);
        console.log("Selected images:", selectedImages);
        navigate("/review/complete");
    };

    const isSubmitDisabled = selectedStoreTags.length === 0 && selectedFoodTags.length === 0;

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
                        '모토이시'는 어떠셨나요?
                    </h2>
                    <p className="text-sm text-black text-center">
                        솔직한 리뷰를 남겨주세요!
                    </p>
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
                리뷰 작성 완료
            </BottomFixedButton>
        </div>
    );
};

export default ReviewDetailPage;

