import React from "react";

interface FixedFrameLayoutProps {
    header?: React.ReactNode;
    children: React.ReactNode;
    contentClassName?: string;
    contentHeightOffset?: number;
    scrollable?: boolean;
}

const FixedFrameLayout: React.FC<FixedFrameLayoutProps> = ({
    header,
    children,
    contentClassName = "",
    contentHeightOffset = 180,
    scrollable = true,
}) => {
    return (
        <div className="bg-white mx-auto max-w-[390px]">
            {header && (
                <div className="sticky top-0 z-30 bg-white">{header}</div>
            )}

            {scrollable ? (
                <div
                    className={contentClassName}
                    style={{
                        height: `calc(100dvh - ${contentHeightOffset}px)`,
                        maxHeight: `calc(100dvh - ${contentHeightOffset}px)`,
                        overflowY: "auto",
                    }}
                >
                    {children}
                </div>
            ) : (
                <div className={`min-h-[100dvh] ${contentClassName}`}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default FixedFrameLayout;
