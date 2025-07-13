import React from "react";
import Header from "../../components/common/Header.tsx";
import imageIcon from "../../assets/QRImg.svg";

const QRCodePage: React.FC = () => {
    console.log("QRCodePage");

    return (
        <div className="min-h-screen bg-white w-full mx-auto">
            {/* 헤더: 상단 패딩을 늘려 더 아래로 */}
            <div className="pt-10">
                <Header
                    center={
                        <h1 className="text-xl font-bold text-gray-800">
                            가게 이름
                        </h1>
                    }
                />
            </div>
            {/* 헤더와 QR코드 사이 충분한 여백, QR 이미지는 수평 중앙 정렬 */}
            <div className="mt-32 flex justify-center">
                <img src={imageIcon} alt="QR 코드" className="w-80 h-80" />
            </div>
        </div>
    );
};

export default QRCodePage;
