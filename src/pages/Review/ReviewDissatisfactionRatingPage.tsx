import React, { useState, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/common/Header";
import ProgressBar from "../../components/Review/ProgressBar";
import ReviewContentLayout from "../../components/Review/ReviewContentLayout";
import BottomFixedWrapper from "../../components/common/BottomFixedWrapper";
import Button from "../../components/common/Button/Button";
import BuildingMotion from "../../components/Review/effects/BuildingMotion";
import { DustEffect, CatPawInteraction, ScratchEffect } from "../../components/Review/effects/DissatisfactionEffects";
import { useGetStoreDetail } from "../../hooks/queries/useGetStoreDetail";


const ReviewDissatisfactionRatingPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // URL에서 storeId 파라미터 추출
    const storeId = searchParams.get("storeId");
    
    // 가게 정보 가져오기
    const { store } = useGetStoreDetail(storeId || "");
    const storeName = store?.name || "가게";
    
    const [clickCount, setClickCount] = useState(0);

    const maxClicks = 10;

    const [isShaking, setIsShaking] = useState(false);
    const [showScratch, setShowScratch] = useState(false);
    const [scratchIndexes, setScratchIndexes] = useState([0, 0]);
    const [showDust, setShowDust] = useState(false);
    const [dustParticles, setDustParticles] = useState<Array<{id: number, x: number, y: number, index: number}>>([]);
    
    const animationRef = useRef<number | null>(null);
    // 건물 단계: 클릭 횟수에 따라 9단계에서 0단계로 감소 (무너지는 효과)
    const currentStep = clickCount <= 1 ? 9 : Math.max(0, 9 - (clickCount - 1));

    const handleClick = useCallback((type: 'store' | 'catPaw') => {
        if (clickCount >= maxClicks) return;

        if (animationRef.current) clearTimeout(animationRef.current);

        if (type === 'store') {
            // 건물 흔들기 효과
            setIsShaking(true);
            animationRef.current = window.setTimeout(() => setIsShaking(false), 800);

            // 먼지 효과 생성
            setShowDust(false);
            requestAnimationFrame(() => {
                setShowDust(true);
                setDustParticles(Array.from({ length: 8 }, (_, i) => ({
                    id: Date.now() + i,
                    x: (Math.random() - 0.5) * 600,
                    y: (Math.random() - 0.5) * 250,
                    index: Math.floor(Math.random() * 9)
                })));
                animationRef.current = window.setTimeout(() => setShowDust(false), 2000);
            });
        } else {
            // 할퀴기 효과 생성
            setShowScratch(false);
            requestAnimationFrame(() => {
                setScratchIndexes([
                    Math.floor(Math.random() * 9),
                    Math.floor(Math.random() * 9)
                ]);
                setShowScratch(true);
                animationRef.current = window.setTimeout(() => setShowScratch(false), 800);
            });
        }

        setClickCount(clickCount + 1);
    }, [clickCount, maxClicks]);

    const handleNext = () => {
        // 불만족 리뷰 데이터와 함께 다음 페이지로 이동
        navigate("/review/detail", {
            state: {
                storeId: storeId || "temp-store-id",
                storeName: storeName,
                isPositive: false,
                score: Math.max(1, Math.min(10, 11 - clickCount)), // 클릭 횟수가 많을수록 낮은 점수 (1~10)
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
                topEffect={<div className="h-0" />}
                buildingImage={(
                    <BuildingMotion
                        src={new URL(`../../assets/buildings/building-broken-${currentStep + 1}.svg`, import.meta.url).href}
                        alt={`무너지는 건물 ${currentStep + 1}단계`}
                        onClick={() => handleClick('store')}
                        isShaking={isShaking}
                        scale={clickCount > 0 ? 1.1 : 1}
                    >
                        <ScratchEffect
                            showScratch={showScratch}
                            scratchIndexes={scratchIndexes}
                            clickCount={clickCount}
                        />
                        <DustEffect
                            showDust={showDust}
                            dustParticles={dustParticles}
                        />
                    </BuildingMotion>
                )}
                bottomImage={(
                    <CatPawInteraction
                        clickCount={clickCount}
                        onCatPawClick={() => handleClick('catPaw')}
                    />
                )}
            />
            
            <ProgressBar
                clickCount={clickCount}
                maxClicks={maxClicks}
                progressLabel="할퀴기 완료"
                showBonus={false}
                showProgress={true}
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

export default ReviewDissatisfactionRatingPage;

