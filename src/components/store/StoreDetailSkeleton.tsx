import React from "react";
import Skeleton from "../common/Skeleton";

const StoreDetailSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col h-full">
            {/* 콘텐츠 영역 스켈레톤 */}
            <div className="flex-1 overflow-y-auto">
                {/* 이미지 갤러리 스켈레톤 */}
                <div className="flex space-x-2 overflow-x-auto mb-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="flex-shrink-0"
                            width={110}
                            height={110}
                            rounded="sm"
                        />
                    ))}
                </div>

                {/* 가게 정보 스켈레톤 */}
                <StoreInfoSkeleton />
            </div>
        </div>
    );
};

const StoreInfoSkeleton: React.FC = () => {
    return (
        <div className="py-4">
            {/* 가게명, 카테고리, 보너스 평균, 찜하기 버튼 영역 */}
            <div className="mb-2">
                <div className="flex items-start justify-between">
                    <div className="flex space-x-3 items-center flex-1">
                        {/* 가게 아이콘 스켈레톤 */}
                        <Skeleton
                            className="flex-shrink-0"
                            width={80}
                            height={80}
                        />

                        {/* 가게 정보 스켈레톤 */}
                        <div className="flex flex-col space-y-2 flex-1">
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-2 items-center">
                                    <Skeleton width={150} height={24} />
                                    <Skeleton width={60} height={16} />{" "}
                                </div>
                            </div>
                            {/* 보너스 평균 스켈레톤 */}
                            <Skeleton width={120} height={16} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 주소 스켈레톤 */}
            <div className="mb-2">
                <div className="flex items-center space-x-2">
                    <Skeleton width={16} height={16} />
                    <Skeleton width={250} height={16} />
                </div>
            </div>

            {/* 운영시간 스켈레톤 */}
            <div className="mb-3">
                <div className="flex items-start space-x-2">
                    <Skeleton width={16} height={16} />
                    <div className="flex-1 space-y-1">
                        <Skeleton width={200} height={16} />
                        <Skeleton width={180} height={16} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreDetailSkeleton;
export { StoreInfoSkeleton };
