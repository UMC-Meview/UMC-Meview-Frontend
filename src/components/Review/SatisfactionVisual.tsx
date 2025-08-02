import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import coinImage from "../../assets/money/coin.svg";
import moneyImage from "../../assets/money/money.svg";

const getBuildingImage = (index: number) => {
    return new URL(`../../assets/buildings/building-level-${index + 1}.svg`, import.meta.url).href;
};

interface SatisfactionVisualProps {
    clickCount: number;
    maxClicks: number;
    onStoreClick: () => void;
}

interface SatisfactionVisualReturn {
    topEffect: React.ReactNode;
    buildingImage: React.ReactNode;
    bottomImage: React.ReactNode;
}

interface FloatingItem {
    id: number;
    x: number;
    y: number;
    type: 'coin' | 'money';
    targetX?: number;
    targetY?: number;
    collected?: boolean;
}

const SatisfactionVisual = ({
    clickCount,
    maxClicks,
    onStoreClick
}: SatisfactionVisualProps): SatisfactionVisualReturn => {
    const [floatingItems, setFloatingItems] = useState<Array<FloatingItem>>([]);
    const [itemId, setItemId] = useState(0);

    const [isMoneyAbsorbing, setIsMoneyAbsorbing] = useState(false);
    const [showMoney, setShowMoney] = useState(true);
    const buildingRef = useRef<HTMLDivElement>(null);
    const moneyRef = useRef<HTMLDivElement>(null);

    const currentStep = Math.min(Math.max(0, Math.floor((clickCount - 1) / 2)), 3);
    const finalStep = clickCount >= 9 ? 4 : currentStep;

    const handleStoreClick = useCallback(() => {
        if (clickCount >= maxClicks) return;

        const newCoin: FloatingItem = {
            id: itemId,
            x: Math.random() * 200 - 100,
            y: Math.random() * 60 + 50,
            type: 'coin'
        };
        
        setFloatingItems(prev => [...prev, newCoin]);
        setItemId(prev => prev + 1);

        setTimeout(() => {
            setFloatingItems(prev => prev.filter(item => item.id !== newCoin.id));
        }, 3000);

        onStoreClick();
    }, [clickCount, itemId, maxClicks, onStoreClick]);

    const handleMoneyClick = useCallback(() => {
        if (clickCount >= maxClicks || isMoneyAbsorbing) return;

        // 지폐 흡수 애니메이션 시작
        setIsMoneyAbsorbing(true);

        // 흡수 완료 후 지폐 숨기기 -> 새로운 지폐 생성
        setTimeout(() => {
            setShowMoney(false);
            
            // 짧은 딜레이 후 새로운 지폐 생성
            setTimeout(() => {
                setShowMoney(true);
                setIsMoneyAbsorbing(false);
                // 지폐 흡수가 완전히 끝난 후 게임 상태 업데이트
                onStoreClick();
            }, 200);
        }, 800);

    }, [clickCount, maxClicks, onStoreClick, isMoneyAbsorbing]);

    // 건물과 지폐의 상대적 위치 계산
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

    return {
        topEffect: (
            <AnimatePresence>
                {floatingItems.map((item) => (
                    <motion.div
                        key={item.id}
                        className="absolute z-20"
                        initial={{ 
                            x: item.x, 
                            y: item.y, 
                            opacity: 1, 
                            scale: item.type === 'money' ? 1 : 0,
                            rotate: 0
                        }}
                        animate={item.type === 'coin' ? {
                            // 기존 코인 애니메이션 (건물 클릭시)
                            x: [item.x, item.x * 0.5, item.x * 0.2, 0],
                            y: [item.y, item.y - 100, item.y - 200, -150],
                            opacity: [1, 1, 1, 0],
                            scale: [0, 1, 1.2, 0.8]
                        } : {
                            // 평상시 부유 애니메이션
                            y: [item.y - 10, item.y + 10, item.y - 10],
                            rotate: [0, 10, -10, 0]
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={item.type === 'coin' ? {
                            duration: 2.5,
                            ease: [0.25, 0.46, 0.45, 0.94],
                            times: [0, 0.3, 0.7, 1]
                        } : {
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{ zIndex: 10 }}
                    >
                        <img 
                            src={item.type === 'money' ? moneyImage : coinImage} 
                            alt={item.type === 'money' ? "지폐" : "코인"} 
                            className="w-27 h-27" 
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        ),
        buildingImage: (
            <motion.div
                ref={buildingRef}
                className="relative cursor-pointer"
                onClick={handleStoreClick}
                whileTap={{ scale: 0.95 }}
                animate={{ scale: clickCount > 0 ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.3 }}
            >
                <motion.img
                    src={getBuildingImage(finalStep)}
                    alt={`건물 레벨 ${finalStep + 1}`}
                    className="w-[220vw] max-w-[1100px] h-auto object-contain"
                    key={finalStep} // 레벨 변경시 새로운 컴포넌트로 인식
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                />

                {/* 화이트 그라데이션 오버레이 - 경계선 숨기기 */}
                <div 
                    className="absolute bottom-0 left-0 right-0 pointer-events-none"
                    style={{
                        height: '40px',
                        background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.6) 60%, rgba(255, 255, 255, 0.9) 100%)',
                        zIndex: 1
                    }}
                />
                
                {/* 좌우 화이트 그라데이션 오버레이 - 측면 경계선 숨기기 */}
                <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `
                            linear-gradient(to right, rgba(255, 255, 255, 0.3) 0%, transparent 8%, transparent 92%, rgba(255, 255, 255, 0.3) 100%),
                            linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.4) 70%, rgba(255, 255, 255, 0.8) 100%)
                        `,
                        zIndex: 1
                    }}
                />

                <motion.div 
                    className="absolute -top-6 left-1/2 transform -translate-x-1/2"
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                >
                    <img src={coinImage} alt="코인" className="w-27 h-27 drop-shadow-lg" />
                </motion.div>
            </motion.div>
        ),
        bottomImage: (
            <motion.div
                ref={moneyRef}
                className="relative mt-8"
            >
                <AnimatePresence mode="wait">
                    {showMoney && (
                        <motion.img
                            src={moneyImage}
                            alt="돈"
                            className="w-25 h-25 cursor-pointer"
                            initial={{ 
                                scale: 0.5, 
                                opacity: 0, 
                                x: 0, 
                                y: 0  // 아래쪽에서 시작
                            }}
                            animate={isMoneyAbsorbing ? {
                                // 지폐가 포물선을 그리며 건물로 흡수되는 애니메이션
                                x: [0, getRelativePosition().x * 0.3, getRelativePosition().x * 0.7, getRelativePosition().x],
                                y: [0, getRelativePosition().y * 0.2 - 50, getRelativePosition().y * 0.6 - 20, getRelativePosition().y],
                                scale: [1, 0.8, 0.4, 0],
                                opacity: [1, 0.9, 0.5, 0],
                            } : {
                                // 새로운 지폐가 아래에서 올라오며 제자리로 이동
                                x: [0, 0],
                                y: [80, 0],  // 아래에서 제자리로
                                scale: [0.5, 1.1, 1],
                                opacity: [0, 1, 1]
                            }}
                            exit={{ 
                                scale: 0, 
                                opacity: 0, 
                                y: -20  // 위쪽으로 사라짐
                            }}
                            transition={isMoneyAbsorbing ? {
                                // 흡수 애니메이션
                                duration: 0.8,
                                ease: [0.25, 0.46, 0.45, 0.94],
                                times: [0, 0.3, 0.7, 1],
                            } : {
                                // 생성 애니메이션 - 아래에서 올라오는 자연스러운 움직임
                                duration: 0.6,
                                ease: [0.34, 1.56, 0.64, 1], // 더 부드러운 바운스
                                times: [0, 0.7, 1]
                            }}
                            style={{ 
                                filter: "drop-shadow(0 0 16px rgba(255, 215, 0, 0.8))",
                                zIndex: isMoneyAbsorbing ? 30 : 'auto'
                            }}
                            onClick={handleMoneyClick}
                            whileTap={!isMoneyAbsorbing ? { scale: 0.9 } : {}}
                            whileHover={!isMoneyAbsorbing ? { scale: 1.1 } : {}}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        )
    };
};

export default SatisfactionVisual;