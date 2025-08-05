import { useRef, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QrScanner from "qr-scanner";

export interface QRScannerState {
    isLoading: boolean;
    hasError: boolean;
    isScanning: boolean;
    scanFailed: boolean;
    errorMessage: string;
}

export const useQRScanner = () => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const qrScannerRef = useRef<QrScanner | null>(null);
    const isMountedRef = useRef(true);
    const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [state, setState] = useState<QRScannerState>({
        isLoading: true,
        hasError: false,
        isScanning: false,
        scanFailed: false,
        errorMessage: "",
    });

    // 안전한 상태 업데이트 함수
    const safeSetState = useCallback(
        (updater: (prevState: QRScannerState) => QRScannerState) => {
            if (isMountedRef.current) {
                setState(updater);
            }
        },
        []
    );

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

    // 스캔 타임아웃 설정 함수 추가
    const setScanTimeout = useCallback(() => {
        if (scanTimeoutRef.current) {
            clearTimeout(scanTimeoutRef.current);
        }

        scanTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
                safeSetState((prev) => ({
                    ...prev,
                    scanFailed: true,
                    isScanning: false,
                }));
            }
        }, 10000); // 10초 후 실패로 처리
    }, [safeSetState]);

    // QR 코드 스캔 결과 처리
    const handleScanResult = useCallback(
        (data: string) => {
            // 타임아웃 클리어 추가
            if (scanTimeoutRef.current) {
                clearTimeout(scanTimeoutRef.current);
                scanTimeoutRef.current = null;
            }

            safeSetState((prev) => ({ ...prev, isScanning: false }));
            cleanupScanner();

            try {
                const url = new URL(data);
                if (url.pathname.includes("/stores/")) {
                    // stores만 체크
                    const storeId = url.pathname.split("/stores/")[1];
                    navigate(`/review/entry?storeId=${storeId}`);
                } else {
                    window.open(data, "_blank");
                    navigate("/");
                }
            } catch {
                alert(`QR 코드 내용: ${data}`);
                navigate("/");
            }
        },
        [navigate, cleanupScanner, safeSetState]
    );

    // QR 스캐너 초기화
    const initializeQRScanner = useCallback(async () => {
        try {
            cleanupScanner();

            // 기존 타임아웃 클리어
            if (scanTimeoutRef.current) {
                clearTimeout(scanTimeoutRef.current);
                scanTimeoutRef.current = null;
            }

            safeSetState((prev) => ({
                ...prev,
                isLoading: true,
                hasError: false,
                scanFailed: false,
                errorMessage: "",
            }));

            // 카메라 지원 여부 확인
            const hasCamera = await QrScanner.hasCamera();
            if (!hasCamera) {
                throw new Error("카메라를 찾을 수 없습니다.");
            }

            if (!videoRef.current || !isMountedRef.current) {
                throw new Error("Video 요소가 준비되지 않았습니다.");
            }

            // QR 스캐너 생성
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

            await qrScannerRef.current.start();

            if (isMountedRef.current) {
                safeSetState((prev) => ({
                    ...prev,
                    isLoading: false,
                    isScanning: true,
                }));

                // 스캔 타임아웃 설정
                setScanTimeout();
            }
        } catch (error) {
            console.error("QR 스캐너 초기화 에러:", error);

            if (isMountedRef.current) {
                const errorMsg =
                    error instanceof Error
                        ? error.message
                        : "알 수 없는 오류가 발생했습니다.";

                safeSetState((prev) => ({
                    ...prev,
                    errorMessage: errorMsg,
                    hasError: true,
                    isLoading: false,
                }));
            }
        }
    }, [cleanupScanner, handleScanResult, safeSetState, setScanTimeout]);

    // 스캔 재시도
    const handleRetry = useCallback(() => {
        if (!isMountedRef.current) return;

        // 타임아웃 클리어
        if (scanTimeoutRef.current) {
            clearTimeout(scanTimeoutRef.current);
            scanTimeoutRef.current = null;
        }

        cleanupScanner();
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

    // 초기화 및 정리
    useEffect(() => {
        isMountedRef.current = true;

        const timer = setTimeout(() => {
            if (isMountedRef.current) {
                initializeQRScanner();
            }
        }, 300);

        return () => {
            clearTimeout(timer);
            if (scanTimeoutRef.current) {
                clearTimeout(scanTimeoutRef.current);
            }
            isMountedRef.current = false;
            cleanupScanner();
        };
    }, [cleanupScanner, initializeQRScanner]);

    // 페이지 가시성 변경 처리
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (qrScannerRef.current) {
                    qrScannerRef.current.stop();
                }
            } else {
                if (
                    qrScannerRef.current &&
                    !state.isLoading &&
                    !state.hasError
                ) {
                    qrScannerRef.current.start().catch(() => {
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
    }, [state.isLoading, state.hasError, handleRetry]);

    return {
        videoRef,
        state,
        handleRetry,
        handleBack,
    };
};
