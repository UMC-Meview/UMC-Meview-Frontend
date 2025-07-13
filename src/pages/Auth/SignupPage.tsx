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
        <div className="min-h-screen bg-white w-full relative flex flex-col">
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

            {/* Content: TastePreferencePage.tsx와 동일한 구조로 통일 */}
            <div
                className="flex-1 flex flex-col justify-start px-6"
                style={{ marginTop: "56px" }}
            >
                {/* 타이틀 wrapper: 위치 고정 */}
                <div className="w-full max-w-[400px] mx-auto flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left leading-tight w-full">
                        <div>닉네임을</div>
                        <div className="flex items-end gap-2">
                            <div>입력해주세요.</div>
                        </div>
                    </h2>
                    {/* 입력 영역: 타이틀과 분리, flex-1로 아래로 밀림 → 타이틀 아래로 이동 */}
                    <div className="relative mb-8 w-full mt-12">
                        <div className="flex items-center border-b-2 border-[#FF774C] w-full">
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="미냥"
                                className="flex-1 px-0 py-1 text-xl font-medium bg-transparent border-0 outline-none transition-colors placeholder:text-xl placeholder:font-medium"
                                maxLength={12}
                            />
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
                                className={`ml-2 ${
                                    nickname.length >= 2 && nickname.length <= 12
                                        ? "w-6 h-6"
                                        : "w-7 h-7"
                                }`}
                            />
                        </div>
                        <p
                            className={`text-base mt-2 ${
                                nickname.length >= 2 && nickname.length <= 12
                                    ? "text-[#FF774C]"
                                    : "text-gray-500"
                            } w-full`}
                        >
                            2자 이상 12자 이하로 입력해주세요.
                        </p>
                    </div>
                </div>
                {/* 입력 영역 삭제됨 */}
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
