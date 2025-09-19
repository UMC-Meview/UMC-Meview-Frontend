interface BackButtonProps {
    onClick?: () => void;
}

const BackButton = ({
    onClick
}: BackButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="text-[#FF4444] hover:text-[#FF2222] transition-colors text-2xl pr-2 py-0"
        >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
};

export default BackButton;
