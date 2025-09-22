import alertError from "../../assets/alert-error.svg";

interface ErrorMessageProps {
    message: string;
    className?: string;
}

const ErrorMessage = ({
    message,
    className = "",
}: ErrorMessageProps) => {
    return (
        <div className={`mb-4 ${className}`}>
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2">
                <img src={alertError} alt="" className="w-4 h-4" aria-hidden="true" />
                <p className="text-red-700 text-sm">{message}</p>
            </div>
        </div>
    );
};

export default ErrorMessage; 