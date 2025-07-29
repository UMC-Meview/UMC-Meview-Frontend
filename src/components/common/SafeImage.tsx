import React, { useState } from "react";
import logoIcon from "../../assets/Logo.svg";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src?: string;
    alt: string;
    fallbackClassName?: string;
    showLogo?: boolean;
}

const SafeImage: React.FC<SafeImageProps> = ({
    src,
    alt,
    className = "",
    fallbackClassName = "",
    showLogo = true,
    ...props
}) => {
    const [hasError, setHasError] = useState(false);

    // src가 null/undefined인 경우, 에러가 발생한 경우, 또는 example.com이 포함된 경우 fallback 표시
    if (!src || hasError || (src && src.includes("example.com"))) {
        return (
            <div
                className={`bg-white flex items-center justify-center ${className} ${fallbackClassName}`}
                style={props.style}
            >
                {showLogo && (
                    <img
                        src={logoIcon}
                        alt="로고"
                        className="object-contain"
                        style={{
                            maxWidth: "60%",
                            maxHeight: "60%",
                            opacity: 0.3,
                        }}
                    />
                )}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => {
                setHasError(true);
            }}
            {...props}
        />
    );
};

export default SafeImage;
