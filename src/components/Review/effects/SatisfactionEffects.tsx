import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingItem } from "../../../types/review";
import moneyImage from "../../../assets/money/money.svg";

// 부유하는 코인/지폐 효과 컴포넌트
interface FloatingCoinsEffectProps {
    floatingItems: FloatingItem[];
    maxCount?: number;
}

const FloatingCoinsEffect = ({
    floatingItems,
    maxCount = 6
}: FloatingCoinsEffectProps) => {
    const limitedItems = useMemo(() => floatingItems.slice(0, maxCount), [floatingItems, maxCount]);

    return (
        <div className="pointer-events-none" style={{ willChange: "transform" }}>
            <AnimatePresence>
                {limitedItems.map((item) => (
                    <motion.div
                        key={item.id}
                        className="absolute z-20"
                        initial={{
                            x: item.x,
                            y: item.y,
                            opacity: 1,
                            scale: 1,
                            rotate: 0,
                        }}
                        animate={{
                            y: [item.y - 12, item.y + 12, item.y - 12],
                            rotate: [0, 10, -10, 0],
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        style={{ zIndex: 10, willChange: "transform" }}
                    >
                        <img src={moneyImage} alt="지폐" className="w-27 h-27" />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export interface MoneyInteractionHandle {
    spawnAbsorb: () => void;
}

interface MoneyInteractionProps {
    onBaseIconClick?: () => void;
    getRelativePosition: () => { x: number; y: number };
    imgRef?: React.Ref<HTMLImageElement>;
}

// 기본 아이콘은 고정 렌더, 흡수 애니메이션은 인스턴스 배열로 동시 실행
const MoneyInteraction = forwardRef<MoneyInteractionHandle, MoneyInteractionProps>(
    ({ onBaseIconClick, getRelativePosition, imgRef }, ref) => {
        type Instance = { id: number; dx: number; dy: number; sx: number; sy: number };
        const [instances, setInstances] = useState<Instance[]>([]);
        const idRef = useRef(0);
        const containerRef = useRef<HTMLDivElement>(null);

        const spawnAbsorb = useCallback(() => {
            // 클릭 시 1회만 레이아웃 계산 
            const { x, y } = getRelativePosition();
            let sx = 0;
            let sy = 0;
            const moneyEl = (imgRef as React.RefObject<HTMLImageElement> | undefined)?.current ?? null;
            const containerEl = containerRef.current;
            if (moneyEl && containerEl) {
                const moneyRect = moneyEl.getBoundingClientRect();
                const containerRect = containerEl.getBoundingClientRect();
                sx = moneyRect.left - containerRect.left;
                sy = moneyRect.top - containerRect.top;
            }
            const newInstance: Instance = { id: ++idRef.current, dx: x, dy: y, sx, sy };
            setInstances((prev) => [...prev, newInstance]);
        }, [getRelativePosition, imgRef]);

        useImperativeHandle(ref, () => ({ spawnAbsorb }), [spawnAbsorb]);

        const handleBaseClick = () => {
            // 베이스 아이콘 클릭 시 흡수 여부는 부모가 결정하여 필요 시 ref.spawnAbsorb() 호출
            onBaseIconClick?.();
        };

        const handleComplete = (id: number) => {
            setInstances((prev) => prev.filter((inst) => inst.id !== id));
        };

        return (
            <div className="relative mt-8" ref={containerRef}>
                    {/* 고정 아이콘 */}
                    <motion.img
                        src={moneyImage}
                        alt="돈"
                        className="w-25 h-25 cursor-pointer"
                        ref={imgRef}
                        initial={{ opacity: 1, scale: 1 }}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={handleBaseClick}
                        style={{ zIndex: 10 }}
                    />

                    {/* 흡수 애니메이션 인스턴스 (히트 테스트 방지) */}
                    {instances.map((inst) => (
                        <motion.img
                            key={inst.id}
                            src={moneyImage}
                            alt="흡수 지폐"
                            className="absolute top-0 left-0 pointer-events-none"
                            initial={{ x: inst.sx, y: inst.sy, opacity: 1, scale: 1 }}
                            animate={{
                                x: [inst.sx, inst.sx + inst.dx * 0.3, inst.sx + inst.dx * 0.7, inst.sx + inst.dx],
                                y: [inst.sy, inst.sy + inst.dy * 0.2 - 50, inst.sy + inst.dy * 0.6 - 20, inst.sy + inst.dy],
                                scale: [1, 0.8, 0.4, 0],
                                opacity: [1, 0.9, 0.5, 0],
                            }}
                            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], times: [0, 0.3, 0.7, 1] }}
                            onAnimationComplete={() => handleComplete(inst.id)}
                            style={{ willChange: "transform", zIndex: 30 }}
                        />
                    ))}
                </div>
        );
    }
);

export { FloatingCoinsEffect, MoneyInteraction };