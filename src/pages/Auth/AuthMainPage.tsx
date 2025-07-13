import Logo from "../../components/common/Logo.tsx";
import Button from "../../components/common/Button/Button.tsx";
import React from "react";
import { useNavigate } from "react-router-dom";
import BottomFixedWrapper from "../../components/common/BottomFixedWrapper.tsx";

const AuthMainPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white w-full mx-auto relative flex flex-col">
            {/* 중앙: 로고 + 텍스트 */}
            <div className="flex-1 flex flex-col justify-center items-center px-6">
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
                <div className="flex flex-col gap-3 w-full">
                    <Button
                        variant="secondary"
                        onClick={() => navigate("/signup")}
                        className="font-normal text-sm w-full h-[46px]"
                    >
                        로그인 하기
                    </Button>
                    <Button
                        onClick={() => navigate("/store-registration")}
                        className="!bg-[#B0B0B0] text-black font-normal text-sm w-full h-[46px]"
                    >
                        가게 등록하기
                    </Button>
                </div>
            </BottomFixedWrapper>
        </div>
    );
};

export default AuthMainPage;
