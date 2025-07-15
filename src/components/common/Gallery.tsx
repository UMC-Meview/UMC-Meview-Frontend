import React, { useState } from "react";

interface GalleryItem {
    id: string;
    image: string;
    name?: string; // 메뉴 갤러리에서만 사용
    price?: number; // 메뉴 갤러리에서만 사용
    alt?: string; // 이미지 갤러리에서 alt 텍스트
}

interface GalleryProps {
    items: GalleryItem[];
    type: "menu" | "image";
    title: string;
    initialDisplayCount?: number;
    expandable?: boolean;
}

const Gallery: React.FC<GalleryProps> = ({
    items = [],
    type,
    title,
    initialDisplayCount = 3,
    expandable = true,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // 처음에는 initialDisplayCount개만 보이고, 더보기 클릭 시 전체 표시
    const displayedItems = isExpanded
        ? items
        : items.slice(0, initialDisplayCount);
    const hasMoreItems = items.length > initialDisplayCount;

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const formatPrice = (price: number) => {
        return `${price.toLocaleString()}원`;
    };

    // 아이템이 없을 때 처리
    if (!items || items.length === 0) {
        return (
            <div className="py-3">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                    {title}
                </h2>
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="text-gray-400 text-sm mb-2">
                        {type === "menu"
                            ? "아직 등록된 메뉴가 없습니다."
                            : "등록된 이미지가 없습니다."}
                    </div>
                </div>
            </div>
        );
    }

    const getButtonText = () => {
        const prefix = type === "menu" ? "메뉴판" : "사진";
        return isExpanded ? `${prefix} 접기` : `${prefix} 더보기`;
    };

    return (
        <div className="py-3">
            <h2 className="text-[18px] font-bold text-gray-900 mb-3">
                {title}
            </h2>

            {/* 갤러리 그리드 */}
            <div className="grid grid-cols-3 gap-2 mb-3">
                {displayedItems.map((item) => (
                    <div key={item.id} className="flex flex-col items-center">
                        {/* 이미지 */}
                        <div className="w-full overflow-hidden rounded-[1px] border border-gray-200 mb-2">
                            <img
                                src={item.image}
                                alt={item.alt || item.name || "이미지"}
                                className="w-full aspect-square object-cover cursor-pointer"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (!target.src.includes("data:image")) {
                                        target.src =
                                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0zNSA0NUgzNVY0NUg2NVY2NUg1NUw1MCA1NUw0NSA2MEg0MEwzNSA0NVoiIGZpbGw9IiM2NjY2NjYiLz4KPHN2Zz4K";
                                    }
                                }}
                            />
                        </div>

                        {/* 메뉴 갤러리인 경우 이름과 가격 표시 */}
                        {type === "menu" && (
                            <>
                                <h3 className="text-sm font-semibold text-gray-900 text-center line-clamp-2">
                                    {item.name}
                                </h3>
                                <p className="text-sm text-gray-900">
                                    {item.price && formatPrice(item.price)}
                                </p>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* 더보기/접기 버튼 */}
            {expandable && hasMoreItems && (
                <div className="flex justify-center">
                    <button
                        onClick={toggleExpanded}
                        className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <span>{getButtonText()}</span>
                        <svg
                            className={`w-4 h-4 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Gallery;
