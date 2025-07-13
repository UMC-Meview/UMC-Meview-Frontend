import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button/Button.tsx";
import ImageUpload from "../../components/common/ImageUpload.tsx";
import Header from "../../components/common/Header.tsx";
import BottomFixedWrapper from "../../components/common/BottomFixedWrapper.tsx";
import StoreInputField from "../../components/common/InputField.tsx";

const StoreRegistrationPage: React.FC = () => {
    const [formData, setFormData] = useState({
        storeName: "",
        address: "",
        phoneNumber: "",
        businessHours: "",
        mainImage: null as File | null,
        menuImages: [] as File[],
    });
    const navigate = useNavigate();

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleMainImageSelect = (file: File) => {
        setFormData((prev) => ({
            ...prev,
            mainImage: file,
        }));
    };

    const handleMenuImageSelect = (file: File) => {
        setFormData((prev) => ({
            ...prev,
            menuImages: [...prev.menuImages, file],
        }));
    };

    const isFormValid = () => {
        return (
            formData.storeName.trim() !== "" &&
            formData.address.trim() !== "" &&
            formData.phoneNumber.trim() !== "" &&
            formData.businessHours.trim() !== ""
        );
    };

    const handleSubmit = () => {
        if (isFormValid()) {
            // 여기서 실제 API 호출을 할 수 있습니다
            console.log("가게 등록 데이터:", formData);
            navigate("/qrcode");
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-white w-full relative flex flex-col">
            {/* 헤더: 상단 패딩을 늘려 더 아래로 */}
            <div className="pt-10">
                <Header
                    onBack={handleBack}
                    center={
                        <h1 className="text-xl font-bold text-gray-800">
                            가게 등록
                        </h1>
                    }
                />
            </div>
            {/* 메인 컨텐츠: 헤더와 간격 조정 */}
            <div className="px-6" style={{ marginTop: "32px" }}>
                {/* 메인 사진 업로드 */}
                <div className="mb-6 flex justify-center items-center w-full">
                    <ImageUpload
                        label="메인 사진 첨부하기"
                        onImageSelect={handleMainImageSelect}
                        className="mb-4"
                        size="medium"
                    />
                </div>
                {/* 입력 필드들 */}
                <div className="space-y-6">
                    {/* 상호명 */}
                    <StoreInputField
                        label="상호명"
                        value={formData.storeName}
                        onChange={(value) =>
                            handleInputChange("storeName", value)
                        }
                    />
                    {/* 가게 주소 */}
                    <StoreInputField
                        label="가게 주소"
                        value={formData.address}
                        onChange={(value) =>
                            handleInputChange("address", value)
                        }
                    />
                    {/* 가게 전화번호 */}
                    <StoreInputField
                        label="가게 전화번호"
                        value={formData.phoneNumber}
                        onChange={(value) =>
                            handleInputChange("phoneNumber", value)
                        }
                    />
                    {/* 영업시간 */}
                    <StoreInputField
                        label="영업시간"
                        value={formData.businessHours}
                        onChange={(value) =>
                            handleInputChange("businessHours", value)
                        }
                    />
                </div>
                {/* 메뉴판 사진 */}
                <div className="mt-6 mb-8">
                    <div className="flex items-start">
                        <span className="text-lg font-medium text-gray-800 w-24 flex-shrink-0">
                            메뉴판 사진
                        </span>
                        <div className="ml-4">
                            <ImageUpload
                                label=""
                                onImageSelect={handleMenuImageSelect}
                                size="small"
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* 등록 완료 버튼 - 하단 고정 */}
            <BottomFixedWrapper>
                <Button
                    variant={isFormValid() ? "primary" : "disabled"}
                    onClick={handleSubmit}
                    disabled={!isFormValid()}
                >
                    등록 완료
                </Button>
            </BottomFixedWrapper>
        </div>
    );
};

export default StoreRegistrationPage;
