import React, { useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";

// 안전하게 React Ref에 값을 설정하는 유틸
function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
    if (!ref) return;
    if (typeof ref === "function") ref(value);
    else (ref as React.MutableRefObject<T | null>).current = value as unknown as T & (T extends null ? never : unknown);
}

interface BuildingMotionProps {
    src: string;
    alt: string;
    onClick: () => void;
    isShaking?: boolean;
    pulseTrigger?: number; 
    children?: React.ReactNode;
    scale?: number;
    onImageLoad?: () => void;
    containerRef?: React.Ref<HTMLDivElement | null>;
}

const BuildingMotion: React.FC<BuildingMotionProps> = ({
    src,
    alt,
    onClick,
    isShaking = false,
    pulseTrigger,
    children,
    onImageLoad,
    containerRef,
}) => {
    const controls = useAnimationControls();

    useEffect(() => {
        if (pulseTrigger !== undefined) {
            void controls.start({ scale: [1, 1.1, 1] }, { duration: 0.3 });
        }
    }, [pulseTrigger, controls]);

    return (
        <motion.div
            className="relative cursor-pointer"
            onClick={onClick}
            whileTap={{ scale: 0.95 }}
            animate={controls}
            transition={{ duration: 0.3 }}
            ref={(node: HTMLDivElement | null) => setRef<HTMLDivElement | null>(containerRef, node)}
        >
            <motion.img
                src={src}
                alt={alt}
                className="w-[220vw] max-w-[1100px] h-auto object-contain"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                    scale: 1, 
                    opacity: 1,
                    ...(isShaking && {
                        // 흔들기 애니메이션: x, y, rotate 값들을 순차적으로 적용
                        x: [-12, 12, -10, 10, -8, 8, -6, 6, -4, 4, -2, 2, -1, 1, 0],
                        y: [-8, 8, -6, 6, -4, 4, -3, 3, -2, 2, -1, 1, 0],
                        rotate: [-4, 4, -3, 3, -2, 2, -1, 1, 0]
                    })
                }}
                transition={{ 
                    duration: 0.8,
                    x: { duration: 0.8, ease: "easeOut" },
                    y: { duration: 0.8, ease: "easeOut" },
                    rotate: { duration: 0.8, ease: "easeOut" }
                }}
                onLoad={onImageLoad}
            />

            {/* 하단 화이트 그라데이션 오버레이 - 경계선 숨기기 */}
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

            {/* 추가 효과들을 위한 children (할퀴기, 먼지, 코인 등) */}
            {children}
        </motion.div>
    );
};

export default BuildingMotion; 