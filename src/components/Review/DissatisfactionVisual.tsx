import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import catPaw1 from "../../assets/cat-paw/cat-paw-1.svg";
import catPaw2 from "../../assets/cat-paw/cat-paw-2.svg";

const getImageUrl = (folder: string, index: number, prefix?: string) => {
    const fileName = prefix ? `${prefix}-${index + 1}` : `${folder}-${index + 1}`;
    return new URL(`../../assets/${folder}/${fileName}.svg`, import.meta.url).href;
};

const getScratchImage = (index: number) => getImageUrl('scratch', index);
const getDustImage = (index: number) => getImageUrl('dust', index);
const getBuildingImage = (index: number) => getImageUrl('buildings', index, 'building-broken');
const getCatPawImage = (clickCount: number) => clickCount === 0 ? catPaw1 : catPaw2;

interface DissatisfactionVisualProps {
    clickCount: number;
    maxClicks: number;
    onStoreClick: () => void;
}

interface DissatisfactionVisualReturn {
    topEffect: React.ReactNode;
    buildingImage: React.ReactNode;
    bottomImage: React.ReactNode;
}

const DissatisfactionVisual = ({
    clickCount,
    maxClicks,
    onStoreClick
}: DissatisfactionVisualProps): DissatisfactionVisualReturn => {
    const [isShaking, setIsShaking] = useState(false);
    const [showScratch, setShowScratch] = useState(false);
    const [scratchIndexes, setScratchIndexes] = useState([0, 0]);
    const [showDust, setShowDust] = useState(false);
    const [dustParticles, setDustParticles] = useState<Array<{id: number, x: number, y: number, index: number}>>([]);
    
    const animationRef = useRef<number | null>(null);
    const currentStep = clickCount <= 1 ? 9 : Math.max(0, 9 - (clickCount - 1));

    const handleStoreClick = useCallback(() => {
        if (clickCount >= maxClicks) return;

        if (animationRef.current) clearTimeout(animationRef.current);

        // 건물 흔들기
        setIsShaking(true);
        animationRef.current = window.setTimeout(() => setIsShaking(false), 800);

        // 먼지 효과
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

        onStoreClick();
    }, [clickCount, maxClicks, onStoreClick]);

    const handleCatPawClick = useCallback(() => {
        if (clickCount >= maxClicks) return;

        if (animationRef.current) clearTimeout(animationRef.current);

        // 할퀴기 효과
        setShowScratch(false);
        requestAnimationFrame(() => {
            setScratchIndexes([
                Math.floor(Math.random() * 9),
                Math.floor(Math.random() * 9)
            ]);
            setShowScratch(true);
            animationRef.current = window.setTimeout(() => setShowScratch(false), 800);
        });

        onStoreClick();
    }, [clickCount, maxClicks, onStoreClick]);

    return {
        topEffect: (
            <div className="h-0" />
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
                    src={getBuildingImage(currentStep)}
                    alt={`무너지는 건물 ${currentStep + 1}단계`}
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
                
                {/* 할퀴기 효과 */}
                {showScratch && scratchIndexes.map((index) => (
                    <motion.div
                        key={`scratch-${clickCount}-${index}`}
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0, scale: 0.3, x: 40, y: -40 }}
                        animate={{ 
                            opacity: [0, 1, 0],
                            scale: [0.3, 0.6, 0.8],
                            x: [40, -40],
                            y: [-40, 40]
                        }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        style={{
                            backgroundImage: `url(${getScratchImage(index)})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            filter: 'drop-shadow(0 0 8px rgba(255, 0, 0, 0.6))'
                        }}
                    />
                ))}

                {/* 먼지 효과 */}
                {showDust && dustParticles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="absolute pointer-events-none"
                        style={{
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 10
                        }}
                        initial={{ opacity: 0, scale: 0.5, x: particle.x, y: particle.y }}
                        animate={{ 
                            opacity: [0, 1, 0.8, 0.4, 0],
                            scale: [0.5, 1.2, 1.0, 0.8, 0.6],
                            x: particle.x + (Math.random() * 300 - 150),
                            y: particle.y - 150 - (Math.random() * 100),
                            rotate: [0, 360]
                        }}
                        transition={{ duration: 2.0, ease: "easeOut" }}
                    >
                        <img
                            src={getDustImage(particle.index)}
                            alt="먼지"
                            className="w-8 h-8 opacity-70"
                            style={{ filter: 'drop-shadow(0 0 4px rgba(139, 69, 19, 0.6))' }}
                        />
                    </motion.div>
                ))}
            </motion.div>
        ),
        bottomImage: (
            <motion.div
                className="relative mt-8"
            >
                <motion.img
                    src={getCatPawImage(clickCount)}
                    alt="할퀴기"
                    className="w-25 h-25 cursor-pointer"
                    onClick={handleCatPawClick}
                    animate={{ 
                        rotate: [0, 12, -12, 0],
                        y: [0, -6, 0]
                    }}
                    transition={{ 
                        rotate: { duration: 1.5, repeat: Infinity, repeatType: "reverse" },
                        y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                    }}
                    whileHover={{ scale: 1.3, rotate: 20 }}
                    whileTap={{ scale: 0.8 }}
                    style={{ filter: "drop-shadow(0 0 12px rgba(255, 0, 0, 0.4))" }}
                />
            </motion.div>
        )
    };
};

export default DissatisfactionVisual; 