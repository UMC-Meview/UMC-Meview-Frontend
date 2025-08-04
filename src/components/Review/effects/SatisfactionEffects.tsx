import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingItem } from "../../../types/review";
import coinImage from "../../../assets/money/coin.svg";
import moneyImage from "../../../assets/money/money.svg";

// 부유하는 코인/지폐 효과 컴포넌트
interface FloatingCoinsEffectProps {
    floatingItems: FloatingItem[];
}

const FloatingCoinsEffect: React.FC<FloatingCoinsEffectProps> = ({ floatingItems }) => {
    return (
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
                        // 코인: 건물로 흡수되는 애니메이션
                        x: [item.x, item.x * 0.5, item.x * 0.2, 0],
                        y: [item.y, item.y - 100, item.y - 200, -150],
                        opacity: [1, 1, 1, 0],
                        scale: [0, 1, 1.2, 0.8]
                    } : {
                        // 지폐: 부유하는 애니메이션
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
    );
};

// 지폐 상호작용 컴포넌트
interface MoneyInteractionProps {
    showMoney: boolean;
    isMoneyAbsorbing: boolean;
    onMoneyClick: () => void;
    getRelativePosition: () => { x: number; y: number };
}

const MoneyInteraction: React.FC<MoneyInteractionProps> = ({
    showMoney,
    isMoneyAbsorbing,
    onMoneyClick,
    getRelativePosition
}) => {
    const moneyRef = useRef<HTMLDivElement>(null);

    return (
        <motion.div ref={moneyRef} className="relative mt-8">
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
                            y: 0
                        }}
                        animate={isMoneyAbsorbing ? {
                            // 지폐가 건물로 흡수되는 포물선 애니메이션
                            x: [0, getRelativePosition().x * 0.3, getRelativePosition().x * 0.7, getRelativePosition().x],
                            y: [0, getRelativePosition().y * 0.2 - 50, getRelativePosition().y * 0.6 - 20, getRelativePosition().y],
                            scale: [1, 0.8, 0.4, 0],
                            opacity: [1, 0.9, 0.5, 0],
                        } : {
                            // 새로운 지폐가 아래에서 올라오는 애니메이션
                            x: [0, 0],
                            y: [80, 0],
                            scale: [0.5, 1.1, 1],
                            opacity: [0, 1, 1]
                        }}
                        exit={{ 
                            scale: 0, 
                            opacity: 0, 
                            y: -20
                        }}
                        transition={isMoneyAbsorbing ? {
                            duration: 0.8,
                            ease: [0.25, 0.46, 0.45, 0.94],
                            times: [0, 0.3, 0.7, 1],
                        } : {
                            duration: 0.6,
                            ease: [0.34, 1.56, 0.64, 1],
                            times: [0, 0.7, 1]
                        }}
                        style={{ 
                            filter: "drop-shadow(0 0 16px rgba(255, 215, 0, 0.8))",
                            zIndex: isMoneyAbsorbing ? 30 : 'auto'
                        }}
                        onClick={onMoneyClick}
                        whileTap={!isMoneyAbsorbing ? { scale: 0.9 } : {}}
                        whileHover={!isMoneyAbsorbing ? { scale: 1.1 } : {}}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export { FloatingCoinsEffect, MoneyInteraction }; 