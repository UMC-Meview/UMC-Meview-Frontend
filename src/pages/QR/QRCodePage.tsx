import React from "react";
import Header from "../../components/common/Header";
import imageIcon from "../../assets/QRImg.svg";
import BottomFixedWrapper from "../../components/common/BottomFixedWrapper";
import Button from "../../components/common/Button/Button";
import { useNavigate } from "react-router-dom";

const QRCodePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white w-full relative flex flex-col">
            <div className="pt-10">
                <Header
                    onBack={() => navigate(-1)}
                    center={
                        <h1 className="text-lg font-bold text-gray-800">
                            가게 이름
                        </h1>
                    }
                />
            </div>
            <div className="flex-1 flex flex-col justify-start px-6" style={{ marginTop: "56px" }}>
                <div className="w-full max-w-[400px] mx-auto flex flex-col items-center mt-8">
                    <div className="text-xl font-bold text-gray-800 text-center leading-snug mb-8">
                        QR을 캡쳐하거나<br />저장해주세요!
                    </div>
                    <div className="flex justify-center mb-8 w-full">
                        <img src={imageIcon} alt="가게 QR 코드" className="w-64 h-64 mx-auto" />
                    </div>
                </div>
            </div>
            <BottomFixedWrapper>
                <Button variant="primary">
                    QR 저장하기
                </Button>
            </BottomFixedWrapper>
        </div>
    );
};

export default QRCodePage;
