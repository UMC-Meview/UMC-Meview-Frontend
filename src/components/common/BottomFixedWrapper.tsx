import React from 'react';

const BottomFixedWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`fixed bottom-8 left-0 right-0 px-6 w-full mx-auto z-10 ${className}`}>
    {children}
  </div>
);

export default BottomFixedWrapper; 