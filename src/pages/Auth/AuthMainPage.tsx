import Logo from "../../components/common/Logo.tsx";
import Button from "../../components/common/Button/Button.tsx";
import React from "react";
import { useNavigate } from "react-router-dom";

const AuthMainPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen bg-white max-w-[390px] w-full mx-auto flex flex-col justify-between relative"
            style={{ height: "100dvh" }}
        >
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
            <div className="flex flex-col gap-3 w-full px-6 pb-[48px]">
                <Button
                    variant="secondary"
                    onClick={() => navigate("/signup")}
                    className="font-normal text-sm !w-[282px] !h-[46px] mx-auto"
                >
                    로그인 하기
                </Button>
                <Button
                    onClick={() => navigate("/store-registration")}
                    className="!bg-[#B0B0B0] text-black font-normal text-sm !w-[282px] !h-[46px] mx-auto"
                >
                    가게 등록하기
                </Button>
            </div>
        </div>
    );
};

export default AuthMainPage;
