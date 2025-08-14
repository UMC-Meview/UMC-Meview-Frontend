import React from "react";
import SafeImage from "../common/SafeImage";

interface ReviewImageFrameProps {
    images?: (string | null | undefined)[];
    className?: string;
}

const ReviewImageFrame: React.FC<ReviewImageFrameProps> = ({
    images = [],
    className = "",
}) => {
    const [first, second, third] = [images[0], images[1], images[2]];

    return (
        <div className={`w-full max-w-[280px] h-[185px] ${className}`}>
            <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[4px] rounded-lg overflow-hidden bg-white">
                <div className="col-span-1 row-span-2">
                    <SafeImage
                        src={first || undefined}
                        alt="리뷰 이미지 1"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="col-span-1 row-span-1">
                    <SafeImage
                        src={second || undefined}
                        alt="리뷰 이미지 2"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="col-span-1 row-span-1">
                    <SafeImage
                        src={third || undefined}
                        alt="리뷰 이미지 3"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default ReviewImageFrame;
