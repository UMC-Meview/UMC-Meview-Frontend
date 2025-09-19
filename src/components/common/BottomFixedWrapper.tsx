interface BottomFixedWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const BottomFixedWrapper = ({
  children,
  className = ""
}: BottomFixedWrapperProps) => (
  <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 w-full max-w-[390px] z-10 ${className}`}>
    {children}
  </div>
);

export default BottomFixedWrapper; 