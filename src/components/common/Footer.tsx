import { CircleUserRound, Heart, MapIcon, QrCode } from "lucide-react";

const Footer = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 shadow-lg bg-gradient-to-t from-[#FF774C] to-[#FF694F]">
            <div className="flex justify-center items-center p-4">
                <div className="flex space-x-10 justify-center items-center">
                    <div className="flex items-center flex-col">
                        <QrCode color="white" size={20} />
                        <button className="text-white font-bold text-sm mt-1">
                            QR
                        </button>
                    </div>
                    <div className="flex items-center flex-col">
                        <MapIcon color="white" size={20} />
                        <button className="text-white font-bold text-sm mt-1">
                            지도
                        </button>
                    </div>
                    <div className="flex items-center flex-col">
                        <Heart color="white" size={20} fill="white" />
                        <button className="text-white font-bold text-sm mt-1">
                            찜한가게
                        </button>
                    </div>
                    <div className="flex items-center flex-col">
                        <CircleUserRound color="white" size={20} />
                        <button className="text-white font-bold text-sm mt-1">
                            프로필
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
