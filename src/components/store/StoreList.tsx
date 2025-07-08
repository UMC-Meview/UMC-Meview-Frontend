import React, { useState } from "react";
import { useGetStoresList } from "../../hooks/queries/useGetStoresList";
import { SortType } from "../../types/store";
import { BottomSheetContext } from "../common/BottomSheet";

interface StoreListProps {
    bottomSheetContext?: BottomSheetContext;
    onStoreSelect?: (storeId: string) => void;
}

const StoreList: React.FC<StoreListProps> = ({
    bottomSheetContext,
    onStoreSelect,
}) => {
    const [selectedSort, setSelectedSort] =
        useState<SortType>("보너스금액 많은 순");

    // BottomSheet가 확장된 상태일 때만 API 호출
    const isExpanded = bottomSheetContext?.isExpanded || false;
    const isFullScreen = bottomSheetContext?.isFullScreen || false;

    const { sortedStores, loading, error, sortBy } = useGetStoresList(
        undefined, // 기본 위치 사용
        isExpanded || isFullScreen // 확장되거나 풀스크린일 때만 API 호출
    );

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

    const handleStoreClick = (storeId: string) => {
        onStoreSelect?.(storeId);
    };

    return (
        <>
            {/* 정렬 옵션 */}
            <div
                className="px-2"
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

            {/* 가게 리스트 */}
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
                        sortedStores.map((store) => (
                            <div
                                key={store._id}
                                className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => handleStoreClick(store._id)}
                            >
                                <img
                                    src={store.mainImage}
                                    alt={store.name}
                                    className="w-20 h-20 rounded-lg object-cover bg-gray-200"
                                    onError={(e) => {
                                        const target =
                                            e.target as HTMLImageElement;
                                        // 이미 fallback으로 변경된 경우 더 이상 변경하지 않음
                                        if (
                                            !target.src.includes("data:image")
                                        ) {
                                            // base64 인코딩된 기본 이미지로 변경 (무한 루프 방지)
                                            target.src =
                                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0yOCAzNkgyOFYzNkg1MlY1Nkg0NEw0MCA0NEwzNiA0OEgzMkwyOCAzNloiIGZpbGw9IiM2NjY2NjYiLz4KPHN2Zz4K";
                                        }
                                    }}
                                />

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center space-x-2 justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold text-gray-900">
                                                {store.name}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {store.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        {store.address}
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        영업시간 |{" "}
                                        <span className="text-[#FF694F]">
                                            {store.operatingHours}
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

export default StoreList;
