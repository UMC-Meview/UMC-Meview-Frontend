import React from "react";

interface SelectableButtonProps {
    selected: boolean;
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
    shape?: "pill" | "rounded"; // 추가
}

const SelectableButton: React.FC<SelectableButtonProps> = ({
    selected,
    onClick,
    children,
    className = "",
    shape = "pill", // 기본값
}) => {
    const pillStyle =
        shape === "pill"
            ? `w-full h-full min-h-[36px] rounded-full shadow-[0_4px_16px_0_rgba(0,0,0,0.18)] text-base font-medium border bg-white
  ${
      selected
          ? "border-[#FF774C] text-gray-800"
          : "border-transparent text-gray-800"
  }`
            : "";
    const baseStyle =
        shape === "rounded"
            ? `w-full h-[88px] rounded-2xl shadow-md bg-white text-lg font-semibold flex items-center justify-center border-2 transition-all duration-150
      ${
          selected
              ? "border-[#FF774C] text-gray-700"
              : "border-gray-200 text-gray-700"
      }`
            : "";
    return (
        <button
            onClick={onClick}
            className={`${
                shape === "pill" ? pillStyle : baseStyle
            } ${className}`}
        >
            {children}
        </button>
    );
};

export default SelectableButton;
