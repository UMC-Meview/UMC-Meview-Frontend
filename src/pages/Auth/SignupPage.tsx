import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StepIndicator from "../../components/common/StepIndicator.tsx";
import Button from "../../components/common/Button/Button.tsx";
import logoIcon from "../../assets/Logo.svg";
import Header from "../../components/common/Header.tsx";
import checkRoundFill from "../../assets/Check_round_fill.svg";
import closeRoundFill from "../../assets/Close_round_fill.svg";
import BottomFixedWrapper from "../../components/common/BottomFixedWrapper.tsx";
import { getTempSignupData, updateTempNickname } from "../../utils/auth";
import { usePostLogin } from "../../hooks/queries/usePostLogin";

const SignupPage: React.FC = () => {
    const signupData = getTempSignupData();
    const { login, isLoading, error, isSuccess, data, isNewUser } = usePostLogin();
    const [nickname, setNickname] = useState(signupData.nickname);
    const navigate = useNavigate();

    const isValidNickname = nickname.length >= 2 && nickname.length <= 12;

    // localStorage에서 닉네임 초기화
    useEffect(() => {
        const currentData = getTempSignupData();
        setNickname(currentData.nickname);
    }, []);

    // 로그인 결과에 따른 페이지 이동
    useEffect(() => {
        if (isNewUser) {
            navigate("/taste-preference");
        } else if (isSuccess && data?.user) {
            navigate("/");
        }
    }, [isSuccess, data, isNewUser, navigate]);

    const handleNext = () => {
        if (isValidNickname) {
            updateTempNickname(nickname);
            login({ nickname });
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-white w-full relative flex flex-col">
            {/* 헤더 */}
            <div className="pt-10">
                <Header
                    onBack={handleBack}
                    center={
                        <img
                            src={logoIcon}
                            alt="Meview Logo"
                            className="w-6 h-6"
                        />
                    }
                    right={
                        <StepIndicator
                            currentStep={1}
                            totalSteps={3}
                            className="scale-110"
                        />
                    }
                />
            </div>

            {/* 메인 콘텐츠 */}
            <div className="flex-1 flex flex-col justify-start px-6 mt-14">
                <div className="w-full max-w-[400px] mx-auto flex flex-col items-center">
                    {/* 타이틀 */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left leading-tight w-full">
                        <div>닉네임을</div>
                        <div>입력해주세요.</div>
                    </h2>

                    {/* 입력 영역 */}
                    <div className="relative mb-8 w-full mt-12">
                        <div className="flex items-center border-b-2 border-[#FF774C] w-full">
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="미냥"
                                className="flex-1 px-0 py-1 text-xl font-medium bg-transparent border-0 outline-none transition-colors placeholder:text-xl placeholder:font-medium"
                                maxLength={12}
                                disabled={isLoading}
                            />
                            <img
                                src={isValidNickname ? closeRoundFill : checkRoundFill}
                                alt={isValidNickname ? "close" : "check"}
                                className={`ml-2 ${isValidNickname ? "w-6 h-6" : "w-7 h-7"}`}
                            />
                        </div>
                        <p className={`text-base mt-2 w-full ${isValidNickname ? "text-[#FF774C]" : "text-gray-500"}`}>
                            2자 이상 12자 이하로 입력해주세요.
                        </p>
                    </div>
                </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
                <div className="px-6 mb-4">
                    <p className="text-red-500 text-sm text-center">
                        {error.message}
                    </p>
                </div>
            )}

            {/* 하단 버튼 */}
            <BottomFixedWrapper>
                <Button
                    onClick={handleNext}
                    disabled={!isValidNickname || isLoading}
                    variant={isValidNickname && !isLoading ? "primary" : "disabled"}
                    className="w-[333px] h-[59px] text-lg font-bold rounded-full"
                >
                    {isLoading ? "확인 중..." : "다음"}
                </Button>
            </BottomFixedWrapper>
        </div>
    );
};

export default SignupPage;
