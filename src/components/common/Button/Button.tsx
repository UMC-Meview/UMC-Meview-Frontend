import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "compact";
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
        compact: `${baseClasses} h-12 bg-[#FF774C] px-15 py-0 whitespace-nowrap text-white`,
    };
    // variant는 색상,형태만, disabled는 상태를 나타내서 독립적인 prop으로 분리
    const disabledClasses = `${baseClasses} h-[65px] bg-[#D9D9D9] text-white cursor-not-allowed`;

    return (
        <button
            className={`${disabled ? disabledClasses : variantStyles[variant]} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
