import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button/Button.tsx";
import StepIndicator from "../../components/common/StepIndicator.tsx";
import logoIcon from "../../assets/Logo.svg";
import SelectableButton from "../../components/common/Button/SelectableButton";
import Header from "../../components/common/Header.tsx";
import BottomFixedWrapper from "../../components/common/BottomFixedWrapper.tsx";

const TastePreferencePage: React.FC = () => {
    const [selectedTastes, setSelectedTastes] = useState<string[]>([]);
    const navigate = useNavigate();

    const tastes = [
        "매운맛",
        "짠맛",
        "단맛",
        "새콤한",
        "담백한",
        "느끼한",
        "자극적인",
        "기름진",
        "회",
        "해산물",
        "채식",
        "향신료",
        "양식",
        "한식",
        "일식",
        "중식",
        "고기",
    ];

    // 행별 개수로 2차원 배열로 나누는 함수
    const rowCounts = [4, 4, 4, 5];
    function splitRows(arr: string[], counts: number[]) {
        let idx = 0;
        return counts.map((count) => arr.slice(idx, (idx += count)));
    }
    const tasteRows = splitRows(tastes, rowCounts);

    const toggleTaste = (taste: string) => {
        setSelectedTastes((prev) =>
            prev.includes(taste)
                ? prev.filter((t) => t !== taste)
                : [...prev, taste]
        );
    };

    const handleNext = () => {
        if (selectedTastes.length >= 2) {
            navigate("/profile-info");
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-white max-w-[390px] w-full mx-auto relative flex flex-col">
            {/* 헤더*/}
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
            {/* Content*/}
            <div
                className="flex-1 flex flex-col justify-start px-6"
                style={{ marginTop: "80px" }}
            >
                <div className="w-full mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-10 text-left leading-tight">
                        <div>선호하는 입맛을</div>
                        <div className="flex items-end gap-2">
                            <div>알려주세요.</div>
                            <span className="text-gray-400 text-sm pb-1">
                                (최소 2개)
                            </span>
                        </div>
                    </h2>
                    {/* Taste Selection Grid */}
                    <div className="w-full mb-8">
                        {tasteRows.map((row, rowIdx) => (
                            <div
                                key={rowIdx}
                                className="flex flex-row justify-center gap-3 mb-3 w-full"
                            >
                                {row.map((taste) => (
                                    <SelectableButton
                                        key={taste}
                                        selected={selectedTastes.includes(
                                            taste
                                        )}
                                        onClick={() => toggleTaste(taste)}
                                        className="text-base font-medium px-4 py-2"
                                    >
                                        {taste}
                                    </SelectableButton>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Bottom Button */}
            <BottomFixedWrapper>
                <Button
                    onClick={handleNext}
                    disabled={selectedTastes.length < 2}
                    variant={
                        selectedTastes.length >= 2 ? "primary" : "disabled"
                    }
                >
                    다음 ({selectedTastes.length}/2)
                </Button>
            </BottomFixedWrapper>
        </div>
    );
};

export default TastePreferencePage;
