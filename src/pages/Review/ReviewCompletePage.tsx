import React from "react";
import { useNavigate } from "react-router-dom";
import ReviewCompleteLayout from "../../components/Review/ReviewCompleteLayout";

const ReviewCompletePage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/");
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
        </div>
    );
};

export default ReviewCompletePage;
