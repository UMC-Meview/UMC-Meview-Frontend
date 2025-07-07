import React, { useState, useRef, useEffect, useCallback } from "react";
import { useGetRestaurantsList } from "../../hooks/queries/useGetRestaurantsList";
import { SortType } from "../../types/restaurant";

interface RestaurantBottomSheetProps {
    onFullScreenChange: (isFullScreen: boolean) => void;
}

const RestaurantBottomSheet: React.FC<RestaurantBottomSheetProps> = ({
    onFullScreenChange,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [selectedSort, setSelectedSort] =
        useState<SortType>("보너스금액 많은 순");
    const [startY, setStartY] = useState(0);
    const [currentY, setCurrentY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [hasMoved, setHasMoved] = useState(false);
    const [isMouseDragging, setIsMouseDragging] = useState(false);

    const sheetRef = useRef<HTMLDivElement>(null);
    const { sortedRestaurants, loading, error, sortBy } =
        useGetRestaurantsList();

    const sortOptions: SortType[] = [
        "보너스금액 많은 순",
        "리뷰 많은 순",
        "가까운 순",
        "찜 많은 순",
    ];

    const DRAG_THRESHOLD = 10;
    const SWIPE_THRESHOLD = 50;

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
                setIsExpanded(true);
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
                setIsExpanded(false);
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

    const handleSortChange = (sortType: SortType) => {
        setSelectedSort(sortType);
        sortBy(sortType);

        if (!isExpanded && !isFullScreen) {
            setIsExpanded(true);
        }
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

    return (
        <div
            ref={sheetRef}
            className={`fixed left-0 right-0 ${getSheetPosition()} ${getSheetHeight()} ${getSheetRounded()} bg-white shadow-lg transition-all duration-300 ease-out z-40 ${
                isMouseDragging ? "select-none" : ""
            }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleEnd}
            onMouseDown={handleMouseDown}
        >
            <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
                <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>

            <div
                className="px-4"
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex space-x-2 overflow-x-auto p-2">
                    {sortOptions.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleSortChange(option)}
                            className={`px-4 py-2 rounded-[28px] text-sm font-medium whitespace-nowrap shadow-sm ${
                                selectedSort === option
                                    ? "text-[#FF694F] bg-white border border-[#FF694F]"
                                    : "text-[#919191] bg-white border border-gray-200"
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {(isExpanded || isFullScreen) && (
                <div className="flex-1 overflow-y-auto px-4">
                    {loading && (
                        <div className="flex justify-center items-center py-8">
                            <div className="text-gray-500">
                                가게 정보를 불러오는 중...
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="flex justify-center items-center py-4">
                            <div className="text-red-500 text-sm">
                                {error}
                                <br />
                                <span className="text-gray-500 text-xs">
                                    더미 데이터를 표시합니다.
                                </span>
                            </div>
                        </div>
                    )}

                    {!loading &&
                        sortedRestaurants.map((restaurant) => (
                            <div
                                key={restaurant._id}
                                className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0"
                            >
                                <img
                                    src={restaurant.mainImage}
                                    alt={restaurant.name}
                                    className="w-20 h-20 rounded-lg object-cover"
                                />

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center space-x-2 justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold text-gray-900">
                                                {restaurant.name}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {restaurant.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        {restaurant.address}
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        영업시간 |{" "}
                                        <span className="text-[#FF694F]">
                                            {restaurant.operatingHours}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default RestaurantBottomSheet;
