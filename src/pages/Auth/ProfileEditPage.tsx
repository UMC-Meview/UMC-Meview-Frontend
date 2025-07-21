import React, { useState } from "react";
import Header from "../../components/common/Header";
import SelectableButton from "../../components/common/Button/SelectableButton";
import BottomFixedButton from "../../components/common/Button/BottomFixedButton";
import ProfileImage from "../../components/common/auth/ProfileImage";
import EditableText from "../../components/common/auth/EditableText";
import { PROFILE_TASTE_OPTIONS, FOOD_TYPE_OPTIONS } from "../../constants/tasteOptions";
import checkIcon from "../../assets/Check.svg";
import { useMultiSelect } from "../../hooks/useMultiSelect";

const ProfileEditPage: React.FC = () => {
    // 멀티셀렉트 훅들
    const tasteSelector = useMultiSelect({ maxSelections: 3 });
    const foodTypeSelector = useMultiSelect({ maxSelections: 3 });
    
    // 사용자 정보 상태
    const [userName, setUserName] = useState("홍길동");
    const [userDescription, setUserDescription] = useState("...");

    // 총 선택 개수
    const totalSelections = tasteSelector.selectedItems.length + foodTypeSelector.selectedItems.length;

    // 핸들러들
    const handleTasteToggle = (taste: string) => {
        if (totalSelections < 3 || tasteSelector.selectedItems.includes(taste)) {
            tasteSelector.toggleItem(taste);
        }
    };

    const handleFoodTypeToggle = (foodType: string) => {
        if (totalSelections < 3 || foodTypeSelector.selectedItems.includes(foodType)) {
            foodTypeSelector.toggleItem(foodType);
        }
    };

    const handleBack = () => window.history.back();

    const handleEditComplete = () => {
        console.log('프로필 수정 완료!', {
            tastes: tasteSelector.selectedItems,
            foodTypes: foodTypeSelector.selectedItems,
            userName,
            userDescription,
            totalSelections
        });
    };

    const handleNameSave = (name: string) => setUserName(name);
    const handleDescriptionSave = (description: string) => setUserDescription(description);

    return (
        <div className="min-h-screen bg-white pb-20 overflow-y-auto">
            {/* 헤더 */}
            <div className="pt-10">
                <Header
                    onBack={handleBack}
                    center={<h1 className="text-[19px] font-bold text-black">프로필 수정</h1>}
                />
            </div>

            <div className="px-4 py-6 space-y-5">
                {/* 프로필 정보 섹션 */}
                <div className="flex justify-center">
                    <div className="flex items-start space-x-4 max-w-md">
                        <ProfileImage isEditable={true} />
                        <div className="flex-1 space-y-3">
                            <EditableText
                                value={userName}
                                onSave={handleNameSave}
                                className="text-[21px] font-semibold text-gray-800"
                                inputClassName="text-[21px] font-semibold text-gray-800"
                                showEditIcon={true}
                                editMode="nickname"
                                maxLength={6}
                            />
                            <div className="space-y-6">
                                <label className="text-xs text-gray-600">한 줄 소개</label>
                                <EditableText
                                    value={userDescription}
                                    onSave={handleDescriptionSave}
                                    className="px-3 py-1.5 rounded-tr-full rounded-br-full rounded-bl-full shadow-[0_2px_8px_0_rgba(0,0,0,0.12)] bg-white border border-transparent w-[230px] h-[36px] text-[15px] text-black text-center"
                                    inputClassName="text-[15px] text-gray-700 bg-transparent flex-1"
                                    showEditIcon={true}
                                    iconPosition="end"
                                    editMode="description"
                                    maxLength={13}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 구분선 */}
                <div className="flex justify-center mt-12">
                    <div className="w-[360px] h-[1px] bg-[#D9D9D9]"></div>
                </div>

                {/* 입맛 선택 섹션 */}
                <div className="space-y-4">
                    <div className="flex items-baseline space-x-2 ml-4">
                        <h2 className="text-[16px] font-semibold text-gray-800">입 맛 선택</h2>
                        <img src={checkIcon} alt="체크" className="w-4 h-4" />
                    </div>
                    <div className="w-full mb-4 flex-1 flex flex-col justify-center">
                        {[
                            PROFILE_TASTE_OPTIONS.slice(0, 4),
                            PROFILE_TASTE_OPTIONS.slice(4, 9),
                            PROFILE_TASTE_OPTIONS.slice(9, 13),
                            PROFILE_TASTE_OPTIONS.slice(13, 16)
                        ].map((row, index) => (
                            <div key={index} className="flex flex-row justify-center gap-3 mb-1.5 w-full">
                                {row.map((taste) => (
                                    <SelectableButton
                                        key={taste}
                                        selected={tasteSelector.selectedItems.includes(taste)}
                                        onClick={() => handleTasteToggle(taste)}
                                        className="text-lg"
                                        disabled={!tasteSelector.selectedItems.includes(taste) && totalSelections >= 3}
                                    >
                                        {taste}
                                    </SelectableButton>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 구분선 */}
                <div className="flex justify-center">
                    <div className="w-[360px] h-[1px] bg-[#D9D9D9]"></div>
                </div>

                {/* 음식종류 선택 섹션 */}
                <div className="space-y-4">
                    <div className="flex items-baseline space-x-2 ml-4">
                        <h2 className="text-[16px] font-semibold text-gray-800">선호하는 음식종류 선택</h2>
                        <img src={checkIcon} alt="체크" className="w-4 h-4" />
                    </div>
                    <div className="w-full mb-8 flex-1 flex flex-col justify-center">
                        {[
                            FOOD_TYPE_OPTIONS.slice(0, 4),
                            FOOD_TYPE_OPTIONS.slice(4, 8),
                            FOOD_TYPE_OPTIONS.slice(8, 11),
                            FOOD_TYPE_OPTIONS.slice(11, 13)
                        ].map((row, index) => (
                            <div key={index} className="flex flex-row justify-center gap-3 mb-1.5 w-full">
                                {row.map((foodType) => (
                                    <SelectableButton
                                        key={foodType.name}
                                        selected={foodTypeSelector.selectedItems.includes(foodType.name)}
                                        onClick={() => handleFoodTypeToggle(foodType.name)}
                                        className="flex items-center space-x-1"
                                        disabled={!foodTypeSelector.selectedItems.includes(foodType.name) && totalSelections >= 3}
                                    >
                                        <span>{foodType.emoji}</span>
                                        <span>{foodType.name}</span>
                                    </SelectableButton>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 하단 버튼 */}
            <BottomFixedButton 
                onClick={handleEditComplete}
                variant={totalSelections >= 3 ? "primary" : "gray"}
            >
                수정완료
            </BottomFixedButton>
        </div>
    );
};

export default ProfileEditPage;
