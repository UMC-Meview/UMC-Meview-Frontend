import React from "react";
import ProfileImage from "./ProfileImage";
import EditableText from "./EditableText";

interface ProfileInfoSectionProps {
    imageUrl?: string;
    nickname: string;
    introduction: string;
    tastePreferences?: string[];
    reviewCount?: number;
    favoriteCount?: number;
    isEditable?: boolean;
    onImageSelect?: (file: File) => void;
    onNicknameChange?: (nickname: string) => void;
    onIntroductionChange?: (introduction: string) => void;
    className?: string;
}

const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({
    imageUrl,
    nickname,
    introduction,
    tastePreferences = [],
    reviewCount = 0,
    favoriteCount = 0,
    isEditable = false,
    onImageSelect,
    onNicknameChange,
    onIntroductionChange,
    className = ""
}) => {
    const tagClass = "px-3 py-0.5 rounded-full shadow-[0_2px_8px_0_rgba(0,0,0,0.12)] text-[15px] font-medium border bg-white border-transparent text-gray-800 min-h-[22px] whitespace-nowrap";
    const bubbleClass = "px-4 py-2 rounded-tr-full rounded-br-full rounded-bl-full shadow-[0_2px_8px_0_rgba(0,0,0,0.12)] bg-white border border-transparent h-[40px]";
    
    return (
        <div className={`pt-6 pb-2 space-y-5 ${className}`}>
            <div className="flex justify-center">
                <div className="flex items-start space-x-4 max-w-md">
                    <div className="ml-2">
                        <ProfileImage 
                            isEditable={isEditable}
                            imageUrl={imageUrl}
                            onImageSelect={onImageSelect}
                        />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center">
                            {isEditable && onNicknameChange ? (
                                <div className="ml-2">
                                    <EditableText
                                        value={nickname}
                                        onSave={onNicknameChange}
                                        className="text-[21px] font-semibold text-gray-800"
                                        inputClassName="text-[21px] font-semibold text-gray-800"
                                        showEditIcon={true}
                                        editMode="nickname"
                                        maxLength={8}
                                    />
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-[24px] font-semibold text-gray-800">{nickname}</h2>
                                    <div className="flex space-x-3 text-[14px] ml-auto mr-3 text-gray-500">
                                        <span>리뷰수 <span className="font-black text-gray-800">{reviewCount}</span></span>
                                        <span>찜 <span className="font-black text-gray-800">{favoriteCount}</span></span>
                                    </div>
                                </>
                            )}
                        </div>
                        
                        {!isEditable && tastePreferences.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-[14px] font-medium text-gray-700">대표입맛</h3>
                                <div className="flex flex-wrap gap-2 w-[230px]">
                                    {tastePreferences.slice(0, 3).map((taste, index) => (
                                        <span key={index} className={tagClass}>{taste}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isEditable && onIntroductionChange && (
                            <div className="space-y-6 ml-2">
                                <label className="text-xs text-gray-600">한 줄 소개</label>
                                <EditableText
                                    value={introduction}
                                    onSave={onIntroductionChange}
                                    className={`${bubbleClass} w-[230px] text-[15px] text-black text-center`}
                                    inputClassName="text-[15px] text-gray-700 bg-transparent flex-1"
                                    showEditIcon={true}
                                    iconPosition="end"
                                    editMode="description"
                                    maxLength={13}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {!isEditable && (
                <div className="px-4 flex justify-center">
                    <div className="w-[356px]">
                        <span className="text-[14px] text-gray-600">한 줄 소개</span>
                        <div className={`mt-1 ${bubbleClass} w-[349px] flex items-center`}>
                            <div className="text-[15px] text-black flex-1 text-center">
                                {introduction || "한 줄 소개를 입력해주세요"}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileInfoSection; 