import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../components/common/ImageUpload";
import Header from "../../components/common/Header";
import BottomFixedWrapper from "../../components/common/BottomFixedWrapper";
import LabeledInput from "../../components/store/LabeledInput";
import MenuInput from "../../components/store/MenuInput";
import Button from "../../components/common/Button/Button";

const weekDays = ["월", "화", "수", "목", "금", "토", "일", "연휴"];

const StoreRegistrationPage: React.FC = () => {
    const [formData, setFormData] = useState<{
        storeName: string;
        postalCode: string;
        address: string;
        detailAddress: string;
        mainImages: File[];
        menuList: { image: File | null; name: string; price: string; detail: string }[];
        openingHours: { days: string[]; time: string }[];
    }>(
        {
            storeName: "",
            postalCode: "",
            address: "",
            detailAddress: "",
            mainImages: [],
            menuList: [
                { image: null, name: "", price: "", detail: "" },
                { image: null, name: "", price: "", detail: "" },
            ],
            openingHours: [
                { days: [], time: "" },
            ],
        }
    );
    const navigate = useNavigate();

    // 공통 input 핸들러
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // 메인 이미지
    const handleMainImageSelect = (file: File) => {
        setFormData(prev => {
            if (prev.mainImages.some(img => img.name === file.name && img.size === file.size)) return prev;
            if (prev.mainImages.length >= 3) return prev;
            return { ...prev, mainImages: [...prev.mainImages, file] };
        });
    };
    // 메인 이미지 삭제
    const handleRemoveMainImage = (idx: number) => {
        setFormData(prev => {
            const newImages = prev.mainImages.filter((_, i) => i !== idx);
            return { ...prev, mainImages: newImages };
        });
    };

    // 메뉴 관련
    const handleMenuImageSelect = (idx: number, file: File) => {
        setFormData(prev => {
            const newList = [...prev.menuList];
            newList[idx] = { ...newList[idx], image: file };
            return { ...prev, menuList: newList };
        });
    };
    const handleMenuFieldChange = (idx: number, field: 'name' | 'price' | 'detail', value: string) => {
        setFormData(prev => {
            const newList = [...prev.menuList];
            newList[idx] = { ...newList[idx], [field]: value };
            return { ...prev, menuList: newList };
        });
    };
    const handleAddMenu = () => {
        setFormData(prev => ({
            ...prev,
            menuList: [...prev.menuList, { image: null, name: "", price: "", detail: "" }],
        }));
    };

    // 영업시간 관련
    const handleOpeningHourFieldChange = (idx: number, field: 'days' | 'time', value: string) => {
        setFormData(prev => {
            const newHours = [...prev.openingHours];
            if (field === 'days') {
                const day = value;
                const days = newHours[idx].days.includes(day)
                    ? newHours[idx].days.filter((d: string) => d !== day)
                    : [...newHours[idx].days, day];
                newHours[idx] = { ...newHours[idx], days };
            } else {
                newHours[idx] = { ...newHours[idx], [field]: value };
            }
            return { ...prev, openingHours: newHours };
        });
    };
    const handleAddOpeningHour = () => {
        setFormData(prev => ({
            ...prev,
            openingHours: [...prev.openingHours, { days: [], time: "" }],
        }));
    };

    // 유효성 검사
    const isFormValid = () => (
        formData.storeName.trim() !== "" &&
        formData.address.trim() !== ""
    );

    // 제출
    const handleSubmit = () => {
        if (isFormValid()) {
            console.log("가게 등록 데이터:", formData);
            navigate("/qrcode");
        }
    };

    const handleBack = () => navigate('/login');

    return (
        <div className="min-h-screen bg-white w-full relative flex flex-col max-w-screen-sm mx-auto">
            {/* 헤더: 로그인/회원가입과 동일하게 pt-10 */}
            <div className="pt-10">
                <Header
                    onBack={handleBack}
                    center={
                        <h1
                            className="text-lg font-bold text-gray-800 text-center"
                            style={{ transform: "translateX(10px)" }}
                        >
                            가게 등록하기
                        </h1>
                    }
                    right={<div style={{ width: 40 }} />}
                />
            </div>
            {/* 메인 사진 업로드 */}
            <div className="px-4 sm:px-6 w-full max-w-screen-sm mx-auto" style={{ marginTop: "0px" }}>
                <div className="mb-6 flex flex-col items-center w-full">
                    <div className="flex gap-1 items-center justify-center">
                        {formData.mainImages.map((file, idx) => (
                            <div
                                key={idx}
                                className="w-[115px] h-[115px] flex items-center justify-center rounded-xl bg-[#F5F5F5] overflow-hidden relative"
                            >
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`메인사진${idx+1}`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-black bg-opacity-50 rounded-full text-white text-xs z-10 hover:bg-opacity-80 transition"
                                    onClick={() => handleRemoveMainImage(idx)}
                                    aria-label="이미지 삭제"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        {formData.mainImages.length < 3 && (
                            <div className="w-[115px] h-[115px] flex items-center justify-center rounded-xl cursor-pointer">
                                <ImageUpload
                                    label=""
                                    onImageSelect={handleMainImageSelect}
                                    size="medium"
                                    className="w-full h-full flex items-center justify-center bg-transparent"
                                />
                            </div>
                        )}
                    </div>
                    <p className="text-gray-700 text-sm mt-2 text-center w-full break-keep">
                        메인 사진 첨부하기 <span className="text-gray-400">(최대 3개)</span>
                    </p>
                </div>
                {/* 입력 필드들 */}
                <div className="space-y-6">
                    {/* 상호명 */}
                    <LabeledInput
                        label="상호명"
                        value={formData.storeName}
                        onChange={value => handleInputChange("storeName", value)}
                        placeholder="상호명을 입력해주세요."
                        inputClassName="w-[338px] h-[32px]"
                    />
                    {/* 가게 주소 */}
                    <div className="space-y-2">
                        <label className="block text-gray-800 font-medium mb-1">가게 주소</label>
                        <div className="flex gap-2 items-center mb-2">
                            <LabeledInput
                                label=""
                                value={formData.postalCode}
                                onChange={value => handleInputChange("postalCode", value)}
                                placeholder=""
                                className="w-[120px]"
                                inputClassName="w-[120px] h-[32px]"
                            />
                            <button
                                type="button"
                                className="bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 whitespace-nowrap h-[32px] px-3"
                                style={{ lineHeight: "1" }}
                            >
                                우편번호검색
                            </button>
                        </div>
                        <LabeledInput
                            label=""
                            value={formData.address}
                            onChange={value => handleInputChange("address", value)}
                            placeholder="가게 주소를 입력해주세요."
                            inputClassName="w-[338px] h-[32px]"
                        />
                        <LabeledInput
                            label=""
                            value={formData.detailAddress}
                            onChange={value => handleInputChange("detailAddress", value)}
                            placeholder="상세 주소를 입력해주세요."
                            inputClassName="w-[338px] h-[32px]"
                        />
                    </div>
                    {/* 영업시간 */}
                    <div className="mt-6 mb-2">
                        <label className="block text-gray-800 font-medium mb-1">영업시간 <span className="text-gray-400 text-xs">요일을 선택 후 영업시간을 입력해주세요</span></label>
                        {formData.openingHours.map((hour, idx) => {
                            const isLast = idx === formData.openingHours.length - 1;
                            let otherSelectedDays: string[] = [];
                            if (isLast) {
                                otherSelectedDays = formData.openingHours
                                    .filter((_, i) => i !== idx)
                                    .flatMap(hour => hour.days);
                            }
                            return (
                                <div key={idx} className="mb-4">
                                    <div className="flex gap-1 flex-nowrap mb-2 w-[338px] mx-auto">
                                        {weekDays.map((day) => {
                                            const isDisabled = isLast ? otherSelectedDays.includes(day) : false;
                                            return (
                                                <button
                                                    key={day}
                                                    type="button"
                                                    className={`w-[39px] h-8 flex items-center justify-center rounded-full border text-sm font-medium transition-colors
                                                        ${hour.days.includes(day) ? "border-orange-400 text-orange-500" :
                                                          isDisabled ? "bg-[#D9D9D9] border-[#D9D9D9] text-white" : "border-gray-200 text-gray-500"}
                                                    `}
                                                    onClick={() => !isDisabled && handleOpeningHourFieldChange(idx, 'days', day)}
                                                    disabled={isDisabled}
                                                >
                                                    {day}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <LabeledInput
                                        label=""
                                        value={hour.time}
                                        onChange={value => handleOpeningHourFieldChange(idx, 'time', value)}
                                        placeholder="영업시간을 입력해주세요. 예)09시~18시/영업안함"
                                        inputClassName="w-[338px] h-[32px]"
                                    />
                                </div>
                            );
                        })}
                        <button
                            type="button"
                            className="text-black font-medium text-base mt-1 mx-auto block"
                            onClick={handleAddOpeningHour}
                        >
                            영업시간 추가하기 +
                        </button>
                    </div>
                </div>
                {/* 메뉴판 사진 */}
                <div className="mt-6 mb-8 relative">
                    <label className="block text-gray-800 font-medium mb-1">메뉴판 사진</label>
                    <div className="flex flex-col gap-4 pb-28">
                        {formData.menuList.map((menu, idx) => (
                            <MenuInput
                                key={idx}
                                menu={menu}
                                idx={idx}
                                onImageSelect={handleMenuImageSelect}
                                onFieldChange={handleMenuFieldChange}
                            />
                        ))}
                        <button
                            type="button"
                            className="mt-2 w-full bg-white text-black font-medium text-base rounded-lg py-3"
                            onClick={handleAddMenu}
                        >
                            메뉴 추가하기 +
                        </button>
                    </div>
                </div>
            </div>
            {/* 등록 완료 버튼 - 하단 고정 */}
            <BottomFixedWrapper>
                <Button
                    onClick={handleSubmit}
                    disabled={!isFormValid()}
                    variant={isFormValid() ? "primary" : "disabled"}
                >
                    가게 등록 완료
                </Button>
            </BottomFixedWrapper>
        </div>
    );
};

export default StoreRegistrationPage;
