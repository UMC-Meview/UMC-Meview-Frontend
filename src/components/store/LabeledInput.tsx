import React from "react";

interface LabeledInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
}

const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
  inputClassName = "",
  disabled = false,
}) => (
  <div className={className}>
    <label className="block text-gray-800 font-medium mb-1">{label}</label>
    <input
      type={type}
      className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-[#FF774C] placeholder:text-xs ${inputClassName}`}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
    />
  </div>
);

export default LabeledInput; 