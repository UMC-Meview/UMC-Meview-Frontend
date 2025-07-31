import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomSheetContext } from "../common/BottomSheet";
import { useGetStoreDetail } from "../../hooks/queries/useGetStoreDetail";
import StoreInfo from "./StoreInfo";
import SafeImage from "../common/SafeImage";
import StoreDetailSkeleton from "./StoreDetailSkeleton";

interface StoreDetailProps {
    storeId: string;
    bottomSheetContext?: BottomSheetContext;
}

const StoreDetail: React.FC<StoreDetailProps> = ({
    storeId,
    bottomSheetContext,
}) => {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const navigate = useNavigate();

    // 커스텀 훅 사용
    const { store, loading, error } = useGetStoreDetail(storeId);

    const { isExpanded, isFullScreen } = bottomSheetContext || {};

    // isFullScreen이 되면 가게 디테일 페이지로 navigate
    useEffect(() => {
        if (isFullScreen && store) {
            navigate(`/store/${storeId}`);
        }
    }, [isFullScreen, storeId, store, navigate]);

    if (error) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    // BottomSheet context가 없으면 항상 표시 (일반 페이지용)
    // BottomSheet context가 있으면 확장된 상태에서만 표시 (BottomSheet용)
    const shouldShowContent = !bottomSheetContext || isExpanded || isFullScreen;

    return (
        <div className="flex flex-col h-full max-w-[390px] min-w-[300px] overflow-y-auto">
            {loading && <StoreDetailSkeleton />}

            {shouldShowContent && store && (
                <div className="flex-1">
                    {/* 가게 이미지 */}
                    <div className="flex space-x-2 overflow-x-auto">
                        {/* 대표 이미지*/}
                        <button
                            onClick={() => setActiveImageIndex(0)}
                            className={
                                "flex-shrink-0 w-[110px] h-[110px] overflow-hidden border rounded-[4px] border-gray-200"
                            }
                        >
                            <SafeImage
                                src={store.mainImage}
                                alt={`${store.name} 대표 이미지`}
                                className="w-full h-full object-cover"
                            />
                        </button>

                        {/* 일반 이미지 슬롯 2개 (총 3개가 되도록) */}
                        {Array(2)
                            .fill(null)
                            .map((_, index) => {
                                const imageIndex = index;
                                const hasImage =
                                    store.images && store.images[imageIndex];

                                return (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setActiveImageIndex(index + 1)
                                        }
                                        className={`flex-shrink-0 w-[110px] h-[110px] overflow-hidden border rounded-[4px] ${
                                            activeImageIndex === index + 1
                                                ? "border-[#FF694F]"
                                                : "border-gray-200"
                                        }`}
                                    >
                                        <SafeImage
                                            src={
                                                hasImage
                                                    ? store.images?.[imageIndex]
                                                    : undefined
                                            }
                                            alt={
                                                hasImage
                                                    ? `${store.name} ${
                                                          index + 1
                                                      }번째 이미지`
                                                    : `${store.name} 이미지 없음`
                                            }
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                );
                            })}
                    </div>

                    {/* 가게 상세 정보 */}
                    <StoreInfo store={store} />
                </div>
            )}
        </div>
    );
};

export default StoreDetail;
