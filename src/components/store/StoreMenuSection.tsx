import React from "react";
import ImageUpload from "../common/ImageUpload";
import StoreFormInput from "./StoreFormInput";

export interface MenuItem {
  image: File | null;
  name: string;
  price: string;
  detail: string;
}

interface StoreMenuSectionProps {
  menus: MenuItem[];
  onMenuChange: (menus: MenuItem[]) => void;
}

const StoreMenuSection: React.FC<StoreMenuSectionProps> = ({ menus, onMenuChange }) => {
  const handleMenuImageSelect = (idx: number, file: File) => {
    const newMenus = [...menus];
    newMenus[idx] = { ...newMenus[idx], image: file };
    onMenuChange(newMenus);
  };

  const handleMenuFieldChange = (idx: number, field: 'name' | 'price' | 'detail', value: string) => {
    const newMenus = [...menus];
    newMenus[idx] = { ...newMenus[idx], [field]: value };
    onMenuChange(newMenus);
  };

  // 메뉴가 없으면 기본 메뉴 하나 추가
  const displayMenus = menus.length === 0 ? [{ image: null, name: "", price: "", detail: "" }] : menus;

  return (
    <div className="relative">
      <label className="block text-gray-800 font-medium mb-4">메뉴판 사진</label>
      <div className="flex flex-col gap-4">
        {displayMenus.map((menu, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex gap-3 items-start">
              <div className="overflow-hidden rounded-lg">
                <ImageUpload
                  onImageSelect={(file: File) => handleMenuImageSelect(idx, file)}
                  size="small"
                  className="w-[75px] h-[75px]"
                  noBorder={true}
                  children={menu.image ? (
                    <img
                      src={URL.createObjectURL(menu.image)}
                      alt="메뉴사진"
                      className="w-full h-full object-cover rounded-lg"
                      onLoad={(e) => {
                        // 이미지 로드 완료 후 Object URL 즉시 해제 (메모리 최적화)
                        URL.revokeObjectURL(e.currentTarget.src);
                      }}
                    />
                  ) : undefined}
                />
              </div>
              <div className="flex-1 flex flex-col gap-2 justify-center">
                <StoreFormInput
                  value={menu.name}
                  onChange={value => handleMenuFieldChange(idx, "name", value)}
                  placeholder="메뉴명을 입력하세요."
                  variant="medium"
                />
                <StoreFormInput
                  value={menu.price}
                  onChange={value => handleMenuFieldChange(idx, "price", value)}
                  placeholder="가격을 입력하세요."
                  variant="medium"
                />
              </div>
            </div>
            <StoreFormInput
              value={menu.detail}
              onChange={value => handleMenuFieldChange(idx, "detail", value)}
              placeholder="상세정보를 입력하세요."
              className="mt-3"
              variant="default"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreMenuSection; 