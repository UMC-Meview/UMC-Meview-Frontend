import React from "react";
import Button from "../common/Button/Button";

interface QRScannerOverlayProps {
    isLoading: boolean;
    isScanning: boolean;
    scanFailed: boolean;
    hasError: boolean;
    errorMessage: string;
    onRetry: () => void;
    onBack: () => void;
}

const QRScannerOverlay: React.FC<QRScannerOverlayProps> = ({
    isLoading,
    isScanning,
    scanFailed,
    hasError,
    errorMessage,
    onRetry,
    onBack,
}) => {
    // 상태에 따른 텍스트 결정
    const getStatusText = () => {
        if (hasError) {
            return (
                errorMessage ||
                "카메라 권한을 허용하거나 다른 앱에서 카메라를 사용 중인지 확인해주세요"
            );
        }
        if (scanFailed) {
            return "QR인식을 실패했어요.";
        }
        return "QR을 가운데 화면에 맞춰주세요!";
    };

    // 하단 영역 렌더링 함수
    const renderBottomContent = () => {
        // 에러 또는 스캔 실패 시 버튼들 표시
        if (hasError || scanFailed) {
            return (
                <div className="px-6 space-y-3">
                    <Button
                        variant="primary"
                        onClick={onRetry}
                        className="w-full max-w-xs mx-auto"
                    >
                        재인식하기
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={onBack}
                        className="w-full max-w-xs mx-auto text-black"
                    >
                        뒤로 가기
                    </Button>
                </div>
            );
        }

        // 로딩 중이거나 스캔 중일 때 상태 표시
        if (isLoading) {
            return (
                <div className="text-white">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white mb-4"></div>
                    <p>카메라 준비 중...</p>
                </div>
            );
        }

        if (isScanning) {
            return (
                <div className="text-white">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white mb-4"></div>
                    <p>인식 중...</p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="absolute inset-0">
            {/* 상단 텍스트 영역 - 고정 */}
            <div className="absolute top-0 left-0 right-0 text-center pt-12 pb-8 z-20 bg-gradient-to-b from-black/70 to-transparent">
                <h2 className="text-xl font-bold text-white mb-2">QR 인식</h2>
                <p className="text-white text-sm">{getStatusText()}</p>
            </div>

            {/* 마스크 오버레이 - 고정 */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div
                    className="w-[300px] h-[300px]"
                    style={{
                        boxShadow: "0 0 0 1000px rgba(0, 0, 0, 0.9)",
                    }}
                />
            </div>

            {/* 스캔 가이드 프레임 - 고정 */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="relative w-[304px] h-[304px]">
                    <div className="w-full h-full border-2 border-white rounded-lg relative">
                    </div>
                </div>
            </div>

            {/* 하단 상태 표시 영역 - 상태에 따라 변동 */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/70 to-transparent pt-16 pb-8">
                <div className="text-center">{renderBottomContent()}</div>
            </div>
        </div>
    );
};

export default QRScannerOverlay;
