import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepIndicator from "../../components/common/StepIndicator.tsx";
import Button from "../../components/common/Button/Button";
import logoIcon from "../../assets/Logo.svg";
import SelectableButton from "../../components/common/Button/SelectableButton";
import Header from "../../components/common/Header.tsx";
import BottomFixedWrapper from "../../components/common/BottomFixedWrapper.tsx";

const ProfileInfoPage: React.FC = () => {
    const [birthDate, setBirthDate] = useState<string>("");
    const [selectedGender, setSelectedGender] = useState<string>("");
    const navigate = useNavigate();

    const handleBirthDateChange = (value: string) => {
        const numericValue = value.replace(/[^0-9]/g, "");
        if (numericValue.length <= 6) {
            setBirthDate(numericValue);
        }
    };

    const handleGenderSelect = (gender: string) => {
        setSelectedGender(gender);
    };

    const handleNext = () => {
        if (birthDate.length === 6 && selectedGender) {
            navigate("/signup-complete");
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const isFormValid = birthDate.length === 6 && selectedGender;

    return (
        <div className="min-h-screen bg-white w-full relative flex flex-col">
            {/* 헤더: 상단 패딩을 늘려 더 아래로 */}
            <div className="pt-10">
                <Header
                    onBack={handleBack}
                    center={
                        <img
                            src={logoIcon}
                            alt="Meview Logo"
                            className="w-6 h-6"
                        />
                    }
                    right={
                        <StepIndicator
                            currentStep={3}
                            totalSteps={3}
                            className="scale-110"
                        />
                    }
                />
            </div>
            {/* 타이틀 wrapper: 헤더 아래 고정, 통일된 스타일 */}
            <div className="flex-1 flex flex-col justify-start px-6">
                <div className="w-full max-w-[400px] mx-auto flex flex-col items-center mb-8" style={{ marginTop: "56px" }}>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left leading-tight w-full">
                        <div>출생년도와 성별을</div>
                        <div>알려주세요</div>
                    </h2>
                </div>
                {/* Content: 타이틀 아래에서 시작 */}
                <div className="w-full max-w-[400px] mx-auto flex flex-col items-center">
                    {/* 생년월일 입력 */}
                    <div className="mb-12 w-full">
                        <p className="text-gray-600 text-sm mb-1">생년월일</p>
                        <div className="relative">
                            <input
                                type="text"
                                value={birthDate}
                                onChange={(e) =>
                                    handleBirthDateChange(e.target.value)
                                }
                                placeholder="예시) 250701"
                                className="w-full px-0 py-2 text-lg font-medium bg-transparent border-0 border-b-2 border-black outline-none transition-colors focus:border-[#FF774C]"
                                maxLength={6}
                            />
                        </div>
                    </div>
                    {/* 성별 선택 */}
                    <div className="mb-8 w-full mt-10">
                        <p className="text-gray-600 text-sm mb-4">성별</p>
                        <div className="flex gap-4">
                            {["남성", "여성"].map((option) => (
                                <SelectableButton
                                    key={option}
                                    selected={selectedGender === option}
                                    onClick={() => handleGenderSelect(option)}
                                    className="flex-1"
                                    shape="rounded"
                                >
                                    {option}
                                </SelectableButton>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* Bottom Button */}
            <BottomFixedWrapper>
                <Button
                    onClick={handleNext}
                    disabled={!isFormValid}
                    variant={isFormValid ? "primary" : "disabled"}
                >
                    가입완료
                </Button>
            </BottomFixedWrapper>
        </div>
    );
};

export default ProfileInfoPage;
