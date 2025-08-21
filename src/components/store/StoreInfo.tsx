import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Clock, Heart, MapPin } from "lucide-react";
import { StoreDetail } from "../../types/store";
import {
    getStoreLevel,
    getStoreIconPath,
    getStoreMarkPath,
} from "../../lib/storeUtils";
import { useToggleFavorite } from "../../hooks/queries/useToggleFavorite";

interface StoreInfoProps {
    store: StoreDetail;
    onToggleFavorite?: () => void;
    className?: string;
    isExpanded?: boolean;
    isFullScreen?: boolean;
}

const StoreInfo: React.FC<StoreInfoProps> = ({ store }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const nameRef = useRef<HTMLHeadingElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { toggleFavorite } = useToggleFavorite();
    
    // 현재 경로가 StoreDetailPage인지 확인
    const isStoreDetailPage = location.pathname.startsWith('/stores/') && location.pathname !== '/stores';

    // 외부 클릭시 tooltip 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                nameRef.current &&
                !nameRef.current.contains(event.target as Node)
            ) {
                setShowTooltip(false);
            }
        };

        if (showTooltip) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showTooltip]);

    const handleToggleFavorite = () => {
        toggleFavorite(store._id, store.isFavorited || false);
    };

    const handleNameClick = () => {
        // StoreDetailPage가 아닐 때는 가게 상세 페이지로 이동
        if (!isStoreDetailPage) {
            navigate(`/stores/${store._id}`);
            return;
        }

        // StoreDetailPage일 때만 이름 잘렸는지 확인하여 툴팁 표시
        if (nameRef.current) {
            const scrollWidth = nameRef.current.scrollWidth;
            const clientWidth = nameRef.current.clientWidth;
            const isOverflowing = scrollWidth > clientWidth;

            if (isOverflowing) {
                setShowTooltip(!showTooltip);
            }
        }
    };

    const storeLevel = getStoreLevel(store.averagePositiveScore);
    const storeIconPath = getStoreIconPath(storeLevel);
    const storeMarkPath = getStoreMarkPath(storeLevel);

    return (
        <div className="py-4">
            {/* 찜하기 에러 메시지 표시 */}
            {/* {favoriteError && (
                <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                    {favoriteError.message}
                </div>
            )} */}

            {/* 1. 가게명, 카테고리, 보너스 평균, 찜하기 버튼 */}
            <div className="mb-2">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex space-x-3 items-center flex-1 min-w-0">
                        {/* 가게 아이콘 */}
                        <img
                            src={storeIconPath}
                            alt={`레벨 ${storeLevel} 가게`}
                            className="w-[80px] h-[80px] flex-shrink-0"
                        />
                        {/* 가게 정보 */}
                        <div className="flex flex-col space-y-1 flex-1 min-w-0">
                            <div className="flex space-x-[6px] items-center relative">
                                <h2
                                    ref={nameRef}
                                    className="text-[20px] font-semibold truncate cursor-pointer hover:text-[#FF694F] transition-colors"
                                    onClick={handleNameClick}
                                    title="" // 기본 브라우저 tooltip 비활성화
                                >
                                    {store.name}
                                </h2>

                                {/* Tooltip - h2 바깥으로 이동 */}
                                {showTooltip && (
                                    <div className="absolute bottom-full left-0 mb-2 z-50">
                                        <div className="bg-gray-700 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                                            {store.name}
                                            {/* 말풍선 화살표 */}
                                            <div className="absolute top-full left-4 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-700"></div>
                                        </div>
                                    </div>
                                )}

                                <p className="text-gray-600 text-sm flex-shrink-0">
                                    {store.category}
                                </p>
                                <img
                                    src={storeMarkPath}
                                    alt={`레벨 ${storeLevel} 마크`}
                                    className="w-[18px] h-[20px] flex-shrink-0"
                                />
                            </div>
                            {/* 보너스 평균 */}
                            <div className="text-[#FF694F] text-[14px] font-semibold">
                                보너스 평균 {store.averagePositiveScore || "0"}
                                점
                            </div>
                        </div>
                    </div>
                    {/* 찜하기 버튼 */}
                    <button
                        onClick={handleToggleFavorite}
                        className="flex items-start space-x-1 py-[17px] px-2 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0 self-start"
                    >
                        <span className="text-sm text-gray-700">찜</span>
                        <div className="flex flex-col items-center">
                            {store.isFavorited ? (
                                <Heart
                                    size={20}
                                    fill="#FF694F"
                                    color="#FF694F"
                                />
                            ) : (
                                <Heart size={20} className="text-gray-700" />
                            )}
                            <span className="text-xs text-gray-600 min-w-[20px] text-center leading-tigh pt-[1px]">
                                {store.favoriteCount || 0}
                            </span>
                        </div>
                    </button>
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
