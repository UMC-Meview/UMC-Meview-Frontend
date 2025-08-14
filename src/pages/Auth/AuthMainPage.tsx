import Logo from "../../components/common/Logo.tsx";
import Button from "../../components/common/Button/Button.tsx";
import React from "react";
import { useNavigate } from "react-router-dom";
import BottomFixedWrapper from "../../components/common/BottomFixedWrapper.tsx";
import FixedFrameLayout from "../../layouts/FixedFrameLayout";
import Header from "../../components/common/Header.tsx";

const AuthMainPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <FixedFrameLayout
            scrollable={false}
            header={<Header onBack={() => navigate("/")} />}
        >
            {/* 중앙: 로고 + 텍스트 */}
            <div className="flex flex-col justify-center items-center px-6 -translate-y-10" style={{ minHeight: "calc(100dvh - 140px)" }}>
                <Logo />
                <div className="text-center mt-[24px]">
                    <h1 className="text-[22px] leading-[32px] font-bold text-black mb-4">
                        진짜가 궁금할 땐, 미뷰
                    </h1>
                    <p className="text-black text-base mt-2 font-bold">
                        지금 가입하고 솔직한 리뷰를 먼저 만나보세요.
                    </p>
                </div>
            </div>
            {/* 하단: 버튼 */}
            <BottomFixedWrapper>
                <div className="flex flex-col gap-4 w-full">
                    <Button
                        variant="secondary"
                        onClick={() => navigate("/signup")}
                        className="text-lg font-bold w-full h-[46px]"
                    >
                        로그인 하기
                    </Button>
                    <Button
                        onClick={() => navigate("/store-registration")}
                        className="!bg-[#B0B0B0] text-white text-lg font-bold w-full h-[46px]"
                    >
                        가게 등록하기
                    </Button>
                </div>
            </BottomFixedWrapper>
        </FixedFrameLayout>
    );
};

export default AuthMainPage;
