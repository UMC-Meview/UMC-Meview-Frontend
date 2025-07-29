import React from "react";

interface ThinDividerProps {
    className?: string;
    width?: string;
}

const ThinDivider: React.FC<ThinDividerProps> = ({ className = "", width = "360px" }) => {
    return (
        <div className={`flex justify-center ${className}`}>
            <div className={`h-[1px] bg-[#D9D9D9]`} style={{ width }}></div>
        </div>
    );
};

export default ThinDivider; 