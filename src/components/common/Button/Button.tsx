import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "disabled" | "gray" | "compact";
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
    const isLoginButton =
        typeof children === "string" && children === "로그인 하기";
    const baseStyles = `w-full h-[65px] text-lg font-bold rounded-full transition-colors`;

    const variantStyles = {
        primary: "bg-[#FF774C]",
        secondary: "bg-white border border-gray-300",
        disabled: "bg-gray-300 text-gray-500 cursor-not-allowed",
        gray: "bg-[#D9D9D9]",
        compact: "w-full h-12 text-lg font-bold rounded-full transition-colors bg-[#FF774C] px-15 py-0",
    };

    const hasCustomTextColor =
        /text-\[#[0-9A-Fa-f]{6}\]|text-black|!text-black|text-white/.test(
            className
        );
    const buttonStyles = disabled
        ? `${baseStyles} ${variantStyles["gray"]} ${
              isLoginButton && !hasCustomTextColor
                  ? "!text-black"
                  : !hasCustomTextColor
                  ? "text-white"
                  : ""
          } ${className}`
        : variant === "compact"
        ? `${variantStyles["compact"]} ${
              !hasCustomTextColor ? "text-white" : ""
          } ${className}`
        : `${baseStyles} ${
              variantStyles[variant !== "disabled" ? variant : "gray"]
          } ${
              isLoginButton && !hasCustomTextColor
                  ? "!text-black"
                  : !hasCustomTextColor
                  ? "text-white"
                  : ""
          } ${className}`;

    return (
        <button className={buttonStyles} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
};

export default Button;
