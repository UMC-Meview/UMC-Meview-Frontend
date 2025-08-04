import React from "react";
import StoreFormInput from "./StoreFormInput";

interface StoreBasicInfoSectionProps {
    storeName: string;
    category: string;
    description: string;
    onInputChange: (field: string, value: string) => void;
}

const StoreBasicInfoSection: React.FC<StoreBasicInfoSectionProps> = ({
    storeName,
    category,
    description,
    onInputChange,
}) => {
    return (
        <div className="space-y-6">
            {/* 가게명 */}
            <div>
                <label className="block text-gray-800 font-medium mb-2">상호명</label>
                <StoreFormInput
                    placeholder="상호명을 입력해주세요"
                    value={storeName}
                    onChange={(value) => onInputChange("storeName", value)}
                    variant="default"
                />
            </div>

            {/* 카테고리 */}
            <div>
                <label className="block text-gray-800 font-medium mb-2">카테고리</label>
                <select
                    value={category}
                    onChange={(e) => onInputChange("category", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-[#FF774C] text-xs"
                >
                    <option value="한식">한식</option>
                    <option value="중식">중식</option>
                    <option value="일식">일식</option>
                    <option value="양식">양식</option>
                    <option value="카페">카페</option>
                    <option value="술집">술집</option>
                    <option value="기타">기타</option>
                </select>
            </div>

            {/* 설명 */}
            <div>
                <label className="block text-gray-800 font-medium mb-2">가게 설명</label>
                <StoreFormInput
                    placeholder="가게에 대한 설명을 입력해주세요"
                    value={description}
                    onChange={(value) => onInputChange("description", value)}
                    variant="large"
                />
            </div>
        </div>
    );
};

export default StoreBasicInfoSection; 