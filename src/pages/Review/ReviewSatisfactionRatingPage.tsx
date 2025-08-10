import React, { useState, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/common/Header";
import ProgressBar from "../../components/Review/ProgressBar";
import ReviewContentLayout from "../../components/Review/ReviewContentLayout";
import BottomFixedWrapper from "../../components/common/BottomFixedWrapper";
import Button from "../../components/common/Button/Button";
import BuildingMotion from "../../components/Review/effects/BuildingMotion";
import { FloatingCoinsEffect, MoneyInteraction } from "../../components/Review/effects/SatisfactionEffects";
import coinImage from "../../assets/money/coin.svg";
import { FloatingItem } from "../../types/review";
import { useGetStoreDetail } from "../../hooks/queries/useGetStoreDetail";

const ReviewSatisfactionRatingPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // URL에서 storeId 파라미터 추출
    const storeId = searchParams.get("storeId");
    
    // 가게 정보 가져오기
    const { store } = useGetStoreDetail(storeId || "");
    const storeName = store?.name || "가게";
    
    const [clickCount, setClickCount] = useState(0);

    const maxClicks = 10;

    const [floatingItems] = useState<Array<FloatingItem>>([]);
    const [isMoneyAbsorbing, setIsMoneyAbsorbing] = useState(false);
    const [showMoney, setShowMoney] = useState(true);
    
    const buildingRef = useRef<HTMLDivElement>(null);
    const moneyRef = useRef<HTMLImageElement>(null);

    // 건물 레벨: 클릭 횟수에 따라 0~4단계로 증가
    const finalStep = useMemo(() => {
        const currentStep = Math.min(Math.max(0, Math.floor((clickCount - 1) / 2)), 3);
        return clickCount >= 9 ? 4 : currentStep;
    }, [clickCount]);

    // 지폐 흡수 모션 공통 함수
    const beginAbsorb = useCallback(() => {
        if (isMoneyAbsorbing) return; 
        setIsMoneyAbsorbing(true);
        setTimeout(() => {
            setShowMoney(false);
            setTimeout(() => {
                setShowMoney(true); 
                setIsMoneyAbsorbing(false);
            }, 200);
        }, 800);
    }, [isMoneyAbsorbing]);

    const handleClick = useCallback((type: 'store' | 'money') => {
        void type; 
        if (isMoneyAbsorbing || clickCount >= maxClicks) return; // 조기 return
        beginAbsorb();
        setClickCount((c) => Math.min(c + 1, maxClicks));
    }, [beginAbsorb, isMoneyAbsorbing, clickCount, maxClicks]);

    // 건물과 지폐의 상대적 위치 계산 (흡수 애니메이션용)
    const getRelativePosition = () => {
        if (!buildingRef.current || !moneyRef.current) {
            return { x: 0, y: -300 };
        }

        const buildingRect = buildingRef.current.getBoundingClientRect();
        const moneyRect = moneyRef.current.getBoundingClientRect();

        const deltaX = (buildingRect.left + buildingRect.width / 2) - (moneyRect.left + moneyRect.width / 2);
        const deltaY = (buildingRect.top + buildingRect.height / 2) - (moneyRect.top + moneyRect.height / 2);

        return { x: deltaX, y: deltaY };
    };

    const handleNext = () => {
        navigate("/review/detail", {
            state: {
                storeId: storeId || "temp-store-id",
                storeName: storeName,
                isPositive: true,
                score: Math.max(1, Math.min(10, clickCount)), 
            }
        });
    };

    return (
        <div className="min-h-screen bg-white px-0">
            <Header 
                onBack={() => navigate(-1)}
                center="평가하기"
            />
            
            <ReviewContentLayout
                topEffect={<FloatingCoinsEffect floatingItems={floatingItems} />}
                buildingImage={(
                    <div ref={buildingRef}>
                        <BuildingMotion
                            src={new URL(`../../assets/buildings/building-level-${finalStep + 1}.svg`, import.meta.url).href}
                            alt={`건물 레벨 ${finalStep + 1}`}
                            onClick={() => handleClick('store')}
                            scale={clickCount > 0 ? 1.1 : 1}
                        >
                            {/* 건물 위 부유하는 코인 */}
                            <motion.div 
                                className="absolute -top-6 left-1/2 transform -translate-x-1/2"
                                animate={{ y: [0, -12, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                <img src={coinImage} alt="코인" className="w-27 h-27 drop-shadow-lg" />
                            </motion.div>
                        </BuildingMotion>
                    </div>
                )}
                bottomImage={(
                    <MoneyInteraction
                        showMoney={showMoney}
                        isMoneyAbsorbing={isMoneyAbsorbing}
                        onMoneyClick={() => handleClick('money')}
                        getRelativePosition={getRelativePosition}
                        imgRef={moneyRef}
                    />
                )}
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

