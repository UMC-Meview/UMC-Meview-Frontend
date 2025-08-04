import React from "react";
import { motion } from "framer-motion";
import { DustParticle } from "../../../types/review";
import catPaw1 from "../../../assets/cat-paw/cat-paw-1.svg";
import catPaw2 from "../../../assets/cat-paw/cat-paw-2.svg";

// 이미지 URL 생성 함수들
const getImageUrl = (folder: string, index: number, prefix?: string) => {
    const fileName = prefix ? `${prefix}-${index + 1}` : `${folder}-${index + 1}`;
    return new URL(`../../../assets/${folder}/${fileName}.svg`, import.meta.url).href;
};

const getDustImage = (index: number) => getImageUrl('dust', index);
const getScratchImage = (index: number) => getImageUrl('scratch', index);
const getCatPawImage = (clickCount: number) => clickCount === 0 ? catPaw1 : catPaw2;

// 먼지 효과 컴포넌트
interface DustEffectProps {
    showDust: boolean;
    dustParticles: DustParticle[];
}

const DustEffect: React.FC<DustEffectProps> = ({ showDust, dustParticles }) => {
    if (!showDust) return null;

    return (
        <>
            {dustParticles.map((particle) => (
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
        </>
    );
};

// 고양이 발톱 상호작용 컴포넌트
interface CatPawInteractionProps {
    clickCount: number;
    onCatPawClick: () => void;
}

const CatPawInteraction: React.FC<CatPawInteractionProps> = ({
    clickCount,
    onCatPawClick
}) => {
    return (
        <motion.div className="relative mt-8">
            <motion.img
                src={getCatPawImage(clickCount)}
                alt="할퀴기"
                className="w-25 h-25 cursor-pointer"
                onClick={onCatPawClick}
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
    );
};

// 할퀴기 효과 컴포넌트
interface ScratchEffectProps {
    showScratch: boolean;
    scratchIndexes: number[];
    clickCount: number;
}

const ScratchEffect: React.FC<ScratchEffectProps> = ({
    showScratch,
    scratchIndexes,
    clickCount
}) => {
    if (!showScratch) return null;

    return (
        <>
            {scratchIndexes.map((index) => (
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
        </>
    );
};

export { DustEffect, CatPawInteraction, ScratchEffect }; 