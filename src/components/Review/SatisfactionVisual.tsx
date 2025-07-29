import React, { useState, useCallback } from "react";
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

const SatisfactionVisual = ({
    clickCount,
    maxClicks,
    onStoreClick
}: SatisfactionVisualProps): SatisfactionVisualReturn => {
    const [floatingCoins, setFloatingCoins] = useState<Array<{id: number, x: number, y: number}>>([]);
    const [coinId, setCoinId] = useState(0);

    const currentStep = Math.min(Math.max(0, Math.floor((clickCount - 1) / 2)), 3);
    const finalStep = clickCount >= 9 ? 4 : currentStep;

    const handleStoreClick = useCallback(() => {
        if (clickCount >= maxClicks) return;

        const newCoin = {
            id: coinId,
            x: Math.random() * 200 - 100, // 건물 주변으로 범위 축소 (200px → 100px)
            y: Math.random() * 60 - 30,   // 건물 주변으로 범위 축소 (100px → 60px)
        };
        
        setFloatingCoins(prev => [...prev, newCoin]);
        setCoinId(prev => prev + 1);

        setTimeout(() => {
            setFloatingCoins(prev => prev.filter(coin => coin.id !== newCoin.id));
        }, 3000);

        onStoreClick();
    }, [clickCount, coinId, maxClicks, onStoreClick]);

    return {
        topEffect: (
            <AnimatePresence>
                {floatingCoins.map((coin) => (
                    <motion.div
                        key={coin.id}
                        className="absolute"
                        initial={{ x: coin.x, y: coin.y, opacity: 1, scale: 0 }}
                        animate={{ y: coin.y - 200, opacity: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3, ease: "easeOut" as const }}
                        style={{ zIndex: 10 }}
                    >
                        <img src={coinImage} alt="코인" className="w-27 h-27" />
                    </motion.div>
                ))}
            </AnimatePresence>
        ),
        buildingImage: (
            <motion.div
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
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                />

                <motion.div 
                    className="absolute -top-16 left-1/2 transform -translate-x-1/2"
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                >
                    <img src={coinImage} alt="코인" className="w-27 h-27 drop-shadow-lg" />
                </motion.div>
            </motion.div>
        ),
        bottomImage: (
            <motion.img
                src={moneyImage}
                alt="돈"
                className="w-25 h-25"
                key={clickCount}
                initial={{ scale: 1 }}
                animate={{ scale: clickCount > 0 ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" as const }}
                style={{ filter: "drop-shadow(0 0 16px rgba(255, 215, 0, 0.8))" }}
            />
        )
    };
};

export default SatisfactionVisual; 