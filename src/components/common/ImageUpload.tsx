import React from "react";

interface ImageUploadProps {
    label: string;
    onImageSelect?: (file: File) => void;
    className?: string;
    size?: "small" | "medium" | "large";
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    label,
    onImageSelect,
    className = "",
    size = "large",
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
        medium: "w-[115px] h-[115px]", // medium 사이즈를 115x115로 변경
        large: "w-32 h-32",
    };

    // +버튼(즉, label이 빈 문자열)일 때 medium 사이즈만 더 작게
    const getSizeStyle = () => {
        if (size === "medium" && label === "") {
            return "w-20 h-20"; // 80x80px
        }
        return sizeStyles[size];
    };

    const iconSizes = {
        small: { width: 42, height: 42 },
        medium: { width: 80, height: 80 }, // medium일 때 80x80으로 조정
        large: { width: 83, height: 83 },
    };

    // +버튼(즉, label이 빈 문자열)일 때 medium 사이즈만 더 작게
    const getIconSize = () => {
        if (size === "medium" && label === "") {
            return { width: 60, height: 60 };
        }
        return iconSizes[size];
    };

    return (
        <div
            className={`flex flex-col items-center ${className}`}
            style={{ width: size === "medium" ? 115 : undefined }}
        >
            <label className="cursor-pointer w-full flex flex-col items-center">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <div
                    className={`relative ${getSizeStyle()} bg-[#D9D9D9] border border-[#D9D9D9] rounded-xl flex items-center justify-center hover:bg-[#e5e5e5] transition-colors`}
                    style={{ aspectRatio: "1/1" }}
                >
                    {/* label이 비어있지 않을 때만 미리보기 이미지 렌더링 */}
                    {preview && label !== "" && (
                        <img
                            src={preview}
                            alt="미리보기"
                            className={`absolute top-0 left-0 w-full h-full object-cover rounded-xl`}
                            style={{ zIndex: 2 }}
                        />
                    )}
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
                </div>
            </label>
            <p className="text-gray-700 text-sm mt-2 text-center w-full break-keep">
                {label}
            </p>
        </div>
    );
};

export default ImageUpload;
