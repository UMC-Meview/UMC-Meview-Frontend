import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button/Button";

interface QRScanPageProps {}

const QRScanPage: React.FC<QRScanPageProps> = () => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanFailed, setScanFailed] = useState(false);

    // 카메라 초기화
    const initializeCamera = async () => {
        try {
            setIsLoading(true);
            setHasError(false);
            setScanFailed(false);

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment", // 후면 카메라 사용
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
            });

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                setStream(mediaStream);
                setIsLoading(false);
                setIsScanning(true);
            }
        } catch (error) {
            console.error("카메라 접근 에러:", error);
            setHasError(true);
            setIsLoading(false);
        }
    };

    // 컴포넌트 마운트 시 카메라 초기화
    useEffect(() => {
        initializeCamera();

        // 컴포넌트 언마운트 시 카메라 스트림 정리
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    // QR 코드 스캔 시뮬레이션 (실제로는 QR 스캔 라이브러리 사용)
    useEffect(() => {
        if (isScanning && !hasError) {
            // 5초 후 스캔 실패 시뮬레이션
            const failTimer = setTimeout(() => {
                setIsScanning(false);
                setScanFailed(true);
            }, 5000);

            return () => clearTimeout(failTimer);
        }
    }, [isScanning, hasError]);

    const handleRetry = () => {
        setIsScanning(true);
        setScanFailed(false);

        // 새로운 스캔 시도
        setTimeout(() => {
            setIsScanning(false);
            setScanFailed(true);
        }, 3000);
    };

    const handleBack = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        navigate(-1);
    };

    if (hasError) {
        return (
            <div className="min-h-screen bg-black relative">
                <div className="flex flex-col items-center justify-center h-screen text-white px-6">
                    <h2 className="text-xl font-bold mb-4">
                        카메라에 접근할 수 없습니다
                    </h2>
                    <p className="text-sm text-gray-300 mb-8 text-center">
                        카메라 권한을 허용하거나
                        <br />
                        다른 앱에서 카메라를 사용 중인지 확인해주세요
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => navigate("/")}
                        className="max-w-xs"
                    >
                        홈으로 돌아가기
                    </Button>
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

                {/* 오버레이 마스크 - 중앙 정사각형을 제외한 부분만 어둡게 */}
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

                    {/* 마스크 오버레이 - 중앙 정사각형 영역만 투명하게 */}
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
