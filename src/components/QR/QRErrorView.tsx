import React from "react";
import Button from "../common/Button/Button";

interface QRErrorViewProps {
    errorMessage: string;
    onRetry: () => void;
    onBack: () => void;
}

const QRErrorView: React.FC<QRErrorViewProps> = ({
    errorMessage,
    onRetry,
    onBack,
}) => {
    return (
        <div className="min-h-screen bg-black relative">
            <div className="flex flex-col items-center justify-center h-screen text-white px-6">
                <h2 className="text-xl font-bold mb-4">
                    QR 인식
                </h2>
                <p className="text-sm text-gray-300 mb-8 text-center">
                    {errorMessage ||
                        "카메라 권한을 허용하거나 다른 앱에서 카메라를 사용 중인지 확인해주세요"}
                </p>
                <div className="space-y-3">
                    <Button
                        variant="primary"
                        onClick={onRetry}
                        className="w-full max-w-xs"
                    >
                        재인식하기
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={onBack}
                        className="w-full max-w-xs text-black"
                    >
                        뒤로 가기
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default QRErrorView;
