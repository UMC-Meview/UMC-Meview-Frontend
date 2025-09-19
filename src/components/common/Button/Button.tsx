interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "compact";
    disabled?: boolean;
    className?: string;
}

/**
 * React.FC<ButtonProps> 대신 이 방식으로 변경한 이유:
 * 1. React.FC는 자동으로 children?을 추가하는데, 이미 ButtonProps에 children을 명시적으로 정의했으므로 중복 제거
 * 2. React.FC 제네릭 래퍼 제거로 더 직접적이고 읽기 쉬운 코드
 * 3. 2024~2025기준 React + TypeScript 커뮤니티와 현업에서 권장하는 방식
 * 4. React.FC와 런타임 동작은 동일함
 */
const Button = ({
    children,
    onClick,
    variant = "primary",
    disabled = false,
    className = "",
}: ButtonProps) => {
    const baseClasses = "w-full text-lg font-bold rounded-full transition-colors";
    const variantStyles = {
        primary: `${baseClasses} h-[65px] bg-[#FF774C] text-white`,
        secondary: `${baseClasses} h-[65px] bg-white border border-gray-300 text-black`,
        compact: `${baseClasses} h-12 bg-[#FF774C] px-15 py-0 whitespace-nowrap text-white`,
    };
    // variant는 색상,형태만, disabled는 상태를 나타내서 독립적인 prop으로 분리
    const disabledClasses = `${baseClasses} h-[65px] bg-[#D9D9D9] text-white cursor-not-allowed`;

    return (
        <button
            className={`${disabled ? disabledClasses : variantStyles[variant]} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
