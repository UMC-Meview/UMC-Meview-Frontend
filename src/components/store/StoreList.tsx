import React, { useState } from "react";
import {
    mapClientSortToServer,
    useHomeStores,
} from "../../hooks/queries/useGetStoreList";
import { SortType, StoreDetail } from "../../types/store";
import { BottomSheetContext } from "../common/BottomSheet";
import { Clock, MapPin } from "lucide-react";
import SafeImage from "../common/SafeImage";

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

    const { stores, loading, error } = useHomeStores(
        mapClientSortToServer(selectedSort),
        { latitude: 37.5665, longitude: 126.978 },
        isExpanded || isFullScreen // 확장되거나 풀스크린일 때만 API 호출
    );

    const sortOptions: SortType[] = [
        "보너스금액 많은 순",
        "리뷰 많은 순",
        "가까운 순",
        "찜 많은 순",
    ];

    // 정렬 타입에 따른 정보 렌더링 함수
    const renderSortInfo = (store: StoreDetail) => {
        switch (selectedSort) {
            case "보너스금액 많은 순":
                return `보너스 평균 ${store.averagePositiveScore}점`;
            case "리뷰 많은 순": {
                const reviewCount = store.reviewCount || 0;
                return `리뷰 ${reviewCount.toLocaleString()}개`;
            }
            case "가까운 순": {
                console.log(store.distance);
                return `현재 위치에서 ${store.distance?.toFixed(1)}km`;
            }
            case "찜 많은 순":
                return `찜 ${store.favoriteCount || 0}개`;
            default:
                return store.averagePositiveScore || 0;
        }
    };

    const handleSortChange = (sortType: SortType) => {
        setSelectedSort(sortType);

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
        <div className="flex flex-col h-full">
            {/* 정렬 옵션 */}
            <div
                className="px-2 flex-shrink-0"
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex space-x-1 overflow-x-auto p-2">
                    {sortOptions.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleSortChange(option)}
                            className={`h-[26px] px-[10px] py-[8px] rounded-[28px] text-[13px] font-medium whitespace-nowrap shadow-sm flex items-center justify-center ${
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
                <div className="flex-1 overflow-y-auto px-4 min-h-0">
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
                        stores.map((store: StoreDetail) => (
                            <div
                                key={store._id}
                                className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => handleStoreClick(store._id)}
                            >
                                <SafeImage
                                    src={store.mainImage}
                                    alt={store.name}
                                    className="w-20 h-20 rounded-lg object-cover"
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
                                        <span className="text-sm text-[#FF5436]">
                                            {renderSortInfo(store)}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-[14px] h-[14px] text-gray-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-gray-700">
                                            {store.address}
                                        </span>
                                    </div>

                                    <div className="mb-3">
                                        <div className="flex items-start space-x-2">
                                            <Clock className="w-[14px] h-[14px] text-gray-500 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <div className="space-y-1 text-sm text-gray-600">
                                                    {store.operatingHours
                                                        .split(",")
                                                        .map(
                                                            (
                                                                hours: string,
                                                                index: number
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                >
                                                                    {hours.trim()}
                                                                </div>
                                                            )
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default StoreList;
