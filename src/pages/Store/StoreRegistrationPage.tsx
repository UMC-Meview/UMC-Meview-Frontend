import React from "react";
import ImageUpload from "../../components/common/ImageUpload";
import Header from "../../components/common/Header";
import BottomFixedButton from "../../components/common/Button/BottomFixedButton";
import StoreFormInput from "../../components/store/StoreFormInput";
import StoreMenuSection from "../../components/store/StoreMenuSection";
import AddItemButton from "../../components/common/Button/AddItemButton";
import { useStoreRegistration } from "../../hooks/useStoreRegistration";

const StoreRegistrationPage: React.FC = () => {
    const {
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
    } = useStoreRegistration();

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
                            <ImageUpload
                                label=""
                                onImageSelect={handleMainImageSelect}
                                size="medium"
                                className="w-[115px] h-[115px]"
                            />
                        )}
                    </div>
                    <p className="text-gray-700 text-sm mt-2 text-center w-full break-keep">
                        메인 사진 첨부하기 <span className="text-gray-400">(최대 3개)</span>
                    </p>
                </div>
                {/* 입력 필드들 */}
                <div className="space-y-6">
                    {/* 상호명 */}
                    <StoreFormInput
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
                            <StoreFormInput
                                label=""
                                value={formData.postalCode}
                                onChange={value => handleInputChange("postalCode", value)}
                                placeholder=""
                                className="w-[120px]"
                                inputClassName="w-[120px] h-[32px]"
                            />
                            <StoreFormInput
                                label=""
                                type="button"
                                onClick={handlePostalCodeSearch}
                                inputClassName="w-[120px] h-[32px] text-sm"
                            >
                                우편번호검색
                            </StoreFormInput>
                        </div>
                        <StoreFormInput
                            label=""
                            value={formData.address}
                            onChange={value => handleInputChange("address", value)}
                            placeholder="가게 주소를 입력해주세요."
                            inputClassName="w-[338px] h-[32px]"
                        />
                        <StoreFormInput
                            label=""
                            value={formData.detailAddress}
                            onChange={value => handleInputChange("detailAddress", value)}
                            placeholder="상세 주소를 입력해주세요."
                            inputClassName="w-[338px] h-[32px]"
                        />
                    </div>
                    {/* 영업시간 */}
                    <div className="mt-6 mb-2">
                        <label className="block text-gray-800 font-medium mb-1">영업시간</label>
                        {formData.openingHours.map((hour, idx) => (
                            <div key={idx} className="mb-4">
                                <StoreFormInput
                                    label=""
                                    value={hour}
                                    onChange={value => handleOpeningHourChange(idx, value)}
                                    placeholder="영업시간을 입력해주세요. 예)월~금 09시~18시, 토 10시~16시"
                                    inputClassName="w-[338px] h-[96px]"
                                />
                            </div>
                        ))}
                        <AddItemButton onClick={handleAddOpeningHour} variant="center">
                            영업시간 추가하기 +
                        </AddItemButton>
                    </div>
                </div>
                {/* 메뉴판 사진 */}
                <StoreMenuSection onMenuChange={handleMenuChange} />
                <AddItemButton onClick={handleAddMenu} variant="full">
                  메뉴 추가하기 +
                </AddItemButton>
            </div>
            {/* 등록 완료 버튼 - 하단 고정 */}
            <BottomFixedButton
                onClick={handleSubmit}
                disabled={!isFormValid()}
                variant={isFormValid() ? "primary" : "disabled"}
            >
                가게 등록 완료
            </BottomFixedButton>
        </div>
    );
};

export default StoreRegistrationPage;
