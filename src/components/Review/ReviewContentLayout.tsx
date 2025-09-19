import React, { useEffect, useRef, useState, useCallback } from "react";

interface ReviewContentLayoutProps {
    topEffect?: React.ReactNode;
    buildingImage: React.ReactNode;
    bottomImage?: React.ReactNode;
  }
  
  const ReviewContentLayout = ({
    topEffect,
    buildingImage,
    bottomImage,
  }: ReviewContentLayoutProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [offsetY, setOffsetY] = useState(0);


    const measure = useCallback(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        if (!container || !content) return;
        const available = container.clientHeight;
        const needed = content.offsetHeight;
        if (needed === 0) return;
        const ratio = available / needed;
        const nextScale = ratio < 1 ? ratio : 1;
        setScale(nextScale);

        const leftover = Math.max(0, available - needed * nextScale);
        setOffsetY(Math.round(leftover * 0.55));
    }, []);

    useEffect(() => {
        measure();
        const id = window.setTimeout(measure, 0);
        
        window.addEventListener("resize", measure);
        window.addEventListener("orientationchange", measure as EventListener);
        return () => {
            window.clearTimeout(id);
            window.removeEventListener("resize", measure);
            window.removeEventListener("orientationchange", measure as EventListener);
        };
    }, [measure]);

    return (
        <div ref={containerRef} className="relative flex flex-col h-full pt-35 pb-24 overflow-hidden">
        
        {/* 상단 */}
        {topEffect && (
            <div className="absolute top-16 left-0 right-0 z-10 flex justify-center pointer-events-none">
            {topEffect}
            </div>
        )}

        {/* 중앙+하단 */}
        <div className="flex-1 relative z-0 flex flex-col items-center">
            <div style={{ transform: `translateY(${offsetY}px) scale(${scale})`, transformOrigin: "top center" }}>
                <div ref={contentRef} className="flex flex-col justify-center items-center">
                    <div className="translate-y-[-120px]">
                        {React.isValidElement(buildingImage) 
                            ? React.cloneElement(buildingImage as React.ReactElement<{ onImageLoad?: () => void }>, { onImageLoad: measure })
                            : buildingImage
                        }
                    </div>
                    {bottomImage && <div className="translate-y-[-240px]">{bottomImage}</div>}
                </div>
            </div>
        </div>
        
        </div>
    );
  };
  
  export default ReviewContentLayout;