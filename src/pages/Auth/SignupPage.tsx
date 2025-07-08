import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepIndicator from "../../components/common/StepIndicator.tsx";
import Button from "../../components/common/Button/Button.tsx";
import logoIcon from "../../assets/Logo.svg";
import Header from "../../components/common/Header.tsx";
import checkRoundFill from "../../assets/Check_round_fill.svg";
import closeRoundFill from "../../assets/Close_round_fill.svg";
import BottomFixedWrapper from "../../components/common/BottomFixedWrapper.tsx";

const SignupPage: React.FC = () => {
    const [nickname, setNickname] = useState("");
    const navigate = useNavigate();

    const isValidNickname = nickname.length >= 2 && nickname.length <= 12;

    const handleNext = () => {
        if (isValidNickname) {
            navigate("/taste-preference");
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-white max-w-[390px] w-full relative flex flex-col">
            {/* 헤더: 상단 패딩을 늘려 더 아래로 */}
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

            {/* Content: 타이틀을 더 아래로, 간격 조정 */}
            <div
                className="flex-1 flex flex-col justify-start px-6"
                style={{ marginTop: "80px" }}
            >
                <div className="w-full mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-10 text-left leading-tight">
                        <div>닉네임을</div>
                        <div>입력해주세요.</div>
                    </h2>

                    <div className="relative mb-3">
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="미냥"
                            className="w-full px-0 py-3 text-lg font-medium bg-transparent border-0 border-b-2 border-[#FF5436] outline-none transition-colors"
                            maxLength={12}
                        />
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                            <img
                                src={
                                    nickname.length >= 2 &&
                                    nickname.length <= 12
                                        ? closeRoundFill
                                        : checkRoundFill
                                }
                                alt={
                                    nickname.length >= 2 &&
                                    nickname.length <= 12
                                        ? "close"
                                        : "check"
                                }
                                className="w-6 h-6"
                            />
                        </div>
                    </div>
                    <p
                        className={`text-sm mt-2 ${
                            nickname.length >= 2 && nickname.length <= 12
                                ? "text-[#FF5436]"
                                : "text-gray-500"
                        }`}
                    >
                        2자 이상 12자 이하로 입력해주세요.
                    </p>
                </div>
            </div>

            {/* Bottom Button: 하단 여백 충분히, 버튼 두개 증가 */}
            <BottomFixedWrapper>
                <Button
                    onClick={handleNext}
                    disabled={!isValidNickname}
                    variant={isValidNickname ? "primary" : "disabled"}
                    className="w-[333px] h-[59px] text-lg font-bold rounded-full"
                >
                    다음
                </Button>
            </BottomFixedWrapper>
        </div>
    );
};

export default SignupPage;
