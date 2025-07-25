import React from "react";
import Header from "../../components/common/Header";
import imageIcon from "../../assets/QRImg.svg";
import BottomFixedWrapper from "../../components/common/BottomFixedWrapper";
import Button from "../../components/common/Button/Button";
import { useNavigate, useLocation } from "react-router-dom";

interface LocationState {
    qrCodeBase64?: string;
    qrCodeFilePath?: string;
    storeName?: string;
    storeId?: string;
}

const QRCodePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;

    // QR 코드 이미지 소스 결정 (전달받은 base64가 있으면 사용, 없으면 기본 이미지)
    const qrCodeSrc = state?.qrCodeBase64 || imageIcon;
    const storeName = state?.storeName || "가게 이름";

    const handleSaveQR = () => {
        if (state?.qrCodeBase64) {
            // QR 코드를 다운로드하는 로직
            const link = document.createElement('a');
            link.href = state.qrCodeBase64;
            link.download = `${storeName}_QR코드.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // 기본 이미지인 경우 알림
            alert("QR 코드를 저장할 수 없습니다.");
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
                        QR을 캡쳐하거나<br />저장해주세요!
                    </div>
                    <div className="flex justify-center mb-8 w-full">
                        <img 
                            src={qrCodeSrc} 
                            alt={`${storeName} QR 코드`} 
                            className="w-64 h-64 mx-auto" 
                        />
                    </div>
                    {state?.storeId && (
                        <div className="text-sm text-gray-500 text-center mb-4">
                            가게 ID: {state.storeId}
                        </div>
                    )}
                </div>
            </div>
            <BottomFixedWrapper>
                <Button 
                    variant="primary" 
                    onClick={handleSaveQR}
                    disabled={!state?.qrCodeBase64}
                >
                    QR 저장하기
                </Button>
            </BottomFixedWrapper>
        </div>
    );
};

export default QRCodePage;
