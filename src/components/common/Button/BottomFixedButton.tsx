import React from "react";
import Button from "./Button";

interface BottomFixedButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "disabled" | "gray";
    disabled?: boolean;
    className?: string;
}

const BottomFixedButton: React.FC<BottomFixedButtonProps> = ({
    onClick,
    children,
    variant = "primary",
    disabled = false,
    className = ""
}) => {
    return (
        <div className={`fixed bottom-0 left-0 right-0 pt-[13px] pb-[20px] px-6 z-10 bg-white border-t border-gray-300 ${className}`}>
            <Button 
                onClick={onClick} 
                variant={variant}
                disabled={disabled}
            >
                {children}
            </Button>
        </div>
    );
};

export default BottomFixedButton; 