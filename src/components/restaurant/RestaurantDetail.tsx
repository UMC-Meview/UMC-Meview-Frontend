import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomSheetContext } from "../common/BottomSheet";
import { RestaurantDetail as RestaurantDetailType } from "../../types/restaurant";
import { Clock, MapPin, SquareMenu } from "lucide-react";

interface RestaurantDetailProps {
    restaurantId: string;
    bottomSheetContext?: BottomSheetContext;
    onBackToList?: () => void;
}

const RestaurantDetail: React.FC<RestaurantDetailProps> = ({
    restaurantId,
    bottomSheetContext,
    onBackToList,
}) => {
    const [restaurant, setRestaurant] = useState<RestaurantDetailType | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const navigate = useNavigate();

    const { isExpanded, isFullScreen } = bottomSheetContext || {};

    // isFullScreen이 되면 레스토랑 디테일 페이지로 navigate
    useEffect(() => {
        if (isFullScreen && restaurant) {
            navigate(`/restaurant/${restaurantId}`);
        }
    }, [isFullScreen, restaurantId, restaurant, navigate]);

    // 레스토랑 상세 정보 가져오기 (실제로는 API 호출)
    useEffect(() => {
        const fetchRestaurantDetail = async () => {
            setLoading(true);
            try {
                // 실제 API 호출 대신 더미 데이터
                await new Promise((resolve) => setTimeout(resolve, 500));

                const dummyData: RestaurantDetailType = {
                    _id: restaurantId,
                    latitude: 35.84662,
                    longitude: 127.136609,
                    name: "맛있는 한식당",
                    category: "한식",
                    address: "서울시 강남구 테헤란로 123",
                    operatingHours: "월-토 10:00 ~ 20:00, 일 10:00 ~ 20:00",
                    phone: "02-123-4567",
                    mainImage: "https://via.placeholder.com/300x200",
                    images: [
                        "https://via.placeholder.com/300x200/FF6B6B",
                        "https://via.placeholder.com/300x200/4ECDC4",
                        "https://via.placeholder.com/300x200/45B7D1",
                        "https://via.placeholder.com/300x200/96CEB4",
                    ],
                    description:
                        "정통 한식을 맛볼 수 있는 맛집입니다. 신선한 재료로 정성스럽게 만든 음식을 제공합니다.",
                    rating: 4.5,
                    reviewCount: 128,
                    bonusAverage: 4.2,
                    menu: ["양고기", "소고기", "일본식 전골"],
                    isFavorite: false,
                    operatingHoursDetail: {
                        weekdays: "월-토 10:00 ~ 20:00",
                        sunday: "일 10:00 ~ 20:00",
                        notice: "연중무휴",
                    },
                    createdAt: "2024-01-01T00:00:00.000Z",
                    updatedAt: "2024-01-01T00:00:00.000Z",
                    reviews: [
                        {
                            id: "1",
                            author: "김철수",
                            rating: 5,
                            content:
                                "정말 맛있어요! 특히 김치찌개가 일품입니다.",
                            date: "2024-01-15",
                        },
                        {
                            id: "2",
                            author: "이영희",
                            rating: 4,
                            content:
                                "깔끔하고 맛있습니다. 직원분들도 친절해요.",
                            date: "2024-01-10",
                        },
                    ],
                };

                setRestaurant(dummyData);
            } catch (error) {
                console.error("Failed to fetch restaurant detail:", error);
            } finally {
                setLoading(false);
            }
        };

        if (restaurantId) {
            fetchRestaurantDetail();
        }
    }, [restaurantId]);

    const toggleFavorite = () => {
        if (restaurant) {
            setRestaurant({
                ...restaurant,
                isFavorite: !restaurant.isFavorite,
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">상세 정보를 불러오는 중...</div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-red-500">
                    레스토랑 정보를 찾을 수 없습니다.
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* 헤더 영역 (고정) */}
            <div className="flex-shrink-0 px-4 border-b border-gray-100">
                <div className="flex items-center justify-between p-2">
                    <button
                        onClick={onBackToList}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <div className="flex-1 mx-4">
                        <h3 className="font-semibold text-lg text-center">
                            {restaurant?.name || "레스토랑"}
                        </h3>
                    </div>
                    <div className="w-5 h-5"></div> {/* 공간 확보용 */}
                </div>
            </div>

            {(isExpanded || isFullScreen) && restaurant && (
                <div className="flex-1 overflow-y-auto">
                    <div className="px-4 pt-4 mb-4">
                        <div className="flex space-x-2 overflow-x-auto">
                            {restaurant.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImageIndex(index)}
                                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                                        activeImageIndex === index
                                            ? "border-[#FF694F]"
                                            : "border-gray-200"
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${restaurant.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="px-4 mb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex space-x-2 items-center">
                                <h2 className="text-xl font-bold">
                                    {restaurant.name}
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    {restaurant.category}
                                </p>
                            </div>
                            <button
                                onClick={toggleFavorite}
                                className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-sm text-gray-700">
                                    찜
                                </span>
                                <svg
                                    className={`w-5 h-5 ${
                                        restaurant.isFavorite
                                            ? "text-red-500 fill-current"
                                            : "text-gray-400"
                                    }`}
                                    fill={
                                        restaurant.isFavorite
                                            ? "currentColor"
                                            : "none"
                                    }
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="px-4 mb-3">
                        <div className="text-[#FF694F] font-semibold">
                            보너스 평균 {restaurant.bonusAverage.toFixed(1)}점
                        </div>
                    </div>

                    <div className="px-4 mb-3">
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">
                                {restaurant.address}
                            </span>
                        </div>
                    </div>

                    <div className="px-4 mb-3">
                        <div className="flex items-start space-x-2">
                            <Clock className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 flex items-center space-x-2">
                                {restaurant.operatingHoursDetail ? (
                                    <div className="space-y-1 text-sm text-gray-600">
                                        {restaurant.operatingHoursDetail
                                            .weekdays && (
                                            <div>
                                                {
                                                    restaurant
                                                        .operatingHoursDetail
                                                        .weekdays
                                                }
                                            </div>
                                        )}
                                        {restaurant.operatingHoursDetail
                                            .sunday && (
                                            <div>
                                                {
                                                    restaurant
                                                        .operatingHoursDetail
                                                        .sunday
                                                }
                                            </div>
                                        )}
                                        {restaurant.operatingHoursDetail
                                            .notice && (
                                            <div className="text-[#FF694F]">
                                                {
                                                    restaurant
                                                        .operatingHoursDetail
                                                        .notice
                                                }
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-600">
                                        {restaurant.operatingHours}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="px-4 mb-4">
                        <div className="flex items-start space-x-2">
                            <div className="flex-1 flex items-center space-x-2">
                                <SquareMenu className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <div className="text-sm text-gray-600">
                                    {restaurant.menu.join(", ")}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 구분선 */}
                    <div className="border-t border-gray-100 my-4"></div>

                    {/* 리뷰 섹션 */}
                    {restaurant.reviews && restaurant.reviews.length > 0 && (
                        <div className="px-4 mb-4">
                            <h4 className="font-semibold mb-2">
                                리뷰 (
                                {restaurant.reviewCount ||
                                    restaurant.reviews.length}
                                )
                            </h4>
                            <div className="space-y-3">
                                {restaurant.reviews
                                    .slice(0, 2)
                                    .map((review) => (
                                        <div
                                            key={review.id}
                                            className="border-b border-gray-100 pb-3 last:border-b-0"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium text-sm">
                                                    {review.author}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {review.date}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-1 mb-1">
                                                {Array.from(
                                                    { length: 5 },
                                                    (_, i) => (
                                                        <span
                                                            key={i}
                                                            className={`text-xs ${
                                                                i <
                                                                review.rating
                                                                    ? "text-yellow-500"
                                                                    : "text-gray-300"
                                                            }`}
                                                        >
                                                            ★
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {review.content}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RestaurantDetail;
