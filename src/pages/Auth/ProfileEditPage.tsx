import React, { useState, useEffect } from "react";
import Header from "../../components/common/Header";
import FixedFrameLayout from "../../layouts/FixedFrameLayout";
import BottomFixedButton from "../../components/common/Button/BottomFixedButton";
import ProfileInfoSection from "../../components/auth/ProfileInfoSection";
import SelectionGrid from "../../components/common/SelectionGrid";
import ThinDivider from "../../components/common/ThinDivider";
import {
    PROFILE_TASTE_OPTIONS,
    FOOD_TYPE_OPTIONS,
    LAYOUT_CONFIGS,
} from "../../constants/options";
import checkIcon from "../../assets/Check.svg";
import { useMultiSelect } from "../../hooks/useMultiSelect";
import { useGetUserProfile } from "../../hooks/queries/useGetUserProfile";
import { usePatchUserProfileEdit } from "../../hooks/queries/usePatchUserProfileEdit";
import { usePostImageUpload } from "../../hooks/queries/usePostImageUpload";
import { PatchProfileRequest } from "../../types/auth";
import { useNavigate } from "react-router-dom";
import { useKeyboardDetection } from "../../hooks/useKeyboardDetection";
import { getUserInfo } from "../../utils/auth";

const ProfileEditPage: React.FC = () => {
    const navigate = useNavigate();
    const userId = getUserInfo()?.id || "";
    const { data: userProfile } = useGetUserProfile(userId);
    const { patchProfile, isLoading: isUpdating, isSuccess } = usePatchUserProfileEdit();
    const {
        uploadImageAsync,
        isLoading: isUploading,
    } = usePostImageUpload();
    const isKeyboardVisible = useKeyboardDetection();

    const tasteSelector = useMultiSelect({ maxSelections: 3 });
    const foodTypeSelector = useMultiSelect({ maxSelections: 3 });
    const { clear: clearTasteSelections } = tasteSelector;
    const { clear: clearFoodTypeSelections } = foodTypeSelector;

    const [userName, setUserName] = useState("");
    const [userDescription, setUserDescription] = useState("");
    const [profileImageUrl, setProfileImageUrl] = useState<string>("");
    const [localPreview, setLocalPreview] = useState<string | null>(null);

    const totalSelections = tasteSelector.selectedItems.length + foodTypeSelector.selectedItems.length;

    // 사용자 프로필 데이터로 초기값 설정
    useEffect(() => {
        if (userProfile) {
            setUserName((userProfile.nickname || "").slice(0, 8));
            setUserDescription(userProfile.introduction || "");
            setProfileImageUrl(userProfile.profileImageUrl || "");
        }
    }, [userProfile]);

    // 페이지 마운트 시 선택 상태 초기화 (클린 스타트)
    useEffect(() => {
        clearTasteSelections();
        clearFoodTypeSelections();
    }, [clearTasteSelections, clearFoodTypeSelections]);

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => navigate("/profile", { replace: true }), 300);
        }
    }, [isSuccess, navigate]);

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

    const handleEditComplete = () => {
        // 유효성 검사: 정확히 3개 선택
        if (totalSelections !== 3 || !userName.trim()) return;
        if (!userProfile?.id) return;

        const updateData: PatchProfileRequest = {
            nickname: userName.trim(),
            introduction: userDescription.trim(),
            tastePreferences: [...tasteSelector.selectedItems, ...foodTypeSelector.selectedItems],
            profileImageUrl: profileImageUrl,
        };

        patchProfile(userProfile.id, updateData);
    };

    const handleImageSelect = async (file: File) => {
        const previewUrl = URL.createObjectURL(file);
        setLocalPreview(previewUrl);
        try {
            const { url } = await uploadImageAsync(file);
            setProfileImageUrl(url);
        } finally {
            URL.revokeObjectURL(previewUrl);
            setLocalPreview(null);
        }
    };

    const SectionTitle = ({ title }: { title: string }) => (
        <div className="flex items-baseline space-x-2 ml-4">
            <h2 className="text-[16px] font-semibold text-gray-800">{title}</h2>
            <img src={checkIcon} alt="체크" className="w-4 h-4" />
        </div>
    );

    return (
        <FixedFrameLayout
            header={<Header onBack={() => window.history.back()} center="프로필 수정" />}
        >
                <ProfileInfoSection
                    imageUrl={localPreview || profileImageUrl}
                    nickname={userName}
                    introduction={userDescription}
                    isEditable={true}
                    onImageSelect={handleImageSelect}
                    onNicknameChange={setUserName}
                    onIntroductionChange={setUserDescription}
                />
                <div className="px-6 py-6 space-y-5">
                    <ThinDivider />

                    <div className="space-y-4">
                        <SectionTitle title="입 맛 선택" />
                        <SelectionGrid
                            options={PROFILE_TASTE_OPTIONS}
                            selectedItems={tasteSelector.selectedItems}
                            onToggle={handleTasteToggle}
                            maxSelections={3}
                            totalSelections={totalSelections}
                            textSize="lg"
                            rowGap="sm"
                            layout={LAYOUT_CONFIGS.PROFILE_TASTE}
                            className="w-full mb-4 flex-1 flex flex-col justify-center"
                        />
                    </div>

                    <ThinDivider />

                    <div className="space-y-4">
                        <SectionTitle title="선호하는 음식종류 선택" />
                        <SelectionGrid
                            options={FOOD_TYPE_OPTIONS}
                            selectedItems={foodTypeSelector.selectedItems}
                            onToggle={handleFoodTypeToggle}
                            maxSelections={3}
                            totalSelections={totalSelections}
                            textSize="lg"
                            rowGap="sm"
                            layout={LAYOUT_CONFIGS.FOOD_TYPE}
                            showEmoji={true}
                            className="w-full mb-4 flex-1 flex flex-col justify-center"
                        />
                    </div>
            </div>

            {!isKeyboardVisible && (
                <BottomFixedButton
                    onClick={handleEditComplete}
                    variant={totalSelections === 3 && !isUpdating && !isUploading ? "primary" : "gray"}
                    disabled={isUpdating || isUploading || totalSelections !== 3 || !userName.trim()}
                >
                    수정완료
                </BottomFixedButton>
            )}
        </FixedFrameLayout>
    );
};

export default ProfileEditPage;
