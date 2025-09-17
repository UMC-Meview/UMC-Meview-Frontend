import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "disabled" | "compact";
    disabled?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = "primary",
    disabled = false,
    className = "",
}) => {
    const baseClasses = "w-full text-lg font-bold rounded-full transition-colors";
    const variantStyles = {
        primary: `${baseClasses} h-[65px] bg-[#FF774C] text-white`,
        secondary: `${baseClasses} h-[65px] bg-white border border-gray-300 text-black`,
        disabled: `${baseClasses} h-[65px] bg-[#D9D9D9] text-white cursor-not-allowed`,
        compact: `${baseClasses} h-12 bg-[#FF774C] px-15 py-0 whitespace-nowrap text-white`,
    };

    const variantKey = disabled ? "disabled" : variant;

    return (
        <button className={`${variantStyles[variantKey]} ${className}`} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
};

export default Button;
