import React from "react";
import { useQRScanner } from "../../hooks/useQRScanner";
import QRScannerOverlay from "../../components/QR/QRScannerOverlay";

const QRScanPage: React.FC = () => {
    const { videoRef, state, handleRetry, handleBack } = useQRScanner();

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* 전체 화면 카메라 */}
            <div className="absolute inset-0 top-[64px]">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                />

                {/* 오버레이 컴포넌트 - 모든 상태 처리 */}
                <QRScannerOverlay
                    isLoading={state.isLoading}
                    isScanning={state.isScanning}
                    scanFailed={state.scanFailed}
                    hasError={state.hasError}
                    errorMessage={state.errorMessage}
                    onRetry={handleRetry}
                    onBack={handleBack}
                />
            </div>
        </div>
    );
};

export default QRScanPage;
