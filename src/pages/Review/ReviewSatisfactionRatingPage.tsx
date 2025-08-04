import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import ProgressBar from "../../components/Review/ProgressBar";
import ReviewContentLayout from "../../components/Review/ReviewContentLayout";
import BottomFixedWrapper from "../../components/common/BottomFixedWrapper";
import Button from "../../components/common/Button/Button";
import BuildingMotion from "../../components/Review/effects/BuildingMotion";
import { FloatingCoinsEffect, MoneyInteraction } from "../../components/Review/effects/SatisfactionEffects";
import coinImage from "../../assets/money/coin.svg";
import { FloatingItem } from "../../types/review";

const ReviewSatisfactionRatingPage: React.FC = () => {
    const navigate = useNavigate();
    const [clickCount, setClickCount] = useState(0);

    const maxClicks = 10;

    const [floatingItems, setFloatingItems] = useState<Array<FloatingItem>>([]);
    const [itemId, setItemId] = useState(0);
    const [isMoneyAbsorbing, setIsMoneyAbsorbing] = useState(false);
    const [showMoney, setShowMoney] = useState(true);
    
    const buildingRef = useRef<HTMLDivElement>(null);
    const moneyRef = useRef<HTMLDivElement>(null);

    // 건물 레벨: 클릭 횟수에 따라 0~4단계로 증가 (성장하는 효과)
    const currentStep = Math.min(Math.max(0, Math.floor((clickCount - 1) / 2)), 3);
    const finalStep = clickCount >= 9 ? 4 : currentStep;

    const handleClick = useCallback((type: 'store' | 'money') => {
        if (clickCount >= maxClicks) return;
        if (type === 'money' && isMoneyAbsorbing) return;

        if (type === 'store') {
            // 건물 클릭시 코인 생성
            const newCoin: FloatingItem = {
                id: itemId,
                x: Math.random() * 200 - 100,
                y: Math.random() * 60 + 50,
                type: 'coin'
            };
            
            setFloatingItems(prev => [...prev, newCoin]);
            setItemId(prev => prev + 1);

            // 3초 후 코인 제거
            setTimeout(() => {
                setFloatingItems(prev => prev.filter(item => item.id !== newCoin.id));
            }, 3000);
        } else {
            // 지폐 흡수 애니메이션 시작
            setIsMoneyAbsorbing(true);

            setTimeout(() => {
                setShowMoney(false);
                
                // 새로운 지폐 생성
                setTimeout(() => {
                    setShowMoney(true);
                    setIsMoneyAbsorbing(false);
                }, 200);
            }, 800);
        }

        setClickCount(clickCount + 1);
    }, [clickCount, maxClicks, isMoneyAbsorbing, itemId]);

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
        navigate("/review/detail");
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
                            {/* 건물 위의 부유하는 코인 */}
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

