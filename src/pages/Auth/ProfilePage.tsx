import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";
import Button from "../../components/common/Button/Button";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import ProfileInfoSection from "../../components/auth/ProfileInfoSection";
import ProfileDropdownMenu from "../../components/common/Button/ProfileDropdownMenu";
import { useGetUserProfile } from "../../hooks/queries/useGetUserProfile";
import { useGetUserReviews } from "../../hooks/queries/useGetUserReviews";
import { useGetFavoriteStores } from "../../hooks/queries/useGetFavoriteStores";
import UserReviewInfo from "../../components/store/UserReviewInfo";
import OrangePencilIcon from "../../assets/Orangepencil.svg";
import { getUserInfo } from "../../utils/auth";

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const userInfo = getUserInfo();
    const userId = userInfo?.id;
    const { data: userProfile, isLoading, error, refetch } = useGetUserProfile(userId || "");
    
    const {
        userReviews,
        displayReviews,
        isLoading: reviewsLoading,
        error: reviewsError,
        isSuccess: reviewsSuccess,
        refetch: refetchReviews,
    } = useGetUserReviews(userId || "");

    // 찜 목록은 항상 불러와 개수 산출(로그인 상태일 때)
    const { favoriteStores: favoriteStoresForFallback } = useGetFavoriteStores(!!userId);

    // 표시용 카운트: 목록 길이를 우선 사용, 없으면 프로필 응답 사용
    const reviewCountDisplay = userReviews?.reviews
        ? userReviews.reviews.length
        : (userProfile?.reviewCount ?? 0);
    const favoriteCountDisplay = favoriteStoresForFallback
        ? favoriteStoresForFallback.length
        : (userProfile?.favoriteCount ?? 0);
    
    React.useEffect(() => {
        refetch();
        refetchReviews();
        
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                refetch();
                refetchReviews();
            }
        };
        
        const handleFocus = () => {
            refetch();
            refetchReviews();
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, [refetch, refetchReviews]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleEditProfile = () => {
        setIsMenuOpen(false);
        navigate("/profile/edit");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-gray-500">프로필 정보를 불러오는 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">프로필 정보를 불러올 수 없습니다</div>
                    <div className="text-gray-500 text-sm mb-4">{error.message}</div>
                    <Button onClick={() => window.location.reload()} variant="primary">
                        다시 시도
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white mx-auto max-w-[390px]">
            <div className="sticky top-0 z-30 bg-white">
                <Header
                    onBack={() => navigate(-1)}
                    center="프로필"
                    right={
                        <ProfileDropdownMenu
                            isOpen={isMenuOpen}
                            onToggle={() => setIsMenuOpen(!isMenuOpen)}
                            onClose={() => setIsMenuOpen(false)}
                            onEditProfile={handleEditProfile}
                            onLogout={handleLogout}
                        />
                    }
                />
            </div>

            {/* 프로필 정보 섹션 */}
            <ProfileInfoSection
                imageUrl={userProfile?.profileImageUrl}
                nickname={userProfile?.nickname || "홍길동"}
                introduction={userProfile?.introduction || ""}
                tastePreferences={userProfile?.tastePreferences}
                reviewCount={reviewCountDisplay}
                favoriteCount={favoriteCountDisplay}
                isEditable={false}
                className="-ml-2"
            />

            {/* 구분선 */}
            <div className="mt-6 mb-7">
                <hr className="border-gray-100 border-4" />
            </div>

            {/* 리뷰 섹션 */}
            <div className="px-6 mb-8">
                <div className="flex justify-center">
                    <div className="w-[356px]">
                        {/* 내가 작성한 리뷰 헤더 */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-2">
                                <img src={OrangePencilIcon} alt="편집" className="w-4 h-4" />
                                <h3 className="text-base font-semibold text-gray-900">내가 작성한 리뷰</h3>
                                <div className="flex gap-1 ml-2">
                                    <span className="px-2 py-0.5 bg-white rounded-full text-xs font-medium border border-orange-400 text-orange-400">
                                        보너스 평균 {(userReviews?.averagePositiveScore ?? 0).toFixed(0)}만원
                                    </span>
                                    <span className="px-2 py-0.5 bg-white rounded-full text-xs font-medium border border-orange-400 text-orange-400">
                                        할퀸 수 평균 {(userReviews?.averageNegativeScore ?? 0).toFixed(0)}회
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 리뷰 목록 */}
                        {reviewsLoading ? (
                            <div className="text-center py-8">
                                <div className="text-gray-500">리뷰 목록을 불러오는 중...</div>
                            </div>
                        ) : reviewsError ? (
                            <div className="text-center py-8">
                                <div className="text-red-500 mb-4">리뷰 목록을 불러올 수 없습니다</div>
                                <div className="text-gray-500 text-sm mb-4">{reviewsError}</div>
                                <Button onClick={refetchReviews} variant="primary">
                                    다시 시도
                                </Button>
                            </div>
                        ) : reviewsSuccess && displayReviews.length > 0 ? (
                            <div className="space-y-3">
                                {displayReviews.map((review) => (
                                    <UserReviewInfo 
                                        key={review._id}
                                        review={review}
                                        storeName={review.storeName}
                                        storeAddressShort={review.storeAddressShort}
                                        storeCategory={review.storeCategory}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-gray-500">작성한 리뷰가 없습니다.</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProfilePage;
