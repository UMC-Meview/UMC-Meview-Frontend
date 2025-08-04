import { useState, useEffect } from 'react';

export const useKeyboardDetection = () => {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    useEffect(() => {
        const initialHeight = window.innerHeight;
        
        const handleResize = () => {
            const currentHeight = window.innerHeight;
            const heightDifference = initialHeight - currentHeight;
            const isKeyboard = heightDifference > 100; // 임계값을 낮춤
            setIsKeyboardVisible(isKeyboard);
        };

        // 더 빠른 반응을 위해 여러 이벤트 사용
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
        
        // visualViewport API 사용 (더 빠름)
        if (window.visualViewport) {
            const handleViewportChange = () => {
                const heightDifference = initialHeight - window.visualViewport!.height;
                const isKeyboard = heightDifference > 100;
                setIsKeyboardVisible(isKeyboard);
            };
            
            window.visualViewport.addEventListener('resize', handleViewportChange);
            return () => {
                window.removeEventListener('resize', handleResize);
                window.removeEventListener('orientationchange', handleResize);
                window.visualViewport?.removeEventListener('resize', handleViewportChange);
            };
        }
        
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, []);

    return isKeyboardVisible;
}; 