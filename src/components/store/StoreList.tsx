import React from "react";
import { SortType, StoreDetail } from "../../types/store";
import { BottomSheetContext } from "../common/BottomSheet";
import { Clock, MapPin } from "lucide-react";
import SafeImage from "../common/SafeImage";
import {
    ServerSortType,
    mapClientSortToServer,
} from "../../hooks/queries/useGetStoreList";
import StoreListSkeleton from "./StoreListSkeleton";

interface StoreListProps {
    bottomSheetContext?: BottomSheetContext;
    onStoreSelect?: (storeId: string) => void;
    stores?: StoreDetail[];
    currentLocation?: { lat: number; lng: number };
    currentSortBy?: ServerSortType;
    onSortChange?: (sortBy: ServerSortType) => void;
    loading?: boolean;
    error?: string | null;
    onStoreLocationMove?: (lat: number, lng: number) => void;
}

const StoreList: React.FC<StoreListProps> = ({
    bottomSheetContext,
    onStoreSelect,
    stores = [],
    currentSortBy = "positiveScore",
    onSortChange,
    loading = false,
    error = null,
    onStoreLocationMove,
}) => {
    const sortOptions: SortType[] = [
        "보너스금액 많은 순",
        "리뷰 많은 순",
        "가까운 순",
        "찜 많은 순",
    ];

    // 현재 선택된 정렬을 클라이언트 형태로 변환
    const getCurrentSortType = (): SortType => {
        const mapping: Record<ServerSortType, SortType> = {
            positiveScore: "보너스금액 많은 순",
            reviews: "리뷰 많은 순",
            distance: "가까운 순",
            favorites: "찜 많은 순",
        };
        return mapping[currentSortBy] || "보너스금액 많은 순";
    };

    const selectedSort = getCurrentSortType();

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
                return `현재 위치에서 ${store.distance?.toFixed(0)}km`;
            }
            case "찜 많은 순":
                return `찜 ${store.favoriteCount || 0}개`;
            default:
                return `보너스 평균 ${store.averagePositiveScore || 0}점`;
        }
    };

    const handleSortChange = (sortType: SortType) => {
        const serverSortType = mapClientSortToServer(sortType);
        onSortChange?.(serverSortType);

        if (
            bottomSheetContext &&
            !bottomSheetContext.isExpanded &&
            !bottomSheetContext.isFullScreen
        ) {
            bottomSheetContext.setIsExpanded(true);
        }
    };

    const handleStoreClick = (store: StoreDetail) => {
        onStoreSelect?.(store._id);

        if (onStoreLocationMove && store.location?.coordinates) {
            const [longitude, latitude] = store.location.coordinates;
            onStoreLocationMove(latitude, longitude);
        }
    };

    // BottomSheet가 확장된 상태인지 확인
    const isExpanded = bottomSheetContext?.isExpanded || false;
    const isFullScreen = bottomSheetContext?.isFullScreen || false;

    return (
        <div className="flex flex-col h-full max-w-[390px] mx-auto">
            {/* 정렬 옵션 */}
            <div
                className="flex-shrink-0"
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex space-x-1 overflow-x-auto py-2">
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
                <div className="flex-1 overflow-y-auto min-h-0">
                    {/* 로딩 중일 때 Skeleton UI 표시 */}
                    {loading && <StoreListSkeleton count={5} />}

                    {/* 에러 발생 시 에러 메시지 표시 */}
                    {error && !loading && (
                        <div className="flex justify-center items-center py-8">
                            <div className="text-center">
                                <div className="text-red-500 text-sm mb-2">
                                    {error}
                                </div>
                                <div className="text-gray-500 text-xs">
                                    더미 데이터를 표시합니다.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 데이터 로딩 완료 후 가게 목록 표시 */}
                    {!loading && !error && stores.length === 0 && (
                        <div className="flex justify-center items-center py-8">
                            <div className="text-gray-500 text-sm">
                                이 지역에 가게가 없습니다.
                            </div>
                        </div>
                    )}

                    {!loading &&
                        stores.length > 0 &&
                        stores.map((store: StoreDetail) => (
                            <div
                                key={store._id}
                                className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => handleStoreClick(store)}
                            >
                                <SafeImage
                                    src={store.mainImage}
                                    alt={store.name}
                                    className="w-20 h-20 rounded-lg object-cover"
                                />

                                <div className="flex-1 space-y-1 min-w-0">
                                    <div className="flex items-center space-x-2 justify-between">
                                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                                            <span className="font-semibold text-gray-900 truncate">
                                                {store.name}
                                            </span>
                                            <span className="text-sm text-gray-500 truncate">
                                                {store.category}
                                            </span>
                                        </div>
                                        <span className="text-sm text-[#FF5436] flex-shrink-0">
                                            {renderSortInfo(store)}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-[14px] h-[14px] text-gray-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-gray-700 truncate">
                                            {store.address}
                                        </span>
                                    </div>

                                    <div className="mb-3">
                                        <div className="flex items-start space-x-2">
                                            <Clock className="w-[14px] h-[14px] text-gray-500 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1 min-w-0">
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
                                                                    className="truncate"
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
