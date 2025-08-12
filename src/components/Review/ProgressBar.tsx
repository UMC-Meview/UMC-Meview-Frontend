import React, { useState } from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
    clickCount: number;
    maxClicks: number;
    progressLabel?: string;
    showBonus?: boolean;
    showProgress?: boolean;
    onBonusUpdate?: (totalBonus: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    clickCount,
    maxClicks,
    progressLabel = "클릭완료",
    showBonus = true,
    showProgress = true,
    onBonusUpdate
}) => {
    const [totalBonus, setTotalBonus] = useState(0);

    // clickCount가 변경될 때마다 보너스 계산
    React.useEffect(() => {
        const bonusAmount = 10000;
        const newTotalBonus = clickCount * bonusAmount;
        setTotalBonus(newTotalBonus);
        
        if (onBonusUpdate) {
            onBonusUpdate(newTotalBonus);
        }
    }, [clickCount, onBonusUpdate]);

    return (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-6 pb-4 w-full max-w-[390px] z-10">
            <div className="text-center">
                {showBonus && (
                    <motion.div 
                        className="text-2xl font-bold text-orange-500 mb-2"
                        animate={clickCount > 0 ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {totalBonus.toLocaleString()}원
                    </motion.div>
                )}
                {showProgress && (
                    <div className="text-sm text-gray-600 mb-2">
                        {clickCount}/{maxClicks} {progressLabel}
                    </div>
                )}
                <div className="flex justify-center">
                    <div className="bg-gray-200 rounded-full h-2.5" style={{ width: 'calc(100% - 48px)' }}>
                        <motion.div 
                            className="h-2.5 rounded-full"
                            style={{
                                background: 'linear-gradient(to right, #FFD700, #FF6B35)',
                                width: `${(clickCount / maxClicks) * 100}%`
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(clickCount / maxClicks) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar; 