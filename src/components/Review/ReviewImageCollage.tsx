import React from "react";
import SafeImage from "../common/SafeImage";
const MountainIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 71 47" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        <path d="M22.5724 0.765625L0.451172 46.8514H70.5016L52.0673 15.5131L41.0067 25.652L22.5724 0.765625Z" fill="#FFFFFF" />
    </svg>
);

interface ReviewImageCollageProps {
    imageUrls?: string[];
    className?: string;
}

const BG = "#D9D9D9";

const ReviewImageCollage: React.FC<ReviewImageCollageProps> = ({ imageUrls = [], className = "w-full h-[187px]" }) => {
    const count = imageUrls.length;

    const renderTile = (src: string | undefined, classNameForTile: string, placeholderSize: string) => {
        if (src) {
            return (
                <SafeImage
                    src={src}
                    alt="리뷰 이미지"
                    className={`${classNameForTile} object-cover`}
                    style={{ backgroundColor: BG }}
                />
            );
        }
        return (
            <div className={`${classNameForTile} flex items-center justify-center`} style={{ backgroundColor: BG }}>
                <MountainIcon className={placeholderSize} />
            </div>
        );
    };

    // 1장: 단일 이미지 카드
    if (count === 1) return renderTile(imageUrls[0], `${className} h-[187px] rounded-sm overflow-hidden`, "w-16 h-16");

    // 0장 또는 2장 이상: 3칸 그리드
    const leftSrc = count >= 1 ? imageUrls[0] : undefined;
    const topRightSrc = count >= 2 ? imageUrls[1] : undefined;
    const bottomRightSrc = count >= 3 ? imageUrls[2] : undefined;

    return (
        <div className={`${className} h-auto aspect-[3/2] grid grid-cols-3 grid-rows-2 gap-0.5 rounded-sm overflow-hidden bg-white`}>
            {renderTile(leftSrc, "col-span-2 row-span-2 w-full h-full", "w-16 h-16")}
            {renderTile(topRightSrc, "w-full h-full", "w-10 h-10")}
            {renderTile(bottomRightSrc, "w-full h-full", "w-10 h-10")}
        </div>
    );
};

export default ReviewImageCollage;


