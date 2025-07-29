import React from "react";
import Header from "../../components/common/Header";
import alertErrorIcon from "../../assets/alert-error.svg";
import BottomFixedWrapper from "../../components/common/BottomFixedWrapper";
import Button from "../../components/common/Button/Button";
import { useNavigate, useSearchParams } from "react-router-dom";

const QRCodePage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // URL 파라미터에서 데이터 추출
    const qrCodeBase64 = searchParams.get("qrCode");
    const storeId = searchParams.get("storeId");
    const storeName = searchParams.get("storeName");

    // QR 코드 이미지 소스 결정 (전달받은 base64가 있으면 사용, 없으면 에러 아이콘)
    const qrCodeSrc = qrCodeBase64 || alertErrorIcon;
    const displayStoreName = storeName ? decodeURIComponent(storeName) : "가게 이름";

    const handleSaveQR = () => {
        if (qrCodeBase64) {
            // QR 코드를 다운로드하는 로직
            const link = document.createElement('a');
            link.href = qrCodeBase64;
            link.download = `${displayStoreName}_QR코드.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // QR 코드가 없는 경우 홈으로 이동
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Header
                onBack={() => navigate(-1)}
                center="가게 이름"
            />
            <div className="flex-1 flex flex-col justify-start px-6" style={{ marginTop: "56px" }}>
                <div className="w-full max-w-[400px] mx-auto flex flex-col items-center mt-8">
                    <div className="text-xl font-bold text-gray-800 text-center leading-snug mb-8">
                        {qrCodeBase64 ? (
                            <>QR을 캡쳐하거나<br />저장해주세요!</>
                        ) : (
                            <>QR 코드가 없습니다</>
                        )}
                    </div>
                    <div className="flex justify-center mb-8 w-full">
                        {qrCodeBase64 ? (
                            <img 
                                src={qrCodeSrc} 
                                alt={`${displayStoreName} QR 코드`} 
                                className="w-64 h-64 mx-auto" 
                            />
                        ) : (
                            <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
                                <img 
                                    src={qrCodeSrc} 
                                    alt="QR 코드 없음" 
                                    className="w-20 h-20 opacity-60" 
                                />
                            </div>
                        )}
                    </div>
                    {storeId && (
                        <div className="text-sm text-gray-500 text-center mb-4">
                            가게 ID: {storeId}
                        </div>
                    )}
                </div>
            </div>
            <BottomFixedWrapper>
                <Button 
                    variant="primary" 
                    onClick={handleSaveQR}
                    disabled={!qrCodeBase64}
                >
                    {qrCodeBase64 ? "QR 저장하기" : "홈으로 돌아가기"}
                </Button>
            </BottomFixedWrapper>
        </div>
    );
};

export default QRCodePage;
