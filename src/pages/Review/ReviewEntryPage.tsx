import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../../assets/Logo.svg";

const ReviewEntryPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // URL에서 storeId 파라미터 추출
    const storeId = searchParams.get("storeId");

    // 자동으로 리뷰 피드백 페이지로 이동 (storeId와 함께)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (storeId) {
                navigate(`/review/feedback?storeId=${storeId}`);
            } else {
                // storeId가 없으면 홈으로 이동
                navigate("/");
            }
        }, 3000); // 3초 후 자동 이동

        return () => clearTimeout(timer);
    }, [navigate, storeId]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6 sm:px-8 md:px-10 lg:px-12">
            <div className="flex flex-col items-center">
                <img src={Logo} alt="로고" className="w-24 h-24" />
            </div>
        </div>
    );
};

export default ReviewEntryPage; 