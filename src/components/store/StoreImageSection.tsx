import React from "react";
import ImageUpload from "../common/ImageUpload";


interface StoreImageSectionProps {
    mainImages: File[];
    onImageSelect: (file: File) => void;
    onReplaceImage: (idx: number, file: File) => void;
    getImageUrl: (file: File) => string;
    revokeImage: (url: string) => void;
}

const StoreImageSection: React.FC<StoreImageSectionProps> = ({
    mainImages,
    onImageSelect,
    onReplaceImage,
    getImageUrl,
    revokeImage,
}) => {
    return (
        <div className="mb-6 flex flex-col items-center w-full">
            <div className="flex gap-1.5 items-end justify-center">
                {mainImages.map((file: File, idx: number) => (
                    <ImageUpload
                        key={`${file.name}-${file.size}-${idx}`}
                        onImageSelect={(newFile) => onReplaceImage(idx, newFile)}
                        size="large"
                        className="w-[115px] h-[115px]"
                        noBorder={true}
                                                        children={
                                    <img
                                        src={getImageUrl(file)}
                                        alt={`메인사진${idx+1}`}
                                        className="w-full h-full object-cover rounded-xl"
                                        style={{ aspectRatio: "1/1" }}
                                        onLoad={(e) => {
                                            // 이미지 로드 완료 후 Object URL 즉시 해제 (메모리 최적화)
                                            revokeImage(e.currentTarget.src);
                                        }}
                                    />
                                }
                    />
                ))}
                {mainImages.length < 3 && (
                    <ImageUpload
                        onImageSelect={onImageSelect}
                        size={mainImages.length === 0 ? "large" : "small"}
                        className={mainImages.length === 0 ? "w-[115px] h-[115px]" : "w-[85px] h-[85px]"}
                        noBorder={true}
                    />
                )}
            </div>
            <p className="text-black text-[15px] mt-3 text-center w-full break-keep">
                메인 사진 첨부하기 <span className="text-gray-400">(선택사항, 최대 3개)</span>
            </p>
        </div>
    );
};

export default StoreImageSection; 