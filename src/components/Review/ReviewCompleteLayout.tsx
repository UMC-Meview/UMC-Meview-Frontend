import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import Button from "../common/Button/Button";
import Bigcheck from "../../assets/Bigcheck.svg";

interface ReviewCompleteLayoutProps {
    title: React.ReactNode;
    description: React.ReactNode;
    buttonText: string;
    onButtonClick: () => void;
}

const ReviewCompleteLayout: React.FC<ReviewCompleteLayoutProps> = ({
    title,
    description,
    buttonText,
    onButtonClick
}) => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-white">
            <Header 
                onBack={handleGoBack}
            />
            <div className="flex flex-col items-center justify-start min-h-[calc(100vh-120px)] px-6 sm:px-8 md:px-10 lg:px-12 pt-35">
                <div className="text-center">
                    <div className="mb-15 flex justify-center">
                        <img src={Bigcheck} alt="완료 체크마크" className="w-20 h-14" />
                    </div>
                    <h1 className="text-xl font-bold text-black mb-4">
                        {title}
                    </h1>
                    <p className="text-sm text-black mb-25">
                        {description}
                    </p>
                    <Button onClick={onButtonClick} variant="compact">
                        {buttonText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ReviewCompleteLayout; 