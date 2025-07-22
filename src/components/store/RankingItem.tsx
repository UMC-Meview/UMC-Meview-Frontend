import React from "react";
import ranking1st from "../../assets/ranking-1st.svg";
import ranking2nd from "../../assets/ranking-2nd.svg";
import ranking3rd from "../../assets/ranking-3rd.svg";

interface RankingItemProps {
    rank: number;
    image: string;
    storeName: string;
    category: string;
    score: number;
    bonusAmount: number;
    reviewCount: number;
    onClick?: () => void;
}

const RankingItem: React.FC<RankingItemProps> = ({
    rank,
    image,
    storeName,
    category,
    score,
    bonusAmount,
    reviewCount,
    onClick,
}) => {
    // 순위에 따른 이미지 선택
    const getRankingImage = (rank: number) => {
        const rankingImages = {
            1: ranking1st,
            2: ranking2nd,
            3: ranking3rd,
        };
        return rankingImages[rank as keyof typeof rankingImages];
    };

    // 순위 표시 컴포넌트
    const RankBadge = () => {
        if (rank <= 3) {
            return (
                <div className="relative w-12 h-12 flex items-center justify-center">
                    <img
                        src={getRankingImage(rank)}
                        alt={`${rank}위`}
                        className="w-full h-full"
                    />
                    <span className="absolute inset-0 flex items-start justify-center pt-2 text-white font-bold text-sm">
                        {rank}위
                    </span>
                </div>
            );
        }

        return (
            <div className="w-12 h-12 flex items-center justify-center">
                <span className="text-gray-700 font-semibold text-sm">
                    {rank}위
                </span>
            </div>
        );
    };

    return (
        <div
            className="flex items-center p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={onClick}
        >
            {/* 순위 배지 */}
            <div className="flex-shrink-0 mr-1">
                <RankBadge />
            </div>

            {/* 가게 이미지 */}
            <div className="flex-shrink-0 mr-4">
                <img
                    src={image}
                    alt={storeName}
                    className="w-[20vw] h-[20vw] max-w-[95px] max-h-[95px] min-w-[60px] min-h-[60px] rounded-lg object-cover bg-gray-200"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes("data:image")) {
                            target.src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0yMiAyOEgyMlYyOEg0MlY0Nkg0MkgzNkwzMiAzNkwyOCAzNkgyNEgyMiAyOFoiIGZpbGw9IiM2NjY2NjYiLz4KPHN2Zz4K";
                        }
                    }}
                />
            </div>

            {/* 가게 정보 */}
            <div className="flex-1 min-w-0 overflow-hidden">
                {/* 첫 번째 줄: 가게명, 카테고리, 점수 */}
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center min-w-0 flex-1 mr-2">
                        <span className="font-semibold text-gray-900 text-base whitespace-nowrap">
                            {storeName}
                        </span>
                        <span className="text-sm text-gray-500 px-2 py-1 whitespace-nowrap">
                            {category}
                        </span>
                    </div>
                    <div className="text-[15px] font-bold text-[#FF5436] whitespace-nowrap flex-shrink-0">
                        {score.toLocaleString()}점
                    </div>
                </div>

                {/* 두 번째 줄: 총 보너스 */}
                <div className="mb-1">
                    <span className="text-sm text-[#FF5436] font-medium whitespace-nowrap">
                        총 보너스 {bonusAmount.toLocaleString()}원
                    </span>
                </div>

                {/* 세 번째 줄: 리뷰 개수 */}
                <div>
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                        리뷰 {reviewCount.toLocaleString()}개
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RankingItem;
