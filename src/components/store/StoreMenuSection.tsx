import React, { useState } from "react";
import ImageUpload from "../common/ImageUpload";
import StoreFormInput from "./StoreFormInput";

export interface MenuItem {
  image: File | null;
  name: string;
  price: string;
  detail: string;
}

interface StoreMenuSectionProps {
  onMenuChange: (menus: MenuItem[]) => void;
}

const StoreMenuSection: React.FC<StoreMenuSectionProps> = ({ onMenuChange }) => {
  const [menus, setMenus] = useState<MenuItem[]>([
    { image: null, name: "", price: "", detail: "" },
    { image: null, name: "", price: "", detail: "" },
  ]);

  const handleMenuImageSelect = (idx: number, file: File) => {
    const newMenus = [...menus];
    newMenus[idx] = { ...newMenus[idx], image: file };
    setMenus(newMenus);
    onMenuChange(newMenus);
  };

  const handleMenuFieldChange = (idx: number, field: 'name' | 'price' | 'detail', value: string) => {
    const newMenus = [...menus];
    newMenus[idx] = { ...newMenus[idx], [field]: value };
    setMenus(newMenus);
    onMenuChange(newMenus);
  };



  return (
    <div className="mt-6 mb-8 relative">
      <label className="block text-gray-800 font-medium mb-1">메뉴판 사진</label>
      <div className="flex flex-col gap-4">
        {menus.map((menu, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex gap-3 items-start">
              <ImageUpload
                label=""
                onImageSelect={(file: File) => handleMenuImageSelect(idx, file)}
                size="small"
                children={menu.image ? (
                  <img
                    src={URL.createObjectURL(menu.image)}
                    alt="메뉴사진"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : undefined}
              />
              <div className="flex-1 flex flex-col gap-0 justify-center">
                <StoreFormInput
                  label=""
                  value={menu.name}
                  onChange={value => handleMenuFieldChange(idx, "name", value)}
                  placeholder="메뉴명을 입력하세요."
                  inputClassName="w-[250px] h-[32px]"
                />
                <StoreFormInput
                  label=""
                  value={menu.price}
                  onChange={value => handleMenuFieldChange(idx, "price", value)}
                  placeholder="가격을 입력하세요."
                  inputClassName="w-[250px] h-[32px]"
                />
              </div>
            </div>
            <StoreFormInput
              label=""
              value={menu.detail}
              onChange={value => handleMenuFieldChange(idx, "detail", value)}
              placeholder="상세정보를 입력하세요."
              className="mt-3"
              inputClassName="w-[338px] h-[32px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreMenuSection; 