import { useState } from "react";
import { StoreFormData } from "../types/store";

export const useStoreRegistrationForm = () => {
    const [formData, setFormData] = useState<StoreFormData>({
        storeName: "",
        category: "한식",
        description: "",
        address: "",
        detailAddress: "",
        postalCode: "",
        latitude: 37.5665,
        longitude: 126.978,
        openingHours: [""],
        mainImages: [],
        menuList: [
            { name: "", price: "", detail: "", image: null },
            { name: "", price: "", detail: "", image: null },
        ],
    });

    // 기본 입력 변경
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // 메인 이미지 추가
    const handleMainImageSelect = (file: File) => {
        if (formData.mainImages.length >= 3) {
            alert('이미지는 최대 3개까지 업로드 가능합니다.');
            return;
        }
        
        if (formData.mainImages.some(img => img.name === file.name)) {
            alert('이미 동일한 이미지가 있습니다.');
            return;
        }
        
        setFormData(prev => ({ ...prev, mainImages: [...prev.mainImages, file] }));
    };

    // 메인 이미지 교체
    const handleReplaceMainImage = (idx: number, file: File) => {
        setFormData(prev => {
            const newImages = [...prev.mainImages];
            newImages[idx] = file;
            return { ...prev, mainImages: newImages };
        });
    };

    // 메뉴 변경
    const handleMenuChange = (menus: { image: File | null; name: string; price: string; detail: string }[]) => {
        setFormData(prev => ({ ...prev, menuList: menus }));
    };

    // 메뉴 추가
    const handleAddMenu = () => {
        setFormData(prev => ({
            ...prev,
            menuList: [...prev.menuList, { image: null, name: "", price: "", detail: "" }]
        }));
    };

    // 영업시간 변경
    const handleOpeningHourChange = (idx: number, value: string) => {
        setFormData(prev => {
            const newHours = [...prev.openingHours];
            newHours[idx] = value;
            return { ...prev, openingHours: newHours };
        });
    };

    // 영업시간 추가
    const handleAddOpeningHour = () => {
        setFormData(prev => ({
            ...prev,
            openingHours: [...prev.openingHours, ""]
        }));
    };

    // 폼 유효성 검사
    const isFormValid = () => {
        return formData.storeName.trim() !== "" && formData.address.trim() !== "";
    };

    // 이미지를 base64로 변환
    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
        });
    };

    // 이미지 URL 생성
    const getImageUrl = (file: File) => URL.createObjectURL(file);

    // 이미지 URL 해제
    const revokeImage = (url: string) => URL.revokeObjectURL(url);

    return {
        formData,
        handleInputChange,
        handleMainImageSelect,
        handleReplaceMainImage,
        handleMenuChange,
        handleAddMenu,
        handleOpeningHourChange,
        handleAddOpeningHour,
        getImageUrl,
        revokeImage,
        convertToBase64,
        isFormValid,
    };
}; 