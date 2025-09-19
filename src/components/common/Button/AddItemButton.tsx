interface AddItemButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const AddItemButton = ({
  onClick,
  children,
  className = ""
}: AddItemButtonProps) => {
  return (
    <button
      type="button"
      className={`text-black font-medium text-sm mx-auto block ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default AddItemButton; 