interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
    className?: string;
}

const StepIndicator = ({
    currentStep,
    totalSteps,
    className,
}: StepIndicatorProps) => {
    return (
        <div className={`text-gray-400 text-sm font-medium ${className ?? ""}`}>
            {currentStep}/{totalSteps}
        </div>
    );
};

export default StepIndicator;
