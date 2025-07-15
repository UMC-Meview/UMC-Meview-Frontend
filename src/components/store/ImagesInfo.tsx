import React from "react";
import Gallery from "../common/Gallery";

interface ImagesInfoProps {
    images?: string[];
    mainImage?: string;
    storeName?: string;
}

const ImagesInfo: React.FC<ImagesInfoProps> = ({
    images = [],
    mainImage,
    storeName = "가게",
}) => {
    // 메인 이미지와 추가 이미지들을 합친 전체 이미지 배열을 GalleryItem 형태로 변환
    const allImages = mainImage ? [mainImage, ...images] : images;

    const galleryItems = allImages.map((image, index) => ({
        id: `image-${index}`,
        image: image,
        alt: `${storeName} ${
            index === 0 && mainImage ? "대표" : index + 1 + "번째"
        } 이미지`,
    }));

    return (
        <Gallery
            items={galleryItems}
            type="image"
            title="이미지"
            initialDisplayCount={6}
            expandable={true}
        />
    );
};

export default ImagesInfo;
