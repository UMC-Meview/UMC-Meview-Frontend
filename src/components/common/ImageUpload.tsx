import React from "react";

interface ImageUploadProps {
    label?: string;
    onImageSelect?: (file: File) => void;
    className?: string;
    size?: "small" | "medium" | "large";
    variant?: "default" | "profile"; // 프로필 이미지용 variant 추가
    children?: React.ReactNode; // 커스텀 내용을 위한 children 추가
    clickable?: boolean; // 클릭 가능 여부 제어
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    label,
    onImageSelect,
    className = "",
    size = "large",
    variant = "default",
    children,
    clickable = true,
}) => {
    const [preview, setPreview] = React.useState<string | null>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            if (onImageSelect) {
                onImageSelect(file);
            }
        }
    };

    const sizeStyles = {
        small: "w-16 h-16",
        medium: "w-[115px] h-[115px]",
        large: "w-32 h-32",
    };

    const getSizeStyle = () => {
        if (size === "medium" && label === "") {
            return "w-20 h-20";
        }
        return sizeStyles[size];
    };

    const iconSizes = {
        small: { width: 42, height: 42 },
        medium: { width: 80, height: 80 },
        large: { width: 83, height: 83 },
    };

    const getIconSize = () => {
        if (size === "medium" && label === "") {
            return { width: 60, height: 60 };
        }
        return iconSizes[size];
    };

    // 프로필 variant일 때의 스타일
    const getProfileStyle = () => {
        if (variant === "profile") {
            return "w-[110px] h-[110px] bg-white border-2 border-gray-200 rounded-2xl";
        }
        return `${getSizeStyle()} bg-[#D9D9D9] border border-[#D9D9D9] rounded-xl`;
    };

    return (
        <div
            className={`flex flex-col items-center ${className}`}
            style={{ width: size === "medium" ? 115 : undefined }}
        >
            <label className={`${clickable ? 'cursor-pointer' : 'cursor-default'} w-full flex flex-col items-center`}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <div
                    className={`relative ${getProfileStyle()} flex items-center justify-center transition-colors`}
                    style={{ aspectRatio: "1/1" }}
                >
                    {/* 미리보기 이미지 */}
                    {preview && (
                        <img
                            src={preview}
                            alt="미리보기"
                            className={`absolute top-0 left-0 w-full h-full object-cover ${variant === "profile" ? "rounded-2xl" : "rounded-xl"}`}
                            style={{ zIndex: 2 }}
                        />
                    )}
                    
                    {/* 커스텀 내용이 있으면 그것을 사용, 없으면 기본 + 아이콘 */}
                    {children ? (
                        <div style={{ zIndex: 1 }}>
                            {children}
                        </div>
                    ) : (
                        <svg
                            width={getIconSize().width}
                            height={getIconSize().height}
                            viewBox="0 0 24 24"
                            fill="none"
                            style={{
                                zIndex: 1,
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                display: "block",
                            }}
                        >
                            <path
                                d="M12 5V19M5 12H19"
                                stroke="white"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </div>
            </label>
            {label && (
                <p className="text-gray-700 text-sm mt-2 text-center w-full break-keep">
                    {label}
                </p>
            )}
        </div>
    );
};

export default ImageUpload;
