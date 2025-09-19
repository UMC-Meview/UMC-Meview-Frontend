import Button from "./Button";
import { ComponentProps } from "react";

type ButtonProps = ComponentProps<typeof Button>;

interface BottomFixedButtonProps extends Omit<ButtonProps, 'className'> {
    className?: string; // wrapper div용 className
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