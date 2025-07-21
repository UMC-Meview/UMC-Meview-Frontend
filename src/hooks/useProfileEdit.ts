import { useState } from "react";
import { useMultiSelect } from "./useMultiSelect";

export const useProfileEdit = () => {
    // 입맛 선택을 위한 멀티셀렉트 훅 (최대 3개 선택 가능)
    const {
        selectedItems: selectedTastes,
        toggleItem: toggleTaste
    } = useMultiSelect({ maxSelections: 3 });
    
    // 선호하는 음식종류 선택을 위한 멀티셀렉트 훅 (최대 3개 선택 가능)
    const {
        selectedItems: selectedFoodTypes,
        toggleItem: toggleFoodType
    } = useMultiSelect({ maxSelections: 3 });
    
    // 사용자 정보 상태 관리
    const [userName, setUserName] = useState("홍길동");
    const [userDescription, setUserDescription] = useState("...");

    // 총 선택된 항목 개수 계산
    const totalSelections = selectedTastes.length + selectedFoodTypes.length;

    /**
     * 총 선택 개수가 3개 미만이거나 이미 선택된 항목인 경우에만 토글 가능
     */
    const handleTasteToggle = (taste: string) => {
        if (totalSelections < 3 || selectedTastes.includes(taste)) {
            toggleTaste(taste);
        }
    };

    const handleFoodTypeToggle = (foodType: string) => {
        if (totalSelections < 3 || selectedFoodTypes.includes(foodType)) {
            toggleFoodType(foodType);
        }
    };

    const handleBack = () => {
        window.history.back();
    };

    const handleEditComplete = () => {
        // TODO: 프로필 수정 API 호출
        console.log('프로필 수정 완료!');
        console.log('선택된 입맛:', selectedTastes);
        console.log('선택된 음식종류:', selectedFoodTypes);
        console.log('사용자 이름:', userName);
        console.log('사용자 소개:', userDescription);
        console.log('총 선택 개수:', totalSelections);
    };

    /**
     * 사용자 이름 저장 핸들러
     */
    const handleNameSave = (name: string) => {
        setUserName(name);
    };

    /**
     * 사용자 소개 저장 핸들러
     */
    const handleDescriptionSave = (description: string) => {
        setUserDescription(description);
    };

    return {
        // 상태
        selectedTastes,
        selectedFoodTypes,
        userName,
        userDescription,
        totalSelections,
        
        // 핸들러
        handleTasteToggle,
        handleFoodTypeToggle,
        handleBack,
        handleEditComplete,
        handleNameSave,
        handleDescriptionSave,
    };
}; 