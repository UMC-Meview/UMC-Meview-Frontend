import { useEffect, useRef, useState } from "react";
import { StoreFormData } from "../types/store";

export const useStoreRegistrationForm = () => {
    const blobUrlsRef = useRef<string[]>([]);
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

    // 위도/경도 업데이트
    const updateCoordinates = (latitude: number, longitude: number) => {
        setFormData(prev => ({ ...prev, latitude, longitude }));
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

    // 이미지 URL 생성 및 추적
    const getImageUrl = (file: File) => {
        const url = URL.createObjectURL(file);
        if (!blobUrlsRef.current.includes(url)) {
            blobUrlsRef.current.push(url);
        }
        return url;
    };

    // 이미지 URL 해제 및 추적 제거
    const revokeImage = (url: string) => {
        URL.revokeObjectURL(url);
        blobUrlsRef.current = blobUrlsRef.current.filter((u) => u !== url);
    };

    // 언마운트 시 남은 blob URL 정리
    useEffect(() => {
        return () => {
            blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
            blobUrlsRef.current = [];
        };
    }, []);

    return {
        formData,
        handleInputChange,
        updateCoordinates,
        handleMainImageSelect,
        handleReplaceMainImage,
        handleMenuChange,
        handleAddMenu,
        handleOpeningHourChange,
        handleAddOpeningHour,
        getImageUrl,
        revokeImage,
        isFormValid,
    };
}; 