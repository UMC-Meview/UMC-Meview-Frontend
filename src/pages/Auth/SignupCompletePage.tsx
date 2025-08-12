import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/common/Logo.tsx";
import Button from "../../components/common/Button/Button.tsx";
import BottomFixedWrapper from "../../components/common/BottomFixedWrapper.tsx";
import FixedFrameLayout from "../../layouts/FixedFrameLayout";
import { clearTempSignupData } from "../../utils/auth";

const SignupCompletePage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        clearTempSignupData();
    }, []);

    return (
        <FixedFrameLayout scrollable={false}>
            <div className="min-h-[100dvh] flex items-center justify-center px-6">
                <div className="text-center">
                    <Logo />
                    <h2 className="text-2xl font-bold text-black mb-4 mt-8">가입 완료!</h2>
                    <p className="text-black text-base font-bold">이제 당신의 솔직한 미뷰를 남겨주세요.</p>
                </div>
            </div>
            <BottomFixedWrapper>
                <Button onClick={() => navigate("/")} variant="primary">리뷰 구경가기</Button>
            </BottomFixedWrapper>
        </FixedFrameLayout>
    );
};

export default SignupCompletePage;
