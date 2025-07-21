import React from "react";

interface AddItemButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: "full" | "center";
}

const AddItemButton: React.FC<AddItemButtonProps> = ({
  onClick,
  children,
  className = "",
  variant = "full"
}) => {
  const baseStyles = "text-black font-medium text-base";
  
  const variantStyles = {
    full: "mt-2 w-full bg-white rounded-lg py-3 hover:bg-gray-50",
    center: "mt-1 mx-auto block hover:text-gray-600"
  };

  return (
    <button
      type="button"
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default AddItemButton; 