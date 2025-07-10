import React from "react";
import { Clock, Heart, MapPin } from "lucide-react";
import { StoreDetail } from "../../types/store";

interface StoreInfoProps {
    store: StoreDetail;
    onToggleFavorite?: () => void;
    className?: string;
}

const StoreInfo: React.FC<StoreInfoProps> = ({ store, onToggleFavorite }) => {
    const handleToggleFavorite = () => {
        if (onToggleFavorite) {
            onToggleFavorite();
        } else {
            console.log("찜하기 토글 - 추후 구현 예정");
        }
    };

    return (
        <div className="py-4">
            {/* 1. 가게명, 카테고리, 찜하기 버튼 */}
            <div className="mb-2">
                <div className="flex items-center justify-between">
                    <div className="flex space-x-2 items-center">
                        <h2 className="text-xl font-bold">{store.name}</h2>
                        <p className="text-gray-600 text-sm">
                            {store.category}
                        </p>
                    </div>
                    <button
                        onClick={handleToggleFavorite}
                        className="flex items-center space-x-1 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-sm text-gray-700">찜</span>
                        {store.isFavorite ? (
                            <Heart size={20} fill="#FF694F" color="#FF694F" />
                        ) : (
                            <Heart size={20} className="text-gray-700" />
                        )}
                    </button>
                </div>
                {/* 2. 보너스 평균 */}
                <div className="text-[#FF694F] font-semibold">
                    보너스 평균 {store.bonusAverage?.toFixed(1) || "0.0"}점
                </div>
            </div>

            {/* 3. 주소 */}
            <div className="mb-2">
                <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">
                        {store.address}
                    </span>
                </div>
            </div>

            {/* 4. 운영시간 */}
            <div className="mb-3">
                <div className="flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <div className="space-y-1 text-sm text-gray-600">
                            {store.operatingHours
                                .split(",")
                                .map((hours, index) => (
                                    <div key={index}>{hours.trim()}</div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreInfo;
