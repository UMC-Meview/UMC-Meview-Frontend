import React from "react";

interface ErrorMessageProps {
    message: string;
    className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    className = "",
}) => {
    return (
        <div className={`px-6 sm:px-8 md:px-10 lg:px-12 mb-4 ${className}`}>
            <div className="border border-red-500 rounded-lg p-3">
                <p className="text-red-500 text-sm text-center">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default ErrorMessage; 