import React from "react";
import { ChevronLeft } from "lucide-react";

interface BottomSheetHeaderProps {
    onBack?: () => void;
    title?: string;
    children?: React.ReactNode;
}

const BottomSheetHeader: React.FC<BottomSheetHeaderProps> = ({
    onBack,
    title,
    children,
}) => {
    return (
        <div className="flex-shrink-0">
            <div className="flex items-center justify-between py-1">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="w-[40px] h-[40px] flex items-center py-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}
                {title && (
                    <h2 className="flex-1 text-center text-lg font-semibold">
                        {title}
                    </h2>
                )}
                {children && <div className="flex-1">{children}</div>}
            </div>
        </div>
    );
};

export default BottomSheetHeader;
