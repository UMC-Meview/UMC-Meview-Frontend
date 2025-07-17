import { useNavigate } from "react-router-dom";
import { logout, getUserInfo } from "../../utils/auth";
import Button from "../../components/common/Button/Button";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import ProfileImage from "../../components/common/auth/ProfileImage";

/**
 * 사용자 프로필 페이지 컴포넌트
 * 사용자 정보 표시, 프로필 수정, 로그아웃 기능을 제공
 */
const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const userInfo = getUserInfo();
    const introText = "해산물과 맵고 짠 것을 좋아해요";

    // 로그아웃 처리 함수
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // 뒤로가기 처리 함수
    const handleBack = () => {
        navigate(-1);
    };

    // 프로필 수정 페이지로 이동하는 함수
    const handleEditProfile = () => {
        navigate("/profile/edit");
    };

    return (
        <div className="min-h-screen bg-white">
            {/* 헤더 섹션 - 뒤로가기, 제목, 프로필수정 버튼 */}
            <div className="pt-10">
                <Header
                    onBack={handleBack}
                    center={<h1 className="text-[19px] font-bold text-black">프로필</h1>}
                    right={
                        <button 
                            onClick={handleEditProfile}
                            className="px-3 py-0.5 bg-white border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            프로필수정
                        </button>
                    }
                />
            </div>

            {/* 프로필 정보 섹션 - 프로필 이미지, 닉네임, 통계, 입맛 선호도 */}
            <div className="px-4 pt-6 pb-2 space-y-5">
                <div className="flex justify-center">
                    <div className="flex items-start space-x-4 max-w-md">
                        {/* 프로필 이미지 */}
                        <ProfileImage />
                        
                        <div className="flex-1 space-y-3">
                            {/* 닉네임과 통계 정보 */}
                            <div className="flex items-center">
                                <h2 className="text-[24px] font-semibold text-gray-800">{userInfo?.nickname || "홍길동"}</h2>
                                <div className="flex space-x-3 text-[14px] ml-auto mr-3">
                                    <span className="text-gray-500">리뷰수 <span className="font-black text-gray-800">32</span></span>
                                    <span className="text-gray-500">찜 <span className="font-black text-gray-800">52</span></span>
                                </div>
                            </div>
                            
                            {/* 대표 입맛 선호도 태그들 */}
                            <div className="space-y-2">
                                <h3 className="text-[14px] font-medium text-gray-700">대표입맛</h3>
                                <div className="w-[230px]">
                                    <div className="flex flex-wrap gap-3">
                                        {userInfo?.tastePreferences?.map((taste, index) => (
                                            <span key={index} className="px-2.5 py-1 rounded-full shadow-[0_2px_8px_0_rgba(0,0,0,0.12)] text-[15px] font-medium border bg-white border-transparent text-gray-800 min-h-[22px] whitespace-nowrap">
                                                {taste}
                                            </span>
                                        )) || (
                                            // 기본 입맛 태그들 (사용자 정보가 없을 때 표시)
                                            <>
                                                <span className="px-2.5 py-1 rounded-full shadow-[0_2px_8px_0_rgba(0,0,0,0.12)] text-[15px] font-medium border bg-white border-transparent text-gray-800 min-h-[22px] whitespace-nowrap">매운맛</span>
                                                <span className="px-2.5 py-1 rounded-full shadow-[0_2px_8px_0_rgba(0,0,0,0.12)] text-[15px] font-medium border bg-white border-transparent text-gray-800 min-h-[22px] whitespace-nowrap">자극적인</span>
                                                <span className="px-2.5 py-1 rounded-full shadow-[0_2px_8px_0_rgba(0,0,0,0.12)] text-[15px] font-medium border bg-white border-transparent text-gray-800 min-h-[22px] whitespace-nowrap">해산물</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 한 줄 소개 섹션 */}
            <div className="px-4">
                <div className="flex justify-center">
                    <div className="flex items-start space-x-4 w-[356px]">
                        <div className="flex-1">
                            <span className="text-[14px] text-gray-600">
                                한 줄 소개
                            </span>
                            <div className="mt-1 flex items-center space-x-2 px-4 py-1.5 rounded-tr-full rounded-br-full rounded-bl-full shadow-[0_2px_8px_0_rgba(0,0,0,0.12)] bg-white border border-transparent w-[349px] h-[36px]">
                                <div 
                                    className="text-[15px] text-black flex-1 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => {
                                        console.log("한 줄 소개 편집");
                                    }}
                                >
                                    {introText}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 구분선 */}
            <div className="mt-12 mb-6">
                <hr className="border-gray-100 border-4" />
            </div>

            {/* 로그아웃 버튼 섹션 */}
            <div className="px-4 mb-6">
                <Button 
                    onClick={handleLogout}
                    variant="primary"
                    className="w-full"
                >
                    로그아웃
                </Button>
            </div>

            {/* 푸터 */}
            <Footer />
        </div>
    );
};

export default ProfilePage;
