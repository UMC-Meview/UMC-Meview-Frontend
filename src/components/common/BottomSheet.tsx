import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    ReactNode,
} from "react";

interface BottomSheetProps {
    children: ReactNode;
    onFullScreenChange: (isFullScreen: boolean) => void;
    onExpandedChange?: (isExpanded: boolean) => void;
    forceExpanded?: boolean;
}

export interface BottomSheetContext {
    isExpanded: boolean;
    isFullScreen: boolean;
    setIsExpanded: (expanded: boolean) => void;
    setIsFullScreen: (fullScreen: boolean) => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
    children,
    onFullScreenChange,
    onExpandedChange,
    forceExpanded = false,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [startY, setStartY] = useState(0);
    const [currentY, setCurrentY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [hasMoved, setHasMoved] = useState(false);
    const [isMouseDragging, setIsMouseDragging] = useState(false);

    const sheetRef = useRef<HTMLDivElement>(null);

    const DRAG_THRESHOLD = 10;
    const SWIPE_THRESHOLD = 50;

    useEffect(() => {
        if (forceExpanded && !isExpanded) {
            setIsExpanded(true);
            onExpandedChange?.(true);
        }
    }, [forceExpanded, isExpanded, onExpandedChange]);

    const handleMove = useCallback(
        (clientY: number) => {
            if (!isDragging) return;

            setCurrentY(clientY);

            const moveDistance = Math.abs(clientY - startY);
            if (moveDistance > DRAG_THRESHOLD) {
                setHasMoved(true);
            }
        },
        [isDragging, startY]
    );

    const handleEnd = useCallback(() => {
        if (!isDragging) return;

        if (!hasMoved) {
            setIsDragging(false);
            setStartY(0);
            setCurrentY(0);
            setHasMoved(false);
            return;
        }

        const deltaY = startY - currentY;

        if (deltaY > SWIPE_THRESHOLD) {
            if (!isExpanded) {
                const newExpanded = true;
                setIsExpanded(newExpanded);
                onExpandedChange?.(newExpanded);
            } else if (!isFullScreen) {
                const newFullScreenState = true;
                setIsFullScreen(newFullScreenState);
                onFullScreenChange(newFullScreenState);
            }
        } else if (deltaY < -SWIPE_THRESHOLD) {
            if (isFullScreen) {
                const newFullScreenState = false;
                setIsFullScreen(newFullScreenState);
                onFullScreenChange(newFullScreenState);
            } else if (isExpanded) {
                const newExpanded = false;
                setIsExpanded(newExpanded);
                onExpandedChange?.(newExpanded);
            }
        }

        setIsDragging(false);
        setStartY(0);
        setCurrentY(0);
        setHasMoved(false);
    }, [
        isDragging,
        hasMoved,
        startY,
        currentY,
        isExpanded,
        isFullScreen,
        onFullScreenChange,
        onExpandedChange,
    ]);

    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (isMouseDragging) {
                handleMove(e.clientY);
            }
        };

        const handleGlobalMouseUp = () => {
            if (isMouseDragging) {
                setIsMouseDragging(false);
                handleEnd();
            }
        };

        if (isMouseDragging) {
            document.addEventListener("mousemove", handleGlobalMouseMove);
            document.addEventListener("mouseup", handleGlobalMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleGlobalMouseMove);
            document.removeEventListener("mouseup", handleGlobalMouseUp);
        };
    }, [
        isMouseDragging,
        startY,
        currentY,
        isExpanded,
        isFullScreen,
        handleEnd,
        handleMove,
    ]);

    const handleStart = (clientY: number) => {
        setStartY(clientY);
        setCurrentY(clientY);
        setIsDragging(true);
        setHasMoved(false);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        handleStart(e.touches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        handleMove(e.touches[0].clientY);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsMouseDragging(true);
        handleStart(e.clientY);
    };

    const handleExpandedChange = (expanded: boolean) => {
        setIsExpanded(expanded);
        onExpandedChange?.(expanded);
    };

    const handleFullScreenChange = (fullScreen: boolean) => {
        setIsFullScreen(fullScreen);
        onFullScreenChange(fullScreen);
    };

    const getSheetHeight = () => {
        if (isFullScreen) return "h-full";
        if (isExpanded) return "h-96";
        return "h-22";
    };

    const getSheetPosition = () => {
        if (isFullScreen) return "bottom-0";
        return "bottom-18";
    };

    const getSheetRounded = () => {
        return isFullScreen ? "" : "rounded-t-[24.5px]";
    };

    const bottomSheetContext: BottomSheetContext = {
        isExpanded,
        isFullScreen,
        setIsExpanded: handleExpandedChange,
        setIsFullScreen: handleFullScreenChange,
    };

    return (
        <div
            ref={sheetRef}
            className={`fixed left-0 right-0 ${getSheetPosition()} ${getSheetHeight()} ${getSheetRounded()} bg-white shadow-lg transition-all duration-300 ease-out z-40 flex flex-col ${
                isMouseDragging ? "select-none" : ""
            }`}
        >
            <div
                className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing flex-shrink-0"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleEnd}
                onMouseDown={handleMouseDown}
            >
                <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>

            <div className="flex-1 overflow-hidden">
                <div className="max-w-[390px] mx-auto h-full px-4">
                    {React.Children.map(children, (child) =>
                        React.isValidElement(child)
                            ? React.cloneElement(child, {
                                  bottomSheetContext,
                              } as {
                                  bottomSheetContext: BottomSheetContext;
                              })
                            : child
                    )}
                </div>
            </div>
        </div>
    );
};

export default BottomSheet;
