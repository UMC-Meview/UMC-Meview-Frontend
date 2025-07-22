import React from "react";
import BackButton from "./Button/BackButton";

interface HeaderProps {
    onBack?: () => void;
    center?: React.ReactNode;
    right?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ onBack, center, right }) => {
    return (
        <>
            <div className="h-[64px]"></div>
            <div className="flex items-center justify-between px-4 py-3 bg-white">
                <div className="flex-1 flex justify-start min-w-0">
                    {onBack && <BackButton onClick={onBack} />}
                </div>
                <div className="flex-shrink-0 flex-grow-0 flex justify-center items-center min-h-[24px] font-bold">
                    {center}
                </div>
                <div className="flex-1 flex justify-end items-center min-w-0">
                    {right}
                </div>
            </div>
        </>
    );
};

export default Header;
