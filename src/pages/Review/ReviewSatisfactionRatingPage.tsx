import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import ProgressBar from "../../components/Review/ProgressBar";
import ReviewContentLayout from "../../components/Review/ReviewContentLayout";
import BottomFixedWrapper from "../../components/common/BottomFixedWrapper";
import Button from "../../components/common/Button/Button";
import SatisfactionVisual from "../../components/Review/SatisfactionVisual";

const ReviewSatisfactionRatingPage: React.FC = () => {
    const navigate = useNavigate();
    const [clickCount, setClickCount] = useState(0);

    const maxClicks = 10;

    const handleStoreClick = () => {
        if (clickCount >= maxClicks) return;

        const newClickCount = clickCount + 1;
        setClickCount(newClickCount);
    };

    const handleNext = () => {
        navigate("/review/detail");
    };

    const visualComponents = SatisfactionVisual({
        clickCount,
        maxClicks,
        onStoreClick: handleStoreClick
    });

    return (
        <div className="min-h-screen bg-white px-6 sm:px-8 md:px-10 lg:px-12">
            <Header 
                onBack={() => navigate(-1)}
                center="평가하기"
            />
            
            <ReviewContentLayout
                topEffect={visualComponents.topEffect}
                buildingImage={visualComponents.buildingImage}
                bottomImage={visualComponents.bottomImage}
            />
            
            <ProgressBar
                clickCount={clickCount}
                maxClicks={maxClicks}
                progressLabel="클릭완료"
                showBonus={true}
                showProgress={false}
            />
            
            <BottomFixedWrapper>
                <Button
                    onClick={handleNext}
                    variant="primary"
                    disabled={clickCount === 0}
                    className="bg-orange-500 hover:bg-orange-600"
                >
                    다음으로
                </Button>
            </BottomFixedWrapper>
        </div>
    );
};

export default ReviewSatisfactionRatingPage;

