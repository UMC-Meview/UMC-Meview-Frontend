import React, { useState, useEffect } from "react";
import Header from "../../components/common/Header";
import BottomFixedButton from "../../components/common/Button/BottomFixedButton";
import ProfileInfoSection from "../../components/common/auth/ProfileInfoSection";
import TasteSelectionGrid from "../../components/common/TasteSelectionGrid";
import ThinDivider from "../../components/common/ThinDivider";
import { PROFILE_TASTE_OPTIONS, FOOD_TYPE_OPTIONS, LAYOUT_CONFIGS } from "../../constants/tasteOptions";
import checkIcon from "../../assets/Check.svg";
import { useMultiSelect } from "../../hooks/useMultiSelect";
import { useGetUserProfile } from "../../hooks/queries/useGetUserProfile";
import { usePatchUserProfileEdit, PatchProfileRequest } from "../../hooks/queries/usePatchUserProfileEdit";
import { useNavigate } from "react-router-dom";

/**
 * 프로필 수정 페이지 컴포넌트
 */
const ProfileEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { data: userProfile } = useGetUserProfile();
    const { patchProfile, isLoading: isUpdating, isSuccess } = usePatchUserProfileEdit();
    
    // 멀티 선택 훅 초기화
    const tasteSelector = useMultiSelect({ maxSelections: 3 });
    const foodTypeSelector = useMultiSelect({ maxSelections: 3 });
    
    // 로컬 상태 관리
    const [userName, setUserName] = useState("");
    const [userDescription, setUserDescription] = useState("");
    const [profileImageUrl, setProfileImageUrl] = useState<string>("");

    // 선택된 항목 총 개수 계산
    const totalSelections = tasteSelector.selectedItems.length + foodTypeSelector.selectedItems.length;

    // 사용자 프로필 데이터로 초기값 설정
    useEffect(() => {
        if (userProfile) {
            setUserName(userProfile.nickname || "");
            setUserDescription(userProfile.introduction || "");
            setProfileImageUrl(userProfile.profileImageUrl || "");
            
            // 기존 선택된 취향 설정
            const existingPreferences = userProfile.tastePreferences || [];
            existingPreferences.forEach(preference => {
                if (PROFILE_TASTE_OPTIONS.some(option => option === preference)) {
                    tasteSelector.toggleItem(preference);
                } else if (FOOD_TYPE_OPTIONS.some(option => option.name === preference)) {
                    foodTypeSelector.toggleItem(preference);
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userProfile]);

    // 수정 완료 후 프로필 페이지로 이동
    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => navigate("/profile", { replace: true }), 300);
        }
    }, [isSuccess, navigate]);

    // 취향 선택 토글 핸들러
    const handleTasteToggle = (taste: string) => {
        if (totalSelections < 3 || tasteSelector.selectedItems.includes(taste)) {
            tasteSelector.toggleItem(taste);
        }
    };

    // 음식 종류 선택 토글 핸들러
    const handleFoodTypeToggle = (foodType: string) => {
        if (totalSelections < 3 || foodTypeSelector.selectedItems.includes(foodType)) {
            foodTypeSelector.toggleItem(foodType);
        }
    };

    // 프로필 수정 완료 핸들러
    const handleEditComplete = () => {
        // 유효성 검사
        if (totalSelections < 3 || !userName.trim()) return;

        const updateData: PatchProfileRequest = {
            nickname: userName.trim(),
            introduction: userDescription.trim(),
            tastePreferences: [...tasteSelector.selectedItems, ...foodTypeSelector.selectedItems],
            profileImageUrl: profileImageUrl,
        };

        patchProfile(updateData);
    };

    // 이미지 선택 핸들러
    const handleImageSelect = (file: File) => {
        setProfileImageUrl(URL.createObjectURL(file));
    };

    // 섹션 제목 컴포넌트
    const SectionTitle = ({ title }: { title: string }) => (
        <div className="flex items-baseline space-x-2 ml-4">
            <h2 className="text-[16px] font-semibold text-gray-800">{title}</h2>
            <img src={checkIcon} alt="체크" className="w-4 h-4" />
        </div>
    );

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* 헤더 */}
            <Header
                onBack={() => window.history.back()}
                center="프로필 수정"
            />

            {/* 스크롤 가능한 메인 컨텐츠 영역 */}
            <div className="flex-1 overflow-y-auto pb-20">
                {/* 프로필 정보 섹션 */}
                <ProfileInfoSection
                    imageUrl={profileImageUrl}
                    nickname={userName}
                    introduction={userDescription}
                    isEditable={true}
                    onImageSelect={handleImageSelect}
                    onNicknameChange={setUserName}
                    onIntroductionChange={setUserDescription}
                />

                <div className="px-6 sm:px-8 md:px-10 lg:px-12 py-6 space-y-5">
                    <ThinDivider />

                    {/* 입맛 선택 섹션 */}
                    <div className="space-y-4">
                        <SectionTitle title="입 맛 선택" />
                        <TasteSelectionGrid
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

                    {/* 음식종류 선택 섹션 */}
                    <div className="space-y-4">
                        <SectionTitle title="선호하는 음식종류 선택" />
                        <TasteSelectionGrid
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
            </div>

            {/* 하단 완료 버튼 */}
            <BottomFixedButton 
                onClick={handleEditComplete}
                variant={totalSelections >= 3 && !isUpdating ? "primary" : "gray"}
                disabled={isUpdating || totalSelections < 3}
            >
                {isUpdating ? "수정 중..." : "수정완료"}
            </BottomFixedButton>
        </div>
    );
};

export default ProfileEditPage;
