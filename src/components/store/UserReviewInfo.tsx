import { Review, DisplayReview, PopulatedStoreInReview } from "../../types/review";
import ReviewTag from "../common/ReviewTag";
import GrayCheckIcon from "../../assets/grayCheck.svg";
import ReviewImageCollage from "../Review/ReviewImageCollage";
import { useNavigate } from "react-router-dom";

interface UserReviewInfoProps {
    review: (Review & {
        storeReviews?: string[];
        foodReviews?: string[];
        imageUrl?: string;
    }) | DisplayReview;
    storeName?: string;
    storeAddressShort?: string;
    storeCategory?: string;
}

const UserReviewInfo = ({
    review, 
    storeName, 
    storeAddressShort, 
    storeCategory 
}: UserReviewInfoProps) => {
    const navigate = useNavigate();
    const { isPositive, score, storeReviews, foodReviews, imageUrl, content } = review;
    const imageUrls = (review as DisplayReview & { imageUrls?: string[] }).imageUrls || (imageUrl ? [imageUrl] : []);
    const displayStoreName = storeName && storeName.trim() !== "" ? storeName : "가게명";
    const resolvedStoreId = (() => {
        const asDisplay = review as DisplayReview;
        if (asDisplay.storeId) return asDisplay.storeId;
        const asReview = review as Review & { store?: string | PopulatedStoreInReview };
        if (typeof asReview.store === "string") return asReview.store;
        return asReview.store?._id;
    })();
    
    const scoreText = isPositive ? `내가 준 보너스 ${score}만원` : `내가 할퀸 수 ${score}번`;

    return (
        <div>
            {/* 가게 정보 헤더 */}
            <div>
                <div className="flex items-center gap-2">
                    <h3
                        className={`text-[20px] font-semibold ${resolvedStoreId ? "text-gray-900 cursor-pointer hover:underline" : "text-gray-900"}`}
                        onClick={() => {
                            if (resolvedStoreId && displayStoreName !== "가게명") {
                                navigate(`/stores/${resolvedStoreId}`);
                            }
                        }}
                    >
                        {displayStoreName}
                    </h3>
                    <img src={GrayCheckIcon} alt="체크 아이콘" className="w-5 h-5" />
                </div>
                <div className="mt-1 w-full text-[12px] text-gray-500 flex items-baseline">
                    <span className="truncate inline-block max-w-[65%] sm:max-w-[70%] align-baseline">
                        {[storeCategory, storeAddressShort].filter(Boolean).join(" ")}
                        {content && (
                            <span className="ml-2 text-[14px] text-gray-500 align-baseline">{content}</span>
                        )}
                    </span>
                    <span className="ml-2 text-[13px] font-medium text-[#FF774C] whitespace-nowrap align-baseline">{scoreText}</span>
                </div>
            </div>

            {/* 리뷰 콘텐츠 */}
            <div className="flex gap-3 py-4 bg-white rounded-lg">
                {/* 가게 프로필 아이콘 (레벨 기반) */}
                <div className="flex-shrink-0 w-[40px] h-[40px] rounded-full overflow-hidden shadow-sm border border-gray-200 bg-white">
                    <img
                        src={(review as DisplayReview).storeIconPath || "/store/lv1-store.svg"}
                        alt={`가게 레벨 아이콘`}
                        className="w-full h-full object-cover object-center block"
                    />
                </div>
                
                {/* 리뷰 내용 */}
                <div className="flex-1">
                    {/* 리뷰 태그들 */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-3 min-h-[40px]">
                        {storeReviews && storeReviews.length > 0 && storeReviews.map((review, index) => (
                            <ReviewTag key={`store-${index}`} text={review} />
                        ))}
                        {foodReviews && foodReviews.length > 0 && foodReviews.map((review, index) => (
                            <ReviewTag key={`food-${index}`} text={review} />
                        ))}
                        {(!storeReviews || storeReviews.length === 0) && (!foodReviews || foodReviews.length === 0) && (
                            <div className="text-gray-400 text-sm">리뷰 태그가 없습니다.</div>
                        )}
                    </div>
                    
                    <ReviewImageCollage imageUrls={imageUrls} className="w-[90%] h-[187px]" />
                </div>
            </div>
        </div>
    );
};

export default UserReviewInfo; 