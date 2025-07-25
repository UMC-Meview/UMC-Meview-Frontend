import React from "react";

interface StoreFormInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  type?: "input" | "button";
  onClick?: () => void;
  children?: React.ReactNode;
  variant?: "default" | "small" | "medium" | "large";
  disabled?: boolean;
}

const StoreFormInput: React.FC<StoreFormInputProps> = ({
  value = "",
  onChange,
  placeholder = "",
  className = "",
  inputClassName = "",
  type = "input",
  onClick,
  children,
  variant = "default",
  disabled = false,
}) => {
  // variant에 따른 기본 스타일
  const getVariantStyles = () => {
    switch (variant) {
      case "small":
        return "w-24 h-8"; // 96px x 32px, 더 작은 크기
      case "large":
        return "w-full h-24"; // 전체 너비, 96px 높이
      case "medium":
        return "w-full h-8"; // 전체 너비, 32px 높이, 메뉴 입력용
      default:
        return "w-full h-8"; // 전체 너비, 32px 높이
    }
  };

  const baseStyles = `border border-gray-300 rounded-lg px-3 py-2 text-xs font-normal focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-[#FF774C] ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`;
  const variantStyles = getVariantStyles();
  const finalInputClassName = `${baseStyles} ${variantStyles} ${inputClassName}`;

  return (
    <div className={className}>
      {type === "input" ? (
        variant === "large" ? (
          <textarea
            className={`${finalInputClassName} placeholder:text-xs resize-none`}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            onChange={e => onChange?.(e.target.value)}
            onBlur={e => onChange?.(e.target.value)}
            rows={4}
          />
        ) : (
          <input
            type="text"
            className={`${finalInputClassName} placeholder:text-xs`}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            onChange={e => onChange?.(e.target.value)}
            onBlur={e => onChange?.(e.target.value)}
          />
        )
      ) : (
        <button
          type="button"
          className={`${finalInputClassName} bg-white text-gray-700 font-medium flex items-center justify-center`}
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </button>
      )}
    </div>
  );
};

export default StoreFormInput; 