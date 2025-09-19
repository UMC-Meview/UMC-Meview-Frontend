import { ReviewResponseDto } from "../../types/review";
import ReviewTag from "../common/ReviewTag";
import ReviewImageCollage from "../Review/ReviewImageCollage";

interface ReviewInfoProps {
    review: ReviewResponseDto;
}

const ReviewInfo = ({ 
    review 
}: ReviewInfoProps) => {
    const { user, isPositive, score, storeReviews, foodReviews, imageUrls } =
        review;

    return (
        <div className="flex gap-3 py-4 bg-white rounded-lg">
            {/* 프로필 이미지 영역 */}
            <div className="flex-shrink-0">
                <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                    <img
                        src="/Logo.svg"
                        alt="프로필 이미지"
                        className="w-full h-full object-contain pl-[8px] pt-[3px] pr-[6px] pb-[1px]"
                        style={{ filter: "brightness(0)" }} // 검정색
                    />
                </div>
            </div>

            {/* 다른 정보들 영역 */}
            <div className="flex-1">
                {/* 첫 번째 줄: 닉네임과 보너스/할퀸 정보 */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[16px] font-semibold text-gray-900">
                        {user.nickname}
                    </span>
                    <span className="text-[13px] font-medium text-orange-500">
                        {isPositive
                            ? `보너스 ${score}만원`
                            : `할퀸 수 ${score}번`}
                    </span>
                </div>

                {/* 두 번째 줄: 리뷰 태그들 */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {storeReviews.map((review, index) => (
                        <ReviewTag key={`store-${index}`} text={review} />
                    ))}
                    {foodReviews.map((review, index) => (
                        <ReviewTag key={`food-${index}`} text={review} />
                    ))}
                </div>

                <ReviewImageCollage
                    imageUrls={imageUrls}
                    className="w-[90%] h-[187px]"
                />
            </div>
        </div>
    );
};

export default ReviewInfo;
