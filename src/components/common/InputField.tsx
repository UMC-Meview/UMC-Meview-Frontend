import React, { useState } from "react";

interface InputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    helperText?: string;
    minLength?: number;
    maxLength?: number;
    showValidation?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    value,
    onChange,
    placeholder = "",
    helperText = "",
    minLength = 0,
    maxLength = 100,
    showValidation = false,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const isValid = value.length >= minLength && value.length <= maxLength;
    const showCheckmark = showValidation && isValid && value.length > 0;

    // 줄바꿈 문자로 텍스트를 분리
    const labelLines = label.split("\n");

    return (
        <div className="w-full mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-left">
                {labelLines.map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
            </h2>

            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className={`w-full px-0 py-3 text-lg font-medium bg-transparent border-0 border-b-2 outline-none transition-colors ${
                        isFocused ? "border-[#FF4444]" : "border-gray-300"
                    }`}
                    maxLength={maxLength}
                />

                {showCheckmark && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                        <div className="w-6 h-6 bg-[#FF4444] rounded-full flex items-center justify-center">
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                            >
                                <path
                                    d="M2 6L4.5 8.5L10 3"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            {helperText && (
                <p className="text-gray-500 text-sm mt-2">{helperText}</p>
            )}
        </div>
    );
};

export default InputField;
