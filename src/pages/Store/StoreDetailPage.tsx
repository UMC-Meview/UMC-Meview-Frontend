import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetStoreDetail } from "../../hooks/queries/useGetStoreDetail";
import { ChevronLeft } from "lucide-react";
import StoreInfo from "../../components/store/StoreInfo";
import MenuInfo from "../../components/store/MenuInfo";
import Divider from "../../components/common/Divider";
import ImagesInfo from "../../components/store/ImagesInfo";
import ReviewInfo from "../../components/store/ReviewInfo";

const StoreDetailPage: React.FC = () => {
    const { storeId } = useParams<{ storeId: string }>();
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const { store, loading, error } = useGetStoreDetail(storeId || "");

    const handleBack = () => {
        navigate(-1);
    };

    const handleToggleFavorite = () => {
        console.log("페이지에서 찜하기 토글 - 추후 구현 예정");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-gray-500">상세 정보를 불러오는 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (!store) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500">
                    가게 정보를 찾을 수 없습니다.
                </div>
            </div>
        );
    }

    // 모든 이미지 배열 (메인 이미지 + 추가 이미지들)
    const allImages = store.images
        ? [store.mainImage, ...store.images]
        : [store.mainImage];

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const scrollLeft = container.scrollLeft;
        const imageWidth = container.clientWidth;
        const newIndex = Math.round(scrollLeft / imageWidth);
        setCurrentImageIndex(newIndex);
    };

    return (
        <div className="bg-white h-[calc(100vh-80px)] overflow-y-auto">
            {/* 가게 이미지 섹션 */}
            <div className="relative w-full h-[300px]">
                {/* 뒤로가기 */}
                <button
                    onClick={handleBack}
                    className="fixed top-4 left-4 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all"
                >
                    <ChevronLeft size={24} color="white" />
                </button>

                {/* 이미지 슬라이더 */}
                <div
                    className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                    onScroll={handleScroll}
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {allImages.map((image, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-full h-full snap-start"
                        >
                            <img
                                src={image}
                                alt={`${store.name} ${
                                    index === 0 ? "대표" : index + "번째"
                                } 이미지`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>

                {/* 스와이프 인디케이터 */}
                {allImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="flex space-x-2">
                            {allImages.map((_, index) => (
                                <div
                                    key={index}
                                    className={` h-2 rounded-full transition-all ${
                                        index === currentImageIndex
                                            ? "w-4 bg-white"
                                            : "w-2 bg-white bg-opacity-50"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="px-4">
                {/* 가게 상세 정보 */}
                <StoreInfo
                    store={store}
                    onToggleFavorite={handleToggleFavorite}
                />
                <Divider />

                {/* 메뉴 */}
                <MenuInfo menus={store.menus || []} />

                <Divider />

                {/* 이미지 */}
                <ImagesInfo
                    images={store.images}
                    mainImage={store.mainImage}
                    storeName={store.name}
                />

                <Divider />
                {/* 리뷰 */}
                <div className="space-y-3">
                    {store.reviews?.map((review) => (
                        <ReviewInfo key={review._id} review={review} />
                    )) || (
                        <div className="text-gray-500 text-center py-4">
                            아직 리뷰가 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoreDetailPage;
