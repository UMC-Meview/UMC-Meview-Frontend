import React from "react";

interface ProfileDropdownMenuProps {
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
    onEditProfile: () => void;
    onLogout: () => void;
}

const ProfileDropdownMenu: React.FC<ProfileDropdownMenuProps> = ({
    isOpen,
    onToggle,
    onClose,
    onEditProfile,
    onLogout,
}) => {
    const buttonBaseClass = "w-full flex items-center space-x-2 px-2 py-1.5 transition-colors text-left";
    const textBaseClass = "text-[12px] font-medium";

    return (
        <>
            {/* 드롭다운 버튼 */}
            <button 
                onClick={onToggle} 
                className="p-2 hover:bg-gray-100 rounded-full relative z-20"
                style={{ zIndex: 20 }}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="5" r="2" fill="currentColor"/>
                    <circle cx="12" cy="12" r="2" fill="currentColor"/>
                    <circle cx="12" cy="19" r="2" fill="currentColor"/>
                </svg>
            </button>

            {/* 드롭다운 메뉴 */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={onClose} />
                    <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-0.5 z-[60] min-w-[100px]">
                        <button
                            onClick={onEditProfile}
                            className={`${buttonBaseClass} hover:bg-gray-50`}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                            </svg>
                            <span className={`${textBaseClass} text-gray-800`}>프로필 수정</span>
                        </button>
                        <hr className="border-gray-100 my-0.5" />
                        <button
                            onClick={onLogout}
                            className={`${buttonBaseClass} hover:bg-red-50`}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="#ef4444"/>
                            </svg>
                            <span className={`${textBaseClass} text-red-500`}>로그아웃</span>
                        </button>
                    </div>
                </>
            )}
        </>
    );
};

export default ProfileDropdownMenu; 