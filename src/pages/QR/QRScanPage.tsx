import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import QrScanner from "qr-scanner";
import Button from "../../components/common/Button/Button";

interface QRScanPageProps {}

const QRScanPage: React.FC<QRScanPageProps> = () => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const qrScannerRef = useRef<QrScanner | null>(null);
    const isMountedRef = useRef(true);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanFailed, setScanFailed] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // 안전한 상태 업데이트 함수
    const safeSetState = useCallback((updater: () => void) => {
        if (isMountedRef.current) {
            updater();
        }
    }, []);

    // QR 스캐너 정리 함수
    const cleanupScanner = useCallback(() => {
        if (qrScannerRef.current) {
            try {
                qrScannerRef.current.stop();
                qrScannerRef.current.destroy();
            } catch (error) {
                console.warn("Scanner cleanup error:", error);
            } finally {
                qrScannerRef.current = null;
            }
        }
    }, []);

    // QR 코드 스캔 결과 처리
    const handleScanResult = useCallback(
        (data: string) => {
            safeSetState(() => {
                setIsScanning(false);
            });

            cleanupScanner();

            try {
                const url = new URL(data);

                if (url.pathname.includes("/store/")) {
                    const storeId = url.pathname.split("/store/")[1];
                    navigate(`/store/${storeId}`);
                } else {
                    window.open(data, "_blank");
                    navigate(-1);
                }
            } catch {
                alert(`QR 코드 내용: ${data}`);
                navigate(-1);
            }
        },
        [navigate, cleanupScanner, safeSetState]
    );

    // QR 스캐너 초기화
    const initializeQRScanner = useCallback(async () => {
        try {
            cleanupScanner();

            safeSetState(() => {
                setIsLoading(true);
                setHasError(false);
                setScanFailed(false);
                setErrorMessage("");
            });

            // 카메라 지원 여부 확인
            const hasCamera = await QrScanner.hasCamera();
            if (!hasCamera) {
                throw new Error("카메라를 찾을 수 없습니다.");
            }

            if (!videoRef.current || !isMountedRef.current) {
                throw new Error("Video 요소가 준비되지 않았습니다.");
            }

            // QR 스캐너 생성 (간소화)
            qrScannerRef.current = new QrScanner(
                videoRef.current,
                (result) => {
                    if (isMountedRef.current) {
                        handleScanResult(result.data);
                    }
                },
                {
                    onDecodeError: () => {
                        // QR 코드가 감지되지 않을 때는 무시
                    },
                    highlightScanRegion: false,
                    highlightCodeOutline: false,
                    preferredCamera: "environment",
                    maxScansPerSecond: 3,
                    calculateScanRegion: (video) => {
                        // 스캔 영역을 중앙으로 제한
                        const smallerDimension = Math.min(
                            video.videoWidth,
                            video.videoHeight
                        );
                        const scanSize = Math.floor(smallerDimension * 0.6);
                        return {
                            x: Math.floor((video.videoWidth - scanSize) / 2),
                            y: Math.floor((video.videoHeight - scanSize) / 2),
                            width: scanSize,
                            height: scanSize,
                        };
                    },
                }
            );

            // 스캐너 시작 - qr-scanner가 자체적으로 video 스트림 관리
            await qrScannerRef.current.start();

            if (isMountedRef.current) {
                safeSetState(() => {
                    setIsLoading(false);
                    setIsScanning(true);
                });
            }
        } catch (error) {
            console.error("QR 스캐너 초기화 에러:", error);

            if (isMountedRef.current) {
                const errorMsg =
                    error instanceof Error
                        ? error.message
                        : "알 수 없는 오류가 발생했습니다.";

                safeSetState(() => {
                    setErrorMessage(errorMsg);
                    setHasError(true);
                    setIsLoading(false);
                });
            }
        }
    }, [cleanupScanner, handleScanResult, safeSetState]);

    // 스캔 재시도
    const handleRetry = useCallback(() => {
        if (!isMountedRef.current) return;

        cleanupScanner();

        // 잠시 대기 후 재시도
        setTimeout(() => {
            if (isMountedRef.current) {
                initializeQRScanner();
            }
        }, 500);
    }, [cleanupScanner, initializeQRScanner]);

    // 뒤로 가기
    const handleBack = useCallback(() => {
        isMountedRef.current = false;
        cleanupScanner();
        navigate(-1);
    }, [cleanupScanner, navigate]);

    // 컴포넌트 마운트 시 초기화
    useEffect(() => {
        isMountedRef.current = true;

        // DOM이 완전히 준비된 후 초기화
        const timer = setTimeout(() => {
            if (isMountedRef.current) {
                initializeQRScanner();
            }
        }, 300);

        return () => {
            clearTimeout(timer);
            isMountedRef.current = false;
            cleanupScanner();
        };
    }, []);

    // 페이지 가시성 변경 시 처리
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // 페이지가 숨겨질 때 스캐너 정지
                if (qrScannerRef.current) {
                    qrScannerRef.current.stop();
                }
            } else {
                // 페이지가 다시 보일 때 스캐너 재시작
                if (qrScannerRef.current && !isLoading && !hasError) {
                    qrScannerRef.current.start().catch(() => {
                        // 재시작 실패 시 전체 재초기화
                        handleRetry();
                    });
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [isLoading, hasError, handleRetry]);

    // 에러 상태 렌더링
    if (hasError) {
        return (
            <div className="min-h-screen bg-black relative">
                <div className="flex flex-col items-center justify-center h-screen text-white px-6">
                    <h2 className="text-xl font-bold mb-4">
                        카메라에 접근할 수 없습니다
                    </h2>
                    <p className="text-sm text-gray-300 mb-8 text-center">
                        {errorMessage ||
                            "카메라 권한을 허용하거나 다른 앱에서 카메라를 사용 중인지 확인해주세요"}
                    </p>
                    <div className="space-y-3">
                        <Button
                            variant="primary"
                            onClick={handleRetry}
                            className="w-full max-w-xs"
                        >
                            재인식하기
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleBack}
                            className="w-full max-w-xs text-black"
                        >
                            뒤로 가기
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* 전체 화면 카메라 */}
            <div className="absolute inset-0 top-[64px]">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                />

                {/* 오버레이 마스크 */}
                <div className="absolute inset-0">
                    {/* 상단 텍스트 영역 */}
                    <div className="absolute top-0 left-0 right-0 text-center pt-12 pb-8 z-20 bg-gradient-to-b from-black/70 to-transparent">
                        <h2 className="text-xl font-bold text-white mb-2">
                            QR 인식
                        </h2>
                        <p className="text-white text-sm">
                            {scanFailed
                                ? "QR인식을 실패했어요."
                                : "QR을 가운데 화면에 맞춰주세요!"}
                        </p>
                    </div>

                    {/* 마스크 오버레이 */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                        <div
                            className="w-64 h-64"
                            style={{
                                boxShadow: "0 0 0 1000px rgba(0, 0, 0, 0.85)",
                            }}
                        />
                    </div>

                    {/* 스캔 가이드 프레임 */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="relative w-65 h-65">
                            {/* 스캔 영역 테두리 */}
                            <div className="w-full h-full border-2 border-white rounded-lg relative">
                                {/* 스캔 라인 애니메이션 */}
                                {isScanning && !scanFailed && (
                                    <div className="absolute inset-0 overflow-hidden rounded-lg">
                                        <div
                                            className="absolute left-0 right-0 h-0.5 bg-orange-500 opacity-80"
                                            style={{
                                                background:
                                                    "linear-gradient(90deg, transparent, #FF774C, transparent)",
                                                animation:
                                                    "scanLine 2s ease-in-out infinite",
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 하단 상태 표시 영역 */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/70 to-transparent pt-16 pb-8">
                        <div className="text-center">
                            {isLoading && (
                                <div className="text-white">
                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white mb-4"></div>
                                    <p>카메라 준비 중...</p>
                                </div>
                            )}

                            {isScanning && !scanFailed && !isLoading && (
                                <div className="text-white">
                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white mb-4"></div>
                                    <p>인식 중...</p>
                                </div>
                            )}

                            {scanFailed && (
                                <div className="px-6">
                                    <p className="text-white mb-4">
                                        QR 인식을 실패했어요.
                                    </p>
                                    <Button
                                        variant="primary"
                                        onClick={handleRetry}
                                        className="max-w-xs mx-auto"
                                    >
                                        재인식하기
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRScanPage;
