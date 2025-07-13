import React from "react";
import ImageUpload from "../common/ImageUpload";
import LabeledInput from "./LabeledInput";

export interface MenuItem {
  image: File | null;
  name: string;
  price: string;
  detail: string;
}

interface MenuInputProps {
  menu: MenuItem;
  idx: number;
  onImageSelect: (idx: number, file: File) => void;
  onFieldChange: (idx: number, field: keyof Omit<MenuItem, "image">, value: string) => void;
}

const MenuInput: React.FC<MenuInputProps> = React.memo(({ menu, idx, onImageSelect, onFieldChange }) => {
  const renderImage = () =>
    menu.image ? (
      <div className="w-20 h-20 rounded-lg overflow-hidden border border-[#E5E5E5] bg-[#D9D9D9] flex items-center justify-center">
        <img
          src={URL.createObjectURL(menu.image)}
          alt="메뉴사진"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    ) : (
      <ImageUpload
        label=""
        onImageSelect={(file: File) => onImageSelect(idx, file)}
        size="small"
      />
    );

  return (
    <div className="mb-4">
      <div className="flex gap-3 items-start">
        {renderImage()}
        <div className="flex-1 flex flex-col gap-0 justify-center">
          <LabeledInput
            label=""
            value={menu.name}
            onChange={value => onFieldChange(idx, "name", value)}
            placeholder="메뉴명을 입력하세요."
            inputClassName="w-[250px] h-[32px]"
          />
          <LabeledInput
            label=""
            value={menu.price}
            onChange={value => onFieldChange(idx, "price", value)}
            placeholder="가격을 입력하세요."
            inputClassName="w-[250px] h-[32px]"
          />
        </div>
      </div>
      <LabeledInput
        label=""
        value={menu.detail}
        onChange={value => onFieldChange(idx, "detail", value)}
        placeholder="상세정보를 입력하세요."
        className="mt-3"
        inputClassName="w-[338px] h-[32px]"
      />
    </div>
  );
});

export default MenuInput; 