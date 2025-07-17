import React from "react";

interface SelectableButtonProps {
    selected: boolean;
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

const SelectableButton: React.FC<SelectableButtonProps> = ({
    selected,
    onClick,
    children,
    className = "",
    disabled = false,
}) => {
    const buttonStyle = `px-3 py-0.5 rounded-full shadow-[0_2px_8px_0_rgba(0,0,0,0.12)] text-[18px] font-medium border bg-white min-h-[24px] whitespace-nowrap
  ${
      selected
          ? "border-[#FF774C] text-gray-800"
          : "border-transparent text-gray-800"
  }`;

    return (
        <button
            onClick={onClick}
            className={`${buttonStyle} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default SelectableButton;
