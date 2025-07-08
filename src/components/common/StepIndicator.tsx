import React from "react";

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
    className?: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
    currentStep,
    totalSteps,
    className,
}) => {
    return (
        <div className={`text-gray-400 text-sm font-medium ${className ?? ""}`}>
            {currentStep}/{totalSteps}
        </div>
    );
};

export default StepIndicator;
