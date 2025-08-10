import React from "react";
import { useNavigate } from "react-router-dom";
import ReviewCompleteLayout from "../../components/Review/ReviewCompleteLayout";

const ReviewCompletePage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/");
    };
    
    const handleGoProfile = () => {
        navigate("/profile");
    };

    return (
        <div className="min-h-screen bg-white">
            <ReviewCompleteLayout
                title={
                    <>
                        리뷰 작성이<br />
                        완료되었습니다!
                    </>
                }
                description={
                    <>
                        미뷰에서 사람들의 솔직한 리뷰를<br />
                        구경해보세요!
                    </>
                }
                buttonText="미뷰 홈화면으로 이동하기"
                onButtonClick={handleGoHome}
            />
            
            {/* 추가 버튼 - 내 리뷰 보기 */}
            <div className="fixed bottom-24 left-0 right-0 px-6">
                <button
                    onClick={handleGoProfile}
                    className="w-full py-4 px-6 rounded-full border-2 border-orange-500 bg-white text-orange-500 font-medium text-base transition-colors duration-200 hover:bg-orange-50"
                >
                    내 리뷰 보러가기
                </button>
            </div>
        </div>
    );
};

export default ReviewCompletePage;
