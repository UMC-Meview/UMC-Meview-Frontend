import React from "react";
import { MenuResponseDto } from "../../types/menu";
import Gallery from "../common/Gallery";

interface MenuInfoProps {
    menus: MenuResponseDto[];
}

const MenuInfo: React.FC<MenuInfoProps> = ({ menus = [] }) => {
    // MenuResponseDto를 GalleryItem 형태로 변환
    const galleryItems = menus.map((menu) => ({
        id: menu._id,
        image: menu.image || "",
        name: menu.name,
        price: menu.price,
    }));

    return (
        <Gallery
            items={galleryItems}
            type="menu"
            title="메뉴판"
            initialDisplayCount={6}
            expandable={true}
        />
    );
};

export default MenuInfo;
