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
import UserReviewInfo from "../../components/store/UserReviewInfo";
import OrangePencilIcon from "../../assets/Orangepencil.svg";
import { getUserInfo } from "../../utils/auth";

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { data: userProfile, isLoading, error, refetch } = useGetUserProfile();
    
    // 사용자 ID 가져오기
    const userInfo = getUserInfo();
    const userId = userInfo?.id;
    
    // 사용자 리뷰 목록 조회
    const {
        reviews,
        averagePositiveScore,
        averageNegativeScore,
        isLoading: reviewsLoading,
        error: reviewsError,
        isSuccess: reviewsSuccess,
        refetch: refetchReviews,
    } = useGetUserReviews(userId || "");
    
    // 디버깅용: 실제 API 응답 데이터 확인
    React.useEffect(() => {
        if (reviewsSuccess && reviews.length > 0) {
            console.log("실제 리뷰 데이터:", reviews);
            console.log("첫 번째 리뷰의 store ID:", reviews[0]?.store);
            console.log("첫 번째 리뷰의 store ID 타입:", typeof reviews[0]?.store);
            console.log("첫 번째 리뷰의 store ID 길이:", reviews[0]?.store?.length);
        }
    }, [reviewsSuccess, reviews]);
    
    // 페이지 진입 시 최신 데이터 가져오기
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
            // 페이지가 포커스를 받을 때도 데이터 새로고침 (리뷰 작성 후 돌아왔을 때)
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

    // API 응답 데이터를 UserReviewInfo 컴포넌트에 맞는 형태로 변환
    const transformedReviews = reviews.map((review) => ({
        _id: review._id,
        store: review.store,
        user: { _id: userId || "", nickname: userProfile?.nickname || "", tastePreferences: [], birthYear: "", gender: "" },
        content: review.content, // 실제 리뷰 텍스트 내용
        isPositive: review.isPositive,
        score: review.score,
        storeReviews: [], // 백엔드에서 제공하지 않음 - 빈 배열로 설정
        foodReviews: [], // 백엔드에서 제공하지 않음 - 빈 배열로 설정
        imageUrl: "", // 백엔드에서 제공하지 않음 - 빈 문자열로 설정
        createdAt: review.createdAt,
        updatedAt: review.createdAt
    }));

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
        <div className="min-h-screen bg-white">
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

            {/* 프로필 정보 섹션 */}
            <ProfileInfoSection
                imageUrl={userProfile?.profileImageUrl}
                nickname={userProfile?.nickname || "홍길동"}
                introduction={userProfile?.introduction || ""}
                tastePreferences={userProfile?.tastePreferences}
                reviewCount={userProfile?.reviewCount}
                favoriteCount={userProfile?.favoriteCount}
                isEditable={false}
                className="-ml-2"
            />

            {/* 구분선 */}
            <div className="mt-6 mb-7">
                <hr className="border-gray-100 border-4" />
            </div>

            {/* 리뷰 섹션 */}
            <div className="px-6 sm:px-8 md:px-10 lg:px-12 mb-8">
                <div className="flex justify-center">
                    <div className="w-[356px]">
                        {/* 내가 작성한 리뷰 헤더 */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-2">
                                <img src={OrangePencilIcon} alt="편집" className="w-4 h-4" />
                                <h3 className="text-base font-semibold text-gray-900">내가 작성한 리뷰</h3>
                                <div className="flex gap-1 ml-2">
                                    <span className="px-2 py-0.5 bg-white rounded-full text-xs font-medium border border-orange-400 text-orange-400">
                                        보너스 평균 {averagePositiveScore.toFixed(0)}만원
                                    </span>
                                    <span className="px-2 py-0.5 bg-white rounded-full text-xs font-medium border border-orange-400 text-orange-400">
                                        할퀸 수 평균 {averageNegativeScore.toFixed(0)}회
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
                        ) : reviewsSuccess && transformedReviews.length > 0 ? (
                            <div className="space-y-3">
                                {transformedReviews.map((review) => (
                                    <UserReviewInfo 
                                        key={review._id} 
                                        review={review}
                                        storeName="가게명" // 실제 가게명이 있다면 여기에 전달
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
