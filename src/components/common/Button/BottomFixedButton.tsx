import Button from "./Button";
import { ComponentProps } from "react";

// Button 컴포넌트의 모든 props 타입을 추출하여 재사용
type ButtonProps = ComponentProps<typeof Button>;

// Button의 모든 props에서 className만 제외 (wrapper div용 className을 별도로 정의했기 때문)
interface BottomFixedButtonProps extends Omit<ButtonProps, 'className'> {
    className?: string;
}

const BottomFixedButton = ({
    className = "",
    ...buttonProps
}: BottomFixedButtonProps) => {
    return (
        <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 pt-[13px] pb-[20px] px-6 z-10 bg-white border-t border-gray-300 w-full max-w-[390px] ${className}`}>
            <Button {...buttonProps} />
        </div>
    );
};

export default BottomFixedButton; 