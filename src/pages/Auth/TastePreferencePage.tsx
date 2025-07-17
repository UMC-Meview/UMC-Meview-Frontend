import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button/Button.tsx";
import StepIndicator from "../../components/common/StepIndicator.tsx";
import logoIcon from "../../assets/Logo.svg";
import SelectableButton from "../../components/common/Button/SelectableButton";
import Header from "../../components/common/Header.tsx";
import BottomFixedWrapper from "../../components/common/BottomFixedWrapper.tsx";
import { useMultiSelect } from "../../hooks/useMultiSelect";
import { SIGNUP_TASTE_OPTIONS } from "../../constants/tasteOptions";
import { updateTempPreferences } from "../../utils/auth";

const TastePreferencePage: React.FC = () => {
    const navigate = useNavigate();
    const { selectedItems: selectedTastes, toggleItem: toggleTaste } = useMultiSelect({ maxSelections: 3 });

    // 4개씩 4행으로 나누기 (마지막 행은 5개)
    const rows = [
        SIGNUP_TASTE_OPTIONS.slice(0, 4),   // 첫 번째 행
        SIGNUP_TASTE_OPTIONS.slice(4, 8),   // 두 번째 행  
        SIGNUP_TASTE_OPTIONS.slice(8, 12),  // 세 번째 행
        SIGNUP_TASTE_OPTIONS.slice(12, 17)  // 네 번째 행
    ];

    const handleNext = () => {
        console.log("선택된 입맛들:", selectedTastes);
        console.log("선택된 개수:", selectedTastes.length);
        if (selectedTastes.length >= 3) {
            updateTempPreferences(selectedTastes);
            navigate("/profile-info");
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-white w-full mx-auto relative flex flex-col">
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
                            currentStep={2}
                            totalSteps={3}
                            className="scale-110"
                        />
                    }
                />
            </div>

            <div className="flex-1 flex flex-col justify-start px-6 mt-14">
                <div className="w-full max-w-[400px] mx-auto flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left leading-tight w-full">
                        <div>선호하는 입맛을</div>
                        <div className="flex items-end gap-2">
                            <div>알려주세요.</div>
                            <span className="text-gray-400 text-sm pb-1">(3개 선택)</span>
                        </div>
                    </h2>

                    <div className="w-full mb-8 flex-1 flex flex-col justify-center mt-18">
                        {rows.map((row, index) => (
                            <div
                                key={index}
                                className="flex flex-row justify-center gap-3 mb-3 w-full"
                            >
                                {row.map((taste) => (
                                    <SelectableButton
                                        key={taste}
                                        selected={selectedTastes.includes(taste)}
                                        onClick={() => toggleTaste(taste)}
                                        disabled={!selectedTastes.includes(taste) && selectedTastes.length >= 3}
                                    >
                                        {taste}
                                    </SelectableButton>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <BottomFixedWrapper>
                <Button
                    onClick={handleNext}
                    disabled={selectedTastes.length < 3}
                    variant={selectedTastes.length >= 3 ? "primary" : "disabled"}
                >
                    다음 ({selectedTastes.length}/3)
                </Button>
            </BottomFixedWrapper>
        </div>
    );
};

export default TastePreferencePage;
