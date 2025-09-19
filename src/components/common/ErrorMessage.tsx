import alertError from "../../assets/alert-error.svg";

interface ErrorMessageProps {
    message: string;
    className?: string;
    variant?: "default" | "compact";
}

const ErrorMessage = ({
    message,
    className = "",
    variant = "default",
}: ErrorMessageProps) => {
    const outerClassName =
        variant === "compact"
            ? `mb-4 ${className}`
            : `px-6 sm:px-8 md:px-10 lg:px-12 mb-4 ${className}`;

    if (variant === "compact") {
        return (
            <div className={outerClassName}>
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2">
                    <img src={alertError} alt="" className="w-4 h-4" aria-hidden="true" />
                    <p className="text-red-700 text-sm">{message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={outerClassName}>
            <div className="border border-red-500 rounded-lg p-3">
                <p className="text-red-500 text-sm text-center">{message}</p>
            </div>
        </div>
    );
};

export default ErrorMessage; 