import React from "react";

interface ImageUploadProps {
    onImageSelect?: (file: File) => void;
    className?: string;
    size?: "small" | "large";
    variant?: "profile" | "default";
    children?: React.ReactNode;
    noBorder?: boolean;
    disablePreview?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onImageSelect,
    className = "",
    size = "large",
    variant = "default",
    children,
    noBorder = false,
    disablePreview = false,
}) => {
    const [preview, setPreview] = React.useState<string | null>(null);

    React.useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    React.useEffect(() => {
        if (!children && preview) {
            URL.revokeObjectURL(preview);
            setPreview(null);
        }
    }, [children, preview]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // disablePreview가 true이거나 children이 있을 때는 내장 미리보기 사용하지 않음
        if (!disablePreview && !children) {
            if (preview) URL.revokeObjectURL(preview);
            setPreview(URL.createObjectURL(file));
        }
        
        onImageSelect?.(file);
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
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                
                {/* 업로드 */}
                <div className={`relative ${containerClass} flex items-center justify-center transition-colors`}
                     style={{ aspectRatio: "1/1", width: "100%", height: "100%" }}>
                    
                    {/* 미리보기 */}
                    {preview && !disablePreview && !children && (
                        <img
                            src={preview}
                            alt="미리보기"
                            className={`absolute inset-0 w-full h-full object-cover ${isProfile ? "rounded-2xl" : "rounded-xl"}`}
                            style={{ zIndex: 2 }}
                        />
                    )}

                    {children}

                    {/* 플러스 아이콘*/}
                    {!preview && !children && (
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
