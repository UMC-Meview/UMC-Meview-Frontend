import { useEffect, useRef, useState } from "react";
import { StoreFormData } from "../types/store";
import { processImageForUpload } from "../utils/imageConversion";
import { usePostImageUpload } from "./queries/usePostImageUpload";

export const useStoreRegistrationForm = () => {
    const { uploadImageAsync } = usePostImageUpload();
    
    // 업로드된 이미지 URL 추적
    const [uploadedImageUrls, setUploadedImageUrls] = useState<Map<File, string>>(new Map());
    
    // 메인 이미지 삭제
    const handleRemoveMainImage = (idx: number) => {
        const removedFile = formData.mainImages[idx];
        setFormData(prev => ({
            ...prev,
            mainImages: prev.mainImages.filter((_, i) => i !== idx)
        }));
        // 업로드된 URL 추적에서도 제거
        setUploadedImageUrls(prev => {
            const newMap = new Map(prev);
            newMap.delete(removedFile);
            return newMap;
        });
    };
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

    // 메인 이미지 추가 (프로필 수정과 동일한 방식)
    const handleMainImageSelect = async (picked: File) => {
        if (formData.mainImages.length >= 3) {
            alert('이미지는 최대 3개까지 업로드 가능합니다.');
            return;
        }
        
        if (formData.mainImages.some(img => img.name === picked.name)) {
            alert('이미 동일한 이미지가 있습니다.');
            return;
        }

        try {
            const file = await processImageForUpload(picked, { sizeThreshold: 1_500_000, maxDimension: 2000, quality: 0.85 });
            
            // API 유효성 검사를 위해 실제 업로드 시도
            const result = await uploadImageAsync(file);
            
            // 업로드 성공 시 formData에 추가하고 URL 추적
            setFormData(prev => ({ ...prev, mainImages: [...prev.mainImages, file] }));
            setUploadedImageUrls(prev => new Map(prev).set(file, result.url));
        } catch (e) {
            console.error("메인 이미지 처리 실패", e);
            alert("이미지 처리에 실패했습니다. 다른 이미지를 선택해주세요.");
        }
    };

    // 메인 이미지 교체 (프로필 수정과 동일한 방식)
    const handleReplaceMainImage = async (idx: number, picked: File) => {
        try {
            const file = await processImageForUpload(picked, { sizeThreshold: 1_500_000, maxDimension: 2000, quality: 0.85 });
            
            // API 유효성 검사를 위해 실제 업로드 시도
            const result = await uploadImageAsync(file);
            
            // 이전 파일 정보 제거
            const oldFile = formData.mainImages[idx];
            setUploadedImageUrls(prev => {
                const newMap = new Map(prev);
                newMap.delete(oldFile);
                newMap.set(file, result.url);
                return newMap;
            });
            
            // 업로드 성공 시 formData 교체
            setFormData(prev => {
                const newImages = [...prev.mainImages];
                newImages[idx] = file;
                return { ...prev, mainImages: newImages };
            });
        } catch (e) {
            console.error("메인 이미지 교체 실패", e);
            alert("이미지 처리에 실패했습니다. 다른 이미지를 선택해주세요.");
        }
    };

    // 업로드된 메인 이미지 URL들 반환
    const getMainImageUrls = () => {
        return formData.mainImages.map(file => uploadedImageUrls.get(file)).filter(Boolean) as string[];
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

    // 메뉴 이미지 URL 반환
    const getMenuImageUrl = (file: File | null) => {
        return file ? uploadedImageUrls.get(file) : undefined;
    };

    return {
        formData,
        handleInputChange,
        updateCoordinates,
        handleMainImageSelect,
        handleReplaceMainImage,
        handleRemoveMainImage,
        handleMenuChange,
        handleAddMenu,
        handleOpeningHourChange,
        handleAddOpeningHour,
        getImageUrl,
        revokeImage,
        isFormValid,
        getMainImageUrls,
        getMenuImageUrl,
    };
}; 