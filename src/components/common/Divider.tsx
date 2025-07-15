import React from "react";

interface DividerProps {
    className?: string;
}

const Divider: React.FC<DividerProps> = ({ className = "" }) => {
    return (
        <div
            className={`w-screen bg-[#F3F3F3] h-[6px] relative left-1/2 -translate-x-1/2 ${className}`}
        />
    );
};

export default Divider;
