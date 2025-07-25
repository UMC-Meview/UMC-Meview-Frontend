import ImageUpload from "../ImageUpload";
import logoIcon from "../../../assets/Logo.svg";
import cameraIcon from "../../../assets/Camera.svg";

interface ProfileImageProps {
    imageUrl?: string;
    isEditable?: boolean;
    onImageSelect?: (file: File) => void;
    className?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
    imageUrl,
    isEditable = false,
    onImageSelect,
    className = ""
}) => {
    const imageElement = (
        <img
            src={imageUrl || logoIcon}
            alt="프로필 이미지"
            className="w-[70px] h-[70px]"
        />
    );

    if (isEditable) {
        return (
            <div className={`relative ${className}`}>
                <ImageUpload
                    variant="profile"
                    onImageSelect={onImageSelect}
                    className="w-[110px] h-[110px]"
                >
                    {imageElement}
                </ImageUpload>
                <div className="absolute -bottom-2 -right-2 w-[40px] h-[40px] bg-white border border-gray-200 rounded-full flex items-center justify-center" style={{ zIndex: 5 }}>
                    <img src={cameraIcon} alt="카메라" className="w-8 h-8" />
                </div>
            </div>
        );
    }

    return (
        <div className={`${className}`}>
            <div className="w-[110px] h-[110px] bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center">
                {imageElement}
            </div>
        </div>
    );
};

export default ProfileImage; 