import React from "react";
import { useNavigate } from "react-router-dom";
import ReviewCompleteLayout from "../../components/Review/ReviewCompleteLayout";

const ReviewLoginPage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/signup");
    };

    return (
        <div className="bg-white mx-auto max-w-[390px]">
            <div className="overflow-y-auto" style={{ height: "100dvh" }}>
                <ReviewCompleteLayout
                    title={
                        <>
                            리뷰 작성이<br />
                            완료되었습니다!
                        </>
                    }
                    description={
                        <>
                            간단한 로그인으로 사람들의 솔직한<br />
                            리뷰를 구경해보세요!
                        </>
                    }
                    buttonText="미뷰 로그인하러 가기"
                    onButtonClick={handleLogin}
                />
            </div>
        </div>
    );
};

export default ReviewLoginPage; 