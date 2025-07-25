import { ReviewResponseDto } from "../../types/review";
import ReviewTag from "../common/ReviewTag";
import GrayCheckIcon from "../../assets/grayCheck.svg";

interface UserReviewInfoProps {
    review: ReviewResponseDto;
    storeName?: string;
}

const UserReviewInfo = ({ review, storeName = "모토이시" }: UserReviewInfoProps) => {
    const { isPositive, score, storeReviews, foodReviews, imageUrl } = review;
    
    const scoreText = isPositive ? `내가 좋 보너스 ${score}만원` : `내가 할퀸 수 ${score}번`;

    return (
        <div>
            {/* 가게 정보 헤더 */}
            <div>
                <div className="flex items-center gap-2">
                    <h3 className="text-[20px] font-semibold text-gray-900">{storeName}</h3>
                    <img src={GrayCheckIcon} alt="체크 아이콘" className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-[14px] text-gray-500">슬럼 전복 양주군 아시면</p>
                    <span className="text-[13px] font-medium text-[#FF774C]">{scoreText}</span>
                </div>
            </div>

            {/* 리뷰 콘텐츠 */}
            <div className="flex gap-3 py-4 bg-white rounded-lg">
                {/* 프로필 이미지 */}
                <div className="flex-shrink-0 w-[40px] h-[40px] rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                    <img 
                        src="/Logo.svg" 
                        alt="프로필" 
                        className="w-full h-full object-contain pl-[8px] pt-[3px] pr-[6px] pb-[1px] brightness-0" 
                    />
                </div>
                
                {/* 리뷰 내용 */}
                <div className="flex-1">
                    {/* 리뷰 태그들 */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-3 min-h-[40px]">
                        {storeReviews.map((review, index) => (
                            <ReviewTag key={`store-${index}`} text={review} />
                        ))}
                        {foodReviews.map((review, index) => (
                            <ReviewTag key={`food-${index}`} text={review} />
                        ))}
                    </div>
                    
                    {/* 리뷰 이미지 */}
                    {imageUrl && (
                        <img 
                            src={imageUrl} 
                            alt="리뷰 이미지" 
                            className="w-[90%] h-[187px] object-cover rounded-sm bg-gray-200" 
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserReviewInfo; 