import React from "react";

interface FixedFrameLayoutProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
  /**
   * 콘텐츠 스크롤 영역 높이 계산 시 제외할 픽셀 값
   * 기본 180px (헤더 + 하단 고정 영역 높이 합산 대비치)
   */
  contentHeightOffset?: number;
  /**
   * 스크롤 가능한 영역 여부. true면 overflow-y-auto 컨테이너 제공
   */
  scrollable?: boolean;
}

const FixedFrameLayout: React.FC<FixedFrameLayoutProps> = ({
  header,
  children,
  contentClassName = "",
  contentHeightOffset = 180,
  scrollable = true,
}) => {
  return (
    <div className="bg-white mx-auto max-w-[390px]">
      {header && <div className="sticky top-0 z-30 bg-white">{header}</div>}

      {scrollable ? (
        <div
          className={contentClassName}
          style={{
            height: `calc(100dvh - ${contentHeightOffset}px)`,
            maxHeight: `calc(100dvh - ${contentHeightOffset}px)`,
            overflowY: "auto",
          }}
        >
          {children}
        </div>
      ) : (
        <div className={`min-h-[100dvh] ${contentClassName}`}>{children}</div>
      )}
    </div>
  );
};

export default FixedFrameLayout;


