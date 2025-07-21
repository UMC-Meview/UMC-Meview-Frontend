import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface StoreFormData {
  storeName: string;
  postalCode: string;
  address: string;
  detailAddress: string;
  mainImages: File[];
  menuList: { image: File | null; name: string; price: string; detail: string }[];
  openingHours: string[];
}

export const useStoreRegistration = () => {
  const [formData, setFormData] = useState<StoreFormData>({
    storeName: "",
    postalCode: "",
    address: "",
    detailAddress: "",
    mainImages: [],
    menuList: [],
    openingHours: [""],
  });
  const navigate = useNavigate();

  // 공통 input 핸들러
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 메인 이미지 추가 (최대 3개, 중복 방지)
  const handleMainImageSelect = (file: File) => {
    setFormData(prev => {
      if (prev.mainImages.length >= 3) return prev;
      if (prev.mainImages.some(img => img.name === file.name && img.size === file.size)) return prev;
      return { ...prev, mainImages: [...prev.mainImages, file] };
    });
  };

  // 메인 이미지 제거
  const handleRemoveMainImage = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      mainImages: prev.mainImages.filter((_, i) => i !== idx)
    }));
  };

  // 메뉴 목록 업데이트
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

  // 영업시간 필드 변경 (컴포넌트에서 사용하는 방식과 일치)
  const handleOpeningHourChange = (idx: number, value: string) => {
    setFormData(prev => {
      const newHours = [...prev.openingHours];
      newHours[idx] = value;
      return { ...prev, openingHours: newHours };
    });
  };

  // 영업시간 필드 추가
  const handleAddOpeningHour = () => {
    setFormData(prev => ({
      ...prev,
      openingHours: [...prev.openingHours, ""]
    }));
  };

  // 우편번호 검색 핸들러
  const handlePostalCodeSearch = () => {
    // TODO: 실제 우편번호 검색 API 연동
    console.log("우편번호 검색 기능 구현 필요");
  };

  // 폼 유효성 검사
  const isFormValid = () => 
    formData.storeName.trim() !== "" && formData.address.trim() !== "";

  // 폼 제출
  const handleSubmit = () => {
    if (isFormValid()) {
      console.log("가게 등록 데이터:", formData);
      navigate("/qrcode");
    }
  };

  const handleBack = () => navigate('/login');

  return {
    formData,
    handleInputChange,
    handleMainImageSelect,
    handleRemoveMainImage,
    handleMenuChange,
    handleAddMenu,
    handleOpeningHourChange,
    handleAddOpeningHour,
    handlePostalCodeSearch,
    isFormValid,
    handleSubmit,
    handleBack,
  };
}; 