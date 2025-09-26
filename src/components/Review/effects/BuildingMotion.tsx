import React, { useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";


interface BuildingMotionProps {
    src: string;
    alt: string;
    onClick: () => void;
    isShaking?: boolean;
    pulseTrigger?: number; 
    children?: React.ReactNode;
    onImageLoad?: () => void;
    containerRef?: React.Ref<HTMLDivElement | null>;
}

const BuildingMotion = ({
    src,
    alt,
    onClick,
    isShaking = false,
    pulseTrigger,
    children,
    onImageLoad,
    containerRef,
}: BuildingMotionProps) => {
    const controls = useAnimationControls(); //Framer Motion에서 제공하는 애니메이션 controls 관리 훅

    useEffect(() => {
        if (pulseTrigger !== undefined) {
            void controls.start({ scale: [1, 1.1, 1] }, { duration: 0.3 }); //1:시작(100%), 1.1:중간(110%), 1:끝(100%)
        }
    }, [pulseTrigger, controls]);

    return (
        <motion.div
            className="relative cursor-pointer"
            onClick={onClick}
            whileTap={{ scale: 0.95 }} //클릭하는 동안 95% 축소
            animate={controls} //애니메이션이 이 div에 적용됨
            transition={{ duration: 0.3 }}
            ref={containerRef}
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