import React from "react";

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    rounded?: "none" | "sm" | "md" | "lg" | "full";
    variant?: "text" | "rectangular" | "circular";
}

const Skeleton = ({
    className = "",
    width,
    height,
    rounded = "sm",
    variant = "rectangular",
}: SkeletonProps) => {
    const roundedClasses = {
        none: "rounded-none",
        sm: "rounded",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
    };

    const variantClasses = {
        text: "h-4",
        rectangular: "h-10",
        circular: "rounded-full",
    };

    const baseClasses = "bg-gray-200 animate-pulse";
    const roundedClass =
        variant === "circular" ? "rounded-full" : roundedClasses[rounded];
    const variantClass =
        variant !== "rectangular" ? variantClasses[variant] : "";

    const style: React.CSSProperties = {};
    if (width) style.width = width;
    if (height) style.height = height;

    return (
        <div
            className={`${baseClasses} ${roundedClass} ${variantClass} ${className}`}
            style={style}
        />
    );
};

export default Skeleton;
