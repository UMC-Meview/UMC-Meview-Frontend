interface BottomFixedWrapperProps {
  children: React.ReactNode;
  className?: string;
  withBackground?: boolean; // 배경과 구분선 표시 여부
}

const BottomFixedWrapper = ({
  children,
  className = "",
  withBackground = false
}: BottomFixedWrapperProps) => {
  const backgroundClasses = withBackground 
    ? "border-t border-gray-300" 
    : "";
  
  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 w-full max-w-[390px] z-10 ${backgroundClasses} ${className}`}>
      {children}
    </div>
  );
};

export default BottomFixedWrapper; 