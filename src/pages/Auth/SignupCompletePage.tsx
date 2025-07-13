import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/common/Logo.tsx";
import Button from "../../components/common/Button/Button.tsx";
import BottomFixedWrapper from "../../components/common/BottomFixedWrapper.tsx";

const SignupCompletePage: React.FC = () => {
    const navigate = useNavigate();

    const handleComplete = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-white w-full relative flex flex-col">
            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-end pb-[50vh] px-6">
                <Logo />
                <h2 className="text-2xl font-bold text-black mb-4 mt-8">
                    가입 완료!
                </h2>
                <p className="text-black text-base text-center font-bold">
                    이제 당신의 솔직한 미뷰를 남겨주세요.
                </p>
            </div>
            {/* 하단 고정 버튼 */}
            <BottomFixedWrapper>
                <Button onClick={handleComplete} variant="primary">
                    리뷰 구경가기
                </Button>
            </BottomFixedWrapper>
        </div>
    );
};

export default SignupCompletePage;
