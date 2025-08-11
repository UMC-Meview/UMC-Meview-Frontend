import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button/Button";
import Header from "../../components/common/Header.tsx";
import BottomFixedWrapper from "../../components/common/BottomFixedWrapper.tsx";
import ErrorMessage from "../../components/common/ErrorMessage";
import { getTempSignupData, updateTempProfile } from "../../utils/auth";
import { usePostSignup } from "../../hooks/queries/usePostSignup";
import { useKeyboardDetection } from "../../hooks/useKeyboardDetection";

const ProfileInfoPage: React.FC = () => {
    const location = useLocation();
    const signupData = getTempSignupData();
    const { signup, isLoading, error, isSuccess } = usePostSignup();
    const [birthYear, setBirthYear] = useState<string>(signupData.birthYear || "");
    const [selectedGender, setSelectedGender] = useState<string>(signupData.gender || "");
    const isKeyboardVisible = useKeyboardDetection();
    const navigate = useNavigate();

    // 회원가입 성공 시 완료 페이지로 이동
    useEffect(() => {
        if (isSuccess) {
            navigate("/signup-complete");
        }
    }, [isSuccess, navigate]);

    const handleBirthYearChange = (value: string) => {
        const numericValue = value.replace(/[^0-9]/g, "");
        if (numericValue.length <= 6) {
            setBirthYear(numericValue);
        }
    };

    const handleNext = () => {
        if (birthYear.length === 6 && selectedGender) {
            const englishGender = selectedGender === "남성" ? "male" : "female";
            
            updateTempProfile(birthYear, englishGender);
            
            signup({
                ...signupData,
                nickname: (location.state as { nickname?: string })?.nickname || signupData.nickname,
                birthYear,
                gender: englishGender,
            });
        }
    };

    const isFormValid = birthYear.length === 6 && selectedGender;

    return (
        <div className="min-h-screen bg-white">
            <Header 
                onBack={() => navigate(-1)} 
                showLogo={true} 
                page={3} 
            />

            <div className="flex-1 flex flex-col justify-start px-6 sm:px-8 md:px-10 lg:px-12">
                <div className="w-full max-w-[400px] mx-auto flex flex-col items-center mb-8 mt-14">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left leading-tight w-full">
                        <div>출생년도와 성별을</div>
                        <div>알려주세요</div>
                    </h2>
                </div>

                <div className="w-full max-w-[400px] mx-auto flex flex-col items-center">
                    {/* 생년월일 입력 */}
                    <div className="mb-12 w-full">
                        <p className="text-gray-600 text-[15px] mb-1">생년월일</p>
                        <input
                            type="text"
                            value={birthYear}
                            onChange={(e) => handleBirthYearChange(e.target.value)}
                            placeholder="예시) 250701"
                            className="w-full px-0 py-2 text-lg font-medium bg-transparent border-0 border-b-2 border-black outline-none transition-colors focus:border-[#FF774C]"
                            maxLength={6}
                        />
                    </div>

                    {/* 성별 선택 */}
                    <div className="mb-8 w-full mt-10">
                        <p className="text-gray-600 text-[15px] mb-6">성별</p>
                        <div className="flex gap-[45px] justify-center">
                            {["남성", "여성"].map((option) => (
                                <button
                                    key={option}
                                    onClick={() => setSelectedGender(option)}
                                    className={`w-[140px] h-[80px] rounded-[20px] border bg-white shadow-[0_2px_8px_0_rgba(0,0,0,0.12)] text-[18px] font-medium whitespace-nowrap transition-all duration-200 ${
                                        selectedGender === option
                                            ? "border-[#FF774C] text-gray-800"
                                            : "border-transparent text-gray-800"
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {error && <ErrorMessage message={error.message} />}
            
            {!isKeyboardVisible && (
                <BottomFixedWrapper>
                    <Button
                        onClick={handleNext}
                        disabled={!isFormValid || isLoading}
                        variant={isFormValid && !isLoading ? "primary" : "disabled"}
                    >
                        {isLoading ? "가입 중..." : "가입완료"}
                    </Button>
                </BottomFixedWrapper>
            )}
        </div>
    );
};

export default ProfileInfoPage;
