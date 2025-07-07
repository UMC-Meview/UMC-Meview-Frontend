import React, { useState } from "react";
import { useGetRestaurantsList } from "../../hooks/queries/useGetRestaurantsList";
import { SortType } from "../../types/restaurant";
import { BottomSheetContext } from "../common/BottomSheet";

interface RestaurantListProps {
    bottomSheetContext?: BottomSheetContext;
    onRestaurantSelect?: (restaurantId: string) => void;
}

const RestaurantList: React.FC<RestaurantListProps> = ({
    bottomSheetContext,
    onRestaurantSelect,
}) => {
    const [selectedSort, setSelectedSort] =
        useState<SortType>("보너스금액 많은 순");
    const { sortedRestaurants, loading, error, sortBy } =
        useGetRestaurantsList();

    const sortOptions: SortType[] = [
        "보너스금액 많은 순",
        "리뷰 많은 순",
        "가까운 순",
        "찜 많은 순",
    ];

    const handleSortChange = (sortType: SortType) => {
        setSelectedSort(sortType);
        sortBy(sortType);

        if (
            bottomSheetContext &&
            !bottomSheetContext.isExpanded &&
            !bottomSheetContext.isFullScreen
        ) {
            bottomSheetContext.setIsExpanded(true);
        }
    };

    const handleRestaurantClick = (restaurantId: string) => {
        onRestaurantSelect?.(restaurantId);
    };

    const { isExpanded, isFullScreen } = bottomSheetContext || {};

    return (
        <>
            {/* 정렬 옵션 */}
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

            {/* 레스토랑 리스트 */}
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
                                className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() =>
                                    handleRestaurantClick(restaurant._id)
                                }
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
        </>
    );
};

export default RestaurantList;
