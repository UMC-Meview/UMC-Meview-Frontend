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
import type { MoneyInteractionHandle } from "../../components/Review/effects/SatisfactionEffects";
import coinImage from "../../assets/money/coin.svg";
import { FloatingItem } from "../../types/review";
import { useGetStoreDetail } from "../../hooks/queries/useGetStoreDetail";

const ReviewSatisfactionRatingPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // URL에서 storeId 파라미터 추출
    const storeId = searchParams.get("storeId") || "temp-store-id";
    
    // 가게 정보 가져오기
    const { store } = useGetStoreDetail(storeId);
    const storeName = store?.name || "가게";
    
    const [clickCount, setClickCount] = useState(0);

    const maxClicks = 10;

    const floatingItems = useMemo<Array<FloatingItem>>(() => [
        { id: 1, x: -60, y: 0, type: 'money' },
        { id: 2, x: 0, y: -10, type: 'money' },
        { id: 3, x: 60, y: 5, type: 'money' },
    ], []);
    
    const buildingRef = useRef<HTMLDivElement>(null);
    const moneyRef = useRef<HTMLImageElement>(null);
    const moneyInteractionRef = useRef<MoneyInteractionHandle>(null);

    // 건물 레벨: 클릭 횟수에 따라 0~4단계로 증가
    const finalStep = useMemo(() => {
        const currentStep = Math.min(Math.max(0, Math.floor((clickCount - 1) / 2)), 3);
        return clickCount >= 9 ? 4 : currentStep;
    }, [clickCount]);

    const handleClick = useCallback((type: 'store' | 'money') => {
        void type;
        if (clickCount >= maxClicks) return;
        // 10단계(최대)에 도달하기 전까지만 흡수 애니메이션 실행
        moneyInteractionRef.current?.spawnAbsorb();
        setClickCount((c) => Math.min(c + 1, maxClicks));
    }, [clickCount, maxClicks]);

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
                topEffect={<FloatingCoinsEffect floatingItems={floatingItems} maxCount={6} />}
                buildingImage={(
                    <div ref={buildingRef}>
                        <BuildingMotion
                            src={new URL(`../../assets/buildings/building-level-${finalStep + 1}.svg`, import.meta.url).href}
                            alt={`건물 레벨 ${finalStep + 1}`}
                            onClick={() => handleClick('store')}
                            pulseTrigger={clickCount}
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
                        ref={moneyInteractionRef}
                        onBaseIconClick={() => {
                            // 이미 10단계면 흡수시키지 않음 (클릭카운트 증가도 방지)
                            if (clickCount >= maxClicks) return;
                            handleClick('money');
                        }}
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

