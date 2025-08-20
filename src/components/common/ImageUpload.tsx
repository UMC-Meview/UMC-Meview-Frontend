import React from "react";

interface ImageUploadProps {
    onImageSelect?: (file: File) => void;
    className?: string;
    size?: "small" | "large";
    variant?: "profile" | "default";
    children?: React.ReactNode;
    noBorder?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onImageSelect,
    className = "",
    size = "large",
    variant = "default",
    children,
    noBorder = false,
}) => {
    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const picked = event.target.files?.[0];
            if (!picked) return;

            onImageSelect?.(picked);
            event.target.value = "";
        } catch (outerErr) {
            console.error("이미지 선택 처리 중 예외", outerErr);
            event.target.value = "";
        }
    };

    const isProfile = variant === "profile";
    const isSmall = size === "small";
    
    const containerClass = isProfile 
        ? `w-[110px] h-[110px] bg-white rounded-2xl ${noBorder ? "" : "border-2 border-gray-200"}`
        : `${isSmall ? "w-16 h-16" : "w-32 h-32"} bg-[#D9D9D9] rounded-xl ${noBorder ? "" : "border border-[#D9D9D9]"}`;
    
    const iconSize = isSmall ? 42 : 83;

    return (
        <div className={`flex flex-col items-center ${className}`}>
            <label className="cursor-pointer w-full flex flex-col items-center">
                <input type="file" accept="image/*,.heic,.heif" onChange={handleFileSelect} className="hidden" />
                
                <div className={`relative ${containerClass} flex items-center justify-center transition-colors`}
                     style={{ aspectRatio: "1/1", width: "100%", height: "100%" }}>
                    
                    {children}

                    {!children && (
                        <svg
                            width={iconSize}
                            height={iconSize}
                            viewBox="0 0 24 24"
                            fill="none"
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
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
        </div>
    );
};

export default ImageUpload;
