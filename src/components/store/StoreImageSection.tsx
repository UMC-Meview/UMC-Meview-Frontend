import React from "react";
import { useFilePreview } from "../../hooks/useFilePreview";
import ImageUpload from "../common/ImageUpload";

const PreviewImage: React.FC<{
    file: File;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
}> = React.memo(({ file, alt, className, style }) => {
    const src = useFilePreview(file);
    if (!src) return null;
    return <img src={src} alt={alt} className={className} style={style} />;
});

interface StoreImageSectionProps {
    mainImages: File[];
    onImageSelect: (file: File) => void;
    onReplaceImage: (idx: number, file: File) => void;
    onRemoveImage?: (idx: number) => void;
    maxImages?: number; 
    title?: string; 
    showCount?: boolean; 
    variant?: "default" | "review"; 
    previewUrls?: string[]; // 외부에서 제공되는 미리보기 URL들
}

const StoreImageSection = ({
    mainImages,
    onImageSelect,
    onReplaceImage,
    onRemoveImage,
    maxImages,
    title = "메인 사진 첨부하기",
    showCount = true,
    variant = "default",
    previewUrls = [],
}: StoreImageSectionProps) => {
    const canAddMore = maxImages ? mainImages.length < maxImages : true;
    
    if (variant === "review") {
        return (
            <div className="mb-8">
                {/* 이미지 업로드 버튼 */}
                {canAddMore && (
                    <ImageUpload
                        onImageSelect={onImageSelect}
                        size="small"
                        className="w-[100px] h-[100px]"
                    />
                )}
                {/* 선택된 이미지 미리보기 */}
                {mainImages.length > 0 && (
                    <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">선택된 이미지 ({mainImages.length}개)</p>
                        <div className="flex flex-wrap gap-2">
                            {mainImages.map((file, index) => (
                                <div key={index} className="relative w-16 h-16">
                                    {previewUrls[index] ? (
                                        <img
                                            src={previewUrls[index]}
                                            alt={`이미지 ${index + 1}`}
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                        />
                                    ) : (
                                        <PreviewImage
                                            file={file}
                                            alt={`이미지 ${index + 1}`}
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                        />
                                    )}
                                    {onRemoveImage && (
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                            onClick={() => onRemoveImage(index)}
                                            aria-label="이미지 삭제"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }
    
    // 기본 variant (매장 등록용)
    return (
        <div className="mb-6 flex flex-col items-center w-full">
            <div className="flex gap-1.5 items-end justify-center">
                {mainImages.map((file: File, idx: number) => (
                    <div key={`${file.name}-${file.size}-${idx}`} className="relative w-[115px] h-[115px]">
                        <ImageUpload
                            onImageSelect={(newFile) => onReplaceImage(idx, newFile)}
                            size="large"
                            className="w-full h-full"
                            noBorder={true}
                            children={
                                <PreviewImage
                                    file={file}
                                    alt={`메인사진${idx + 1}`}
                                    className="w-full h-full object-cover rounded-xl"
                                    style={{ aspectRatio: "1/1" }}
                                />
                            }
                        />
                        {onRemoveImage && (
                            <button
                                type="button"
                                className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                onClick={() => onRemoveImage(idx)}
                                aria-label="이미지 삭제"
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
                {canAddMore && (
                    <ImageUpload
                        onImageSelect={onImageSelect}
                        size={mainImages.length === 0 ? "large" : "small"}
                        className={mainImages.length === 0 ? "w-[115px] h-[115px]" : "w-[85px] h-[85px]"}
                        noBorder={true}
                    />
                )}
            </div>
            <p className="text-black text-[15px] mt-3 text-center w-full break-keep">
                {title} {showCount && maxImages && <span className="text-gray-400">(선택사항, 최대 {maxImages}개)</span>}
                {showCount && !maxImages && <span className="text-gray-400">(선택사항)</span>}
            </p>
        </div>
    );
};

export default StoreImageSection; 