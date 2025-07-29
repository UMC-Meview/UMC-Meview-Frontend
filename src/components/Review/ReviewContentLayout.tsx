import React from "react";

interface ReviewContentLayoutProps {
    topEffect?: React.ReactNode;
    buildingImage: React.ReactNode;
    bottomImage?: React.ReactNode;
  }
  
  const ReviewContentLayout: React.FC<ReviewContentLayoutProps> = ({
    topEffect,
    buildingImage,
    bottomImage,
  }) => {
    return (
        <div className="relative flex flex-col h-full pt-35 pb-24 overflow-hidden">
        
        {/* 상단 */}
        {topEffect && (
            <div className="absolute top-16 left-0 right-0 z-10 flex justify-center pointer-events-none">
            {topEffect}
            </div>
        )}

        {/* 중앙+하단 */}
        <div className="flex-1 relative z-0 flex flex-col justify-center items-center">
            <div className="translate-y-[-80px]">{buildingImage}</div>
            {bottomImage && <div className="translate-y-[-80px]">{bottomImage}</div>}
        </div>
        
        </div>
    );
  };
  
  export default ReviewContentLayout;