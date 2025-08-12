import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/common/Header";
import Button from "../../components/common/Button/Button";
import BottomFixedWrapper from "../../components/common/BottomFixedWrapper";
import { useGetStoreDetail } from "../../hooks/queries/useGetStoreDetail";

const ReviewFeedbackPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // URL에서 storeId 파라미터 추출
    const storeId = searchParams.get("storeId") || "temp-store-id";
    
    // 가게 정보 가져오기
    const { store, loading } = useGetStoreDetail(storeId);
    const storeName = store?.name || "가게";

    const handleSatisfaction = () => {
        if (storeId) {
            navigate(`/review/satisfaction-rating?storeId=${storeId}`);
        }
    };

    const handleDissatisfaction = () => {
        if (storeId) {
            navigate(`/review/dissatisfaction-rating?storeId=${storeId}`);
        }
    };

    return (
        <div className="bg-white mx-auto max-w-[390px]">
            <div className="sticky top-0 z-30 bg-white">
                <Header 
                    onBack={() => navigate("/")} 
                    center="평가하기" 
                />
            </div>
            <div className="overflow-y-auto" style={{ height: "calc(100dvh - 180px)", maxHeight: "calc(100dvh - 180px)" }}>
                <div className="px-6 pb-32">
                    <div className="flex flex-col justify-center min-h-[60vh]">
                        <h1 className="text-xl font-bold text-black mb-2 text-center">
                            {loading ? "로딩 중..." : `'${storeName}'는 만족스러우셨나요?`}
                        </h1>
                        <p className="text-sm text-black text-center">
                            만족스러웠다면 만족합니다 버튼을,<br />
                            불만족스러웠다면 불만족합니다 버튼을 눌러주세요!
                        </p>
                    </div>
                </div>
            </div>
            <BottomFixedWrapper>
                <div className="flex flex-col gap-4">
                    <Button onClick={handleSatisfaction} variant="primary">만족합니다</Button>
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