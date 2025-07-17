import { CircleUserRound, Heart, MapIcon, Scan, Trophy } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../../utils/auth";

type TabType = "" | "favorite" | "qrcode" | "ranking" | "profile";

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { id: "" as TabType, icon: MapIcon, label: "지도" },
        { id: "favorite" as TabType, icon: Heart, label: "찜" },
        { id: "qrcode" as TabType, icon: Scan, label: "QR" },
        { id: "ranking" as TabType, icon: Trophy, label: "랭킹" },
        { id: "profile" as TabType, icon: CircleUserRound, label: "프로필" },
    ];

    // 현재 경로에 따라 선택된 탭 결정
    const getSelectedTab = (): TabType => {
        const pathname = location.pathname;
        if (pathname === "/") return "";
        if (pathname.startsWith("/favorite")) return "favorite";
        if (pathname.startsWith("/qrcode")) return "qrcode";
        if (pathname.startsWith("/ranking")) return "ranking";
        if (pathname.startsWith("/profile")) return "profile";
        return ""; // 기본값은 지도
    };

    const selectedTab = getSelectedTab();

    const handleTabClick = (tabId: TabType) => {
        if (tabId === "profile") {
            // 프로필 버튼 클릭 시 로그인 상태 확인
            if (isLoggedIn()) {
                navigate("/profile");
            } else {
                navigate("/login");
            }
        } else {
            navigate(tabId === "" ? "/" : `/${tabId}`);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 shadow-lg bg-gradient-to-t from-[#FF774C] to-[#FF694F]">
            <div className="flex justify-center items-center p-3">
                <div className="flex space-x-4 justify-center items-center">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isSelected = selectedTab === tab.id;

                        return (
                            <button
                                key={tab.id || "map"}
                                onClick={() => handleTabClick(tab.id)}
                                className={`flex items-center flex-col w-[55px] h-[55px] justify-center rounded-full transition-all duration-200 ${
                                    isSelected
                                        ? "bg-white/20 scale-105"
                                        : "hover:bg-white/10"
                                }`}
                            >
                                <Icon
                                    color={isSelected ? "#FFF5F0" : "white"}
                                    size={24}
                                    strokeWidth={isSelected ? 2.5 : 2}
                                />
                                <span
                                    className={`font-bold text-xs mt-1 transition-colors ${
                                        isSelected
                                            ? "text-[#FFF5F0]"
                                            : "text-white"
                                    }`}
                                >
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Footer;
