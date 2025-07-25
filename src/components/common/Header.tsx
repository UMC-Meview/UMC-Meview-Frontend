import React from "react";
import BackButton from "./Button/BackButton";
import logoIcon from "../../assets/Logo.svg";
import StepIndicator from "./StepIndicator";

interface HeaderProps {
    onBack?: () => void;
    center?: React.ReactNode;
    right?: React.ReactNode;
    showLogo?: boolean;
    currentStep?: number;
    totalSteps?: number;
    page?: number;
}

const Header: React.FC<HeaderProps> = ({ onBack, center, right, showLogo, currentStep, totalSteps, page }) => {
    const renderCenter = () => {
        if (showLogo) {
            return <img src={logoIcon} alt="Meview Logo" className="w-6 h-6" />;
        }
        if (typeof center === 'string') {
            return <h1 className="text-[19px] font-bold text-black">{center}</h1>;
        }
        return center;
    };

    const renderRight = () => {
        if (page && page >= 1 && page <= 3) {
            return <StepIndicator currentStep={page} totalSteps={3} className="scale-110" />;
        }
        if (currentStep && totalSteps) {
            return <StepIndicator currentStep={currentStep} totalSteps={totalSteps} className="scale-110" />;
        }
        if (right) {
            return right;
        }
        // right가 없을 때도 공간 유지를 위한 빈 div
        return <div className="w-[36px] h-[36px]"></div>;
    };

    return (
        <div className="sticky top-0 bg-white z-10" style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top))' }}>
            <div className="h-[64px]"></div>
            <div className="flex items-center justify-between px-4 py-3 bg-white">
                <div className="flex-1 flex justify-start min-w-0">
                    {onBack && <BackButton onClick={onBack} />}
                </div>
                <div className="flex-shrink-0 flex-grow-0 flex justify-center items-center min-h-[24px]">
                    {renderCenter()}
                </div>
                <div className="flex-1 flex justify-end items-center min-w-0">
                    {renderRight()}
                </div>
            </div>
        </div>
    );
};

export default Header;
