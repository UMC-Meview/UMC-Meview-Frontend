import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button/Button.tsx";
import Header from "../../components/common/Header.tsx";
import FixedFrameLayout from "../../layouts/FixedFrameLayout";
import BottomFixedWrapper from "../../components/common/BottomFixedWrapper.tsx";
import SelectionGrid from "../../components/common/SelectionGrid";
import { useMultiSelect } from "../../hooks/useMultiSelect";
import { SIGNUP_TASTE_OPTIONS, LAYOUT_CONFIGS } from "../../constants/options";
import { updateTempPreferences } from "../../utils/auth";

const TastePreferencePage: React.FC = () => {
    const navigate = useNavigate();
    const { selectedItems: selectedTastes, toggleItem: toggleTaste } = useMultiSelect({ maxSelections: 3 });

    const handleNext = () => {
        // console.log("선택된 입맛들:", selectedTastes);
        // console.log("선택된 개수:", selectedTastes.length);
        if (selectedTastes.length >= 3) {
            updateTempPreferences(selectedTastes);
            navigate("/profile-info");
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <FixedFrameLayout
            header={<Header onBack={handleBack} showLogo={true} page={2} />}
        >
            <div className="px-6 mt-14">
                <div className="w-full max-w-[400px] mx-auto flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left leading-tight w-full">
                        <div>선호하는 입맛을</div>
                        <div className="flex items-end gap-2">
                            <div>알려주세요.</div>
                            <span className="text-gray-400 text-sm pb-1">(3개 선택)</span>
                        </div>
                    </h2>

                    <div className="w-full mb-8 flex-1 flex flex-col justify-center mt-18">
                        <SelectionGrid
                            options={SIGNUP_TASTE_OPTIONS}
                            selectedItems={selectedTastes}
                            onToggle={toggleTaste}
                            maxSelections={3}
                            textSize="base"
                            rowGap="md"
                            layout={LAYOUT_CONFIGS.SIGNUP_TASTE}
                            className="mb-4 flex-1 flex flex-col justify-center"
                        />
            </div>
                </div>
            </div>

            <BottomFixedWrapper>
                <Button
                    onClick={handleNext}
                    disabled={selectedTastes.length < 3}
                    variant="primary"
                >
                    다음 ({selectedTastes.length}/3)
                </Button>
            </BottomFixedWrapper>
        </FixedFrameLayout>
    );
};

export default TastePreferencePage;
