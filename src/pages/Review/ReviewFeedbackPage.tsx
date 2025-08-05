import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Button from "../../components/common/Button/Button";
import BottomFixedWrapper from "../../components/common/BottomFixedWrapper";

const ReviewFeedbackPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSatisfaction = () => {
        navigate("/review/satisfaction-rating");
    };

    const handleDissatisfaction = () => {
        navigate("/review/dissatisfaction-rating");
    };

    return (
        <div className="min-h-screen bg-white">
            <Header 
                onBack={() => navigate(-1)} 
                center="평가하기" 
            />
            
            <div className="px-6 sm:px-8 md:px-10 lg:px-12 pb-32">
                <div className="flex flex-col justify-center min-h-[60vh]">
                    <h1 className="text-xl font-bold text-black mb-2 text-center">
                        '모토이시'는 만족스러우셨나요?
                    </h1>
                    <p className="text-sm text-black text-center">
                        만족스러웠다면 만족합니다 버튼을,<br />
                        불만족스러웠다면 불만족합니다 버튼을 눌러주세요!
                    </p>
                </div>
            </div>
            
            <BottomFixedWrapper>
                <div className="flex flex-col gap-4">
                    <Button 
                        onClick={handleSatisfaction} 
                        variant="primary"
                    >
                        만족합니다
                    </Button>
                    
                    <button 
                        onClick={handleDissatisfaction} 
                        className="w-full py-4 px-6 rounded-full border-2 border-[#FF774C] bg-white text-[#FF774C] font-medium text-base transition-colors duration-200 hover:bg-[#FF774C] hover:text-white"
                    >
                        불만족합니다
                    </button>
                </div>
            </BottomFixedWrapper>
        </div>
    );
};

export default ReviewFeedbackPage; 