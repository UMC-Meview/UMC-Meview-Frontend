import React from "react";

interface StoreFormInputProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  type?: "input" | "button";
  onClick?: () => void;
  children?: React.ReactNode;
}

const StoreFormInput: React.FC<StoreFormInputProps> = ({
  label,
  value = "",
  onChange,
  placeholder = "",
  className = "",
  inputClassName = "",
  type = "input",
  onClick,
  children,
}) => (
  <div className={className}>
    <label className="block text-gray-800 font-medium mb-1">{label}</label>
    {type === "input" ? (
      <input
        type="text"
        className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-[#FF774C] placeholder:text-xs ${inputClassName}`}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        onBlur={e => onChange?.(e.target.value)}
      />
    ) : (
      <button
        type="button"
        className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-[#FF774C] bg-white text-gray-700 font-medium flex items-center justify-center ${inputClassName}`}
        onClick={onClick}
      >
        {children}
      </button>
    )}
  </div>
);

export default StoreFormInput; 