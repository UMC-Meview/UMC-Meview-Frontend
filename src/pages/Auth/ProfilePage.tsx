import React from "react";
import { useNavigate } from "react-router-dom";
import { logout, getUserInfo, getCurrentUserNickname } from "../../utils/auth";
import Button from "../../components/common/Button/Button";

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const userInfo = getUserInfo();
    const currentNickname = getCurrentUserNickname();

    const handleLogout = () => {
        // 로그아웃 시 localStorage 데이터 삭제 (임시 회원가입 데이터 포함)
        logout();
        
        // 로그인 페이지로 이동
        navigate("/login");
        
        console.log("로그아웃 완료 - localStorage 데이터 삭제됨");
    };

    return (
        <div className="min-h-screen bg-white p-6">
            <h1 className="text-2xl font-bold mb-6">프로필</h1>
            
            {userInfo ? (
                <div className="space-y-4 mb-8">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h2 className="text-lg font-semibold mb-2">사용자 정보</h2>
                        <p><strong>닉네임:</strong> {userInfo.nickname}</p>
                        <p><strong>성별:</strong> {userInfo.gender}</p>
                        <p><strong>출생년도:</strong> {userInfo.birthYear}</p>
                        <p><strong>취향:</strong> {userInfo.tastePreferences.join(", ")}</p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-blue-800">
                            안녕하세요, <strong>{currentNickname}</strong>님! 👋
                        </p>
                    </div>
                </div>
            ) : (
                <div className="p-4 bg-red-50 rounded-lg mb-8">
                    <p className="text-red-800">로그인이 필요합니다.</p>
                </div>
            )}
            
            <Button 
                onClick={handleLogout}
                variant="primary"
                className="w-full"
            >
                로그아웃
            </Button>
        </div>
    );
};

export default ProfilePage;
