import React from "react";
import ImageUpload from "../common/ImageUpload";
import StoreFormInput from "./StoreFormInput";
import AddItemButton from "../common/Button/AddItemButton";
import { useFilePreview } from "../../hooks/useFilePreview";
import { processImageForUpload } from "../../utils/imageConversion";
import { usePostImageUpload } from "../../hooks/queries/usePostImageUpload";

export interface MenuItem {
  image: File | null;
  name: string;
  price: string;
  detail: string;
}

interface StoreMenuSectionProps {
  menus: MenuItem[];
  onMenuChange: (menus: MenuItem[]) => void;
  onAddMenu: () => void;
  getImageUrl?: (file: File) => string;
  revokeImage?: (url: string) => void;
}

const PreviewImageMenu: React.FC<{ file: File | null }> = React.memo(({ file }) => {
  const src = useFilePreview(file);
  if (!src) return null;
  return (
    <img
      src={src}
      alt="메뉴사진"
      className="w-full h-full object-cover rounded-lg"
    />
  );
});

const StoreMenuSection: React.FC<StoreMenuSectionProps> = ({ menus, onMenuChange, onAddMenu }) => {
  const { uploadImageAsync } = usePostImageUpload();
  
  const handleMenuImageSelect = async (idx: number, picked: File) => {
    try {
      const file = await processImageForUpload(picked, { sizeThreshold: 1_500_000, maxDimension: 2000, quality: 0.85 });
      
      // API 유효성 검사를 위해 실제 업로드 시도 (URL은 저장하지 않고 검증만)
      await uploadImageAsync(file);
      
      // 업로드 성공 시 메뉴 데이터 업데이트 (파일만 저장, URL은 나중에 등록 시 업로드)
      const newMenus = [...menus];
      newMenus[idx] = { ...newMenus[idx], image: file };
      onMenuChange(newMenus);
    } catch (e) {
      console.error("메뉴 이미지 처리 실패", e);
      alert("이미지 처리에 실패했습니다. 다른 이미지를 선택해주세요.");
    }
  };

  const handleMenuFieldChange = (idx: number, field: 'name' | 'price' | 'detail', value: string) => {
    const newMenus = [...menus];
    newMenus[idx] = { ...newMenus[idx], [field]: value };
    onMenuChange(newMenus);
  };

  // 메뉴 없으면 기본 항목 하나 표시
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
                  children={menu.image ? <PreviewImageMenu file={menu.image} /> : undefined}
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
      </div  >
      <AddItemButton onClick={onAddMenu} variant="full">
        메뉴 추가하기 +
      </AddItemButton>
    </div>
  );
};

export default StoreMenuSection; 