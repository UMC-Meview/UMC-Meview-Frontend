import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.svg";

const ReviewEntryPage: React.FC = () => {
    const navigate = useNavigate();

    // 자동으로 리뷰 피드백 페이지로 이동
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/review/feedback");
        }, 3000); // 3초 후 자동 이동

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6 sm:px-8 md:px-10 lg:px-12">
            <div className="flex flex-col items-center">
                <img src={Logo} alt="로고" className="w-24 h-24" />
            </div>
        </div>
    );
};

export default ReviewEntryPage; 