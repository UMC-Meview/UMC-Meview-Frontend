import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomSheetContext } from "../common/BottomSheet";
import { useGetStoreDetail } from "../../hooks/queries/useGetStoreDetail";
import { ChevronLeft } from "lucide-react";
import StoreInfo from "./StoreInfo";

interface StoreDetailProps {
    storeId: string;
    bottomSheetContext?: BottomSheetContext;
    onBackToList?: () => void;
}

const StoreDetail: React.FC<StoreDetailProps> = ({
    storeId,
    bottomSheetContext,
    onBackToList,
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

    const toggleFavorite = () => {
        if (store) {
            console.log("찜하기 토글 - 추후 구현 예정");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">상세 정보를 불러오는 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (!store) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-red-500">
                    가게 정보를 찾을 수 없습니다.
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* 헤더 영역 (고정) */}
            <div className="flex-shrink-0 px-4">
                <div className="flex items-center justify-between py-1">
                    <button
                        onClick={onBackToList}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    >
                        <ChevronLeft size={24} />
                    </button>
                </div>
            </div>

            {(isExpanded || isFullScreen) && store && (
                <div className="flex-1 overflow-y-auto">
                    {/* 가게 이미지 */}
                    <div className="p-4">
                        <div className="flex space-x-2 overflow-x-auto">
                            {/* 대표 이미지*/}
                            <button
                                onClick={() => setActiveImageIndex(0)}
                                className={
                                    "flex-shrink-0 w-[110px] h-[100px] overflow-hidden border rounded-[4px] border-gray-200"
                                }
                            >
                                <img
                                    src={store.mainImage}
                                    alt={`${store.name} 대표 이미지`}
                                    className="w-full h-full object-cover"
                                />
                            </button>

                            {/* 일반 이미지들 */}
                            {store.images?.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() =>
                                        setActiveImageIndex(index + 1)
                                    }
                                    className={`flex-shrink-0 w-[110px] h-[100px] overflow-hidden border rounded-[4px] ${
                                        activeImageIndex === index + 1
                                            ? "border-[#FF694F]"
                                            : "border-gray-200"
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${store.name} ${
                                            index + 1
                                        }번째 이미지`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 가게 상세 정보 */}
                    <StoreInfo
                        store={store}
                        onToggleFavorite={toggleFavorite}
                    />
                </div>
            )}
        </div>
    );
};

export default StoreDetail;
