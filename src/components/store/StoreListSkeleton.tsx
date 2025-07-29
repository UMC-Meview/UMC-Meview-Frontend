import React from "react";
import Skeleton from "../common/Skeleton";

interface StoreListSkeletonProps {
    count?: number;
}

const StoreListSkeleton: React.FC<StoreListSkeletonProps> = ({ count = 5 }) => {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0"
                >
                    {/* 가게 이미지 스켈레톤 */}
                    <Skeleton
                        className="flex-shrink-0"
                        width={80}
                        height={80}
                        rounded="lg"
                    />

                    {/* 가게 정보 스켈레톤 */}
                    <div className="flex-1 space-y-2">
                        {/* 가게명과 카테고리 영역 */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Skeleton width={120} height={20} />
                            </div>{" "}
                        </div>

                        {/* 주소 영역 */}
                        <div className="flex items-center space-x-2">
                            <Skeleton width={14} height={14} />
                            <Skeleton width={200} height={16} />
                        </div>

                        {/* 운영시간 영역 */}
                        <div className="flex items-start space-x-2">
                            <Skeleton width={14} height={14} />
                            <div className="space-y-1">
                                <Skeleton width={150} height={16} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StoreListSkeleton;
