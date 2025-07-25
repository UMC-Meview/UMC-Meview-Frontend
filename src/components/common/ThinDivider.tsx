import React from "react";

interface ThinDividerProps {
    className?: string;
}

const ThinDivider: React.FC<ThinDividerProps> = ({ className = "" }) => {
    return (
        <div className={`flex justify-center ${className}`}>
            <div className="w-[360px] h-[1px] bg-[#D9D9D9]"></div>
        </div>
    );
};

export default ThinDivider; 