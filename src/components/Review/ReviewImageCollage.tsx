import React from "react";
import SafeImage from "../common/SafeImage";

interface ReviewImageCollageProps {
    imageUrls?: string[];
    className?: string;
}

const ReviewImageCollage: React.FC<ReviewImageCollageProps> = ({ imageUrls = [], className = "w-full h-[187px]" }) => {
    const count = imageUrls.length;

    const renderTile = (src: string | undefined, classNameForTile: string) => {
        if (src) {
            return (
                <div className={`${classNameForTile} overflow-hidden rounded-[1px] border border-gray-200`}>
                    <SafeImage
                        src={src}
                        alt="리뷰 이미지"
                        className="w-full h-full object-cover"
                    />
                </div>
            );
        }
        return (
            <div className={`${classNameForTile} flex items-center justify-center bg-gray-100 rounded-[1px] border border-gray-200`}>
                <SafeImage
                    src=""
                    alt=""
                    showLogo={true}
                    className="w-full h-full"
                />
            </div>
        );
    };

    // 1장: 단일 이미지 카드
    if (count === 1) return renderTile(imageUrls[0], `${className} h-[187px] rounded-[1px] border border-gray-200`);

    // 0장 또는 2장 이상: 3차 그리드
    const leftSrc = count >= 1 ? imageUrls[0] : undefined;
    const topRightSrc = count >= 2 ? imageUrls[1] : undefined;
    const bottomRightSrc = count >= 3 ? imageUrls[2] : undefined;

    return (
        <div className={`${className} h-auto aspect-[3/2] grid grid-cols-3 grid-rows-2 gap-0.5 rounded-[1px]`}>
            {renderTile(leftSrc, "col-span-2 row-span-2 w-full h-full")}
            {renderTile(topRightSrc, "w-full h-full")}
            {renderTile(bottomRightSrc, "w-full h-full")}
        </div>
    );
};

export default ReviewImageCollage;


