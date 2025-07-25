import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";
import Button from "../../components/common/Button/Button";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import ProfileInfoSection from "../../components/common/auth/ProfileInfoSection";
import ProfileDropdownMenu from "../../components/common/Button/ProfileDropdownMenu";
import { useGetUserProfile } from "../../hooks/queries/useGetUserProfile";
import UserReviewInfo from "../../components/store/UserReviewInfo";
import OrangePencilIcon from "../../assets/Orangepencil.svg";


const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { data: userProfile, isLoading, error, refetch } = useGetUserProfile();
    
    // 페이지 진입 시 최신 데이터 가져오기
    React.useEffect(() => {
        refetch();
        const handleVisibilityChange = () => {
            if (!document.hidden) refetch();
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [refetch]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleEditProfile = () => {
        setIsMenuOpen(false);
        navigate("/profile/edit");
    };

    // 더미 리뷰 데이터 - 추후 API 연동 시 실제 데이터로 교체
    const dummyReviews = [
        {
            _id: "1", store: "store1", 
            user: { _id: "user1", nickname: "홍길동", tastePreferences: [], birthYear: "1990", gender: "male" },
            isPositive: true, score: 6,
            storeReviews: ["분위기가 좋아요", "친절해요", "서비스가 좋아요"],
            foodReviews: ["차향지", "적당히 매워요"],
            imageUrl: "https://via.placeholder.com/400x200",
            createdAt: "2024-01-01", updatedAt: "2024-01-01"
        },
        {
            _id: "2", store: "store2",
            user: { _id: "user1", nickname: "홍길동", tastePreferences: [], birthYear: "1990", gender: "male" },
            isPositive: false, score: 2,
            storeReviews: ["양이 많아요", "친절해요"],
            foodReviews: ["직항지"],
            imageUrl: "https://via.placeholder.com/400x200",
            createdAt: "2024-01-01", updatedAt: "2024-01-01"
        }
    ];

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
                                        보너스 평균 6만원
                                    </span>
                                    <span className="px-2 py-0.5 bg-white rounded-full text-xs font-medium border border-orange-400 text-orange-400">
                                        할퀸 수 평균 2회
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 리뷰 목록 */}
                        <div className="space-y-3">
                            {dummyReviews.map((review) => (
                                <UserReviewInfo key={review._id} review={review} storeName="모토이시" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProfilePage;
