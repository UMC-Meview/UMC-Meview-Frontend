import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import BottomFixedButton from "../../components/common/Button/BottomFixedButton";
import StoreFormInput from "../../components/store/StoreFormInput";
import PostcodeSearch from "../../components/store/PostcodeSearch";
import StoreMenuSection from "../../components/store/StoreMenuSection";
import AddItemButton from "../../components/common/Button/AddItemButton";
import ImageUpload from "../../components/common/ImageUpload";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useStoreRegistration } from "../../hooks/queries/usePostStoreRegistration";
import { usePostMenuRegistration } from "../../hooks/queries/usePostMenuRegistration";
import { StoreRegistrationRequest } from "../../types/store";

interface StoreFormData {
  storeName: string;
  category: string;
  description: string;
  address: string;
  detailAddress: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  openingHours: string[];
  mainImages: File[];
  menuList: {
    name: string;
    price: string;
    detail: string;
    image: File | null;
  }[];
}

const StoreRegistrationPage: React.FC = () => {
    const navigate = useNavigate();
    const { mutate, isLoading, isSuccess, data, error } = useStoreRegistration();
    const { registerMenu } = usePostMenuRegistration();

    // 폼 데이터 상태
    const [formData, setFormData] = useState<StoreFormData>({
        storeName: "",
        category: "한식",
        description: "",
        address: "",
        detailAddress: "",
        postalCode: "",
        latitude: 37.5665, // 기본값: 서울시청
        longitude: 126.978,
        openingHours: [""],
        mainImages: [],
        menuList: [
            { name: "", price: "", detail: "", image: null },
            { name: "", price: "", detail: "", image: null },
        ],
    });

    // 공통 input 핸들러
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // 메인 이미지 추가 (최대 3개, 중복 방지)
    const handleMainImageSelect = (file: File) => {
        setFormData(prev => {
            if (prev.mainImages.length >= 3) return prev;
            if (prev.mainImages.some(img => img.name === file.name && img.size === file.size)) return prev;
            return { ...prev, mainImages: [...prev.mainImages, file] };
        });
    };

    // 메인 이미지 교체
    const handleReplaceMainImage = (idx: number, file: File) => {
        setFormData(prev => {
            const newImages = [...prev.mainImages];
            newImages[idx] = file;
            return { ...prev, mainImages: newImages };
        });
    };

    // 메뉴 목록 업데이트
    const handleMenuChange = (menus: { image: File | null; name: string; price: string; detail: string }[]) => {
        setFormData(prev => ({ ...prev, menuList: menus }));
    };

    // 메뉴 추가
    const handleAddMenu = () => {
        setFormData(prev => ({
            ...prev,
            menuList: [...prev.menuList, { image: null, name: "", price: "", detail: "" }]
        }));
    };

    // 영업시간 필드 변경
    const handleOpeningHourChange = (idx: number, value: string) => {
        setFormData(prev => {
            const newHours = [...prev.openingHours];
            newHours[idx] = value;
            return { ...prev, openingHours: newHours };
        });
    };

    // 영업시간 필드 추가
    const handleAddOpeningHour = () => {
        setFormData(prev => ({
            ...prev,
            openingHours: [...prev.openingHours, ""]
        }));
    };

    // 폼 유효성 검사 (이미지 업로드 API 완성 후 mainImages.length > 0 조건 추가 예정)
    const isFormValid = () =>
        formData.storeName.trim() !== "" &&
        formData.address.trim() !== "";
        // TODO: 이미지 업로드 API 완성 후 아래 조건 추가
        // && formData.mainImages.length > 0;

    // 이미지를 base64로 변환하는 함수
    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
        });
    };

    // 폼 제출
    const handleSubmit = async () => {
        console.log("=== 폼 제출 시작 ===");
        console.log("storeName:", formData.storeName);
        console.log("address:", formData.address);
        console.log("isFormValid:", isFormValid());
        
        if (isFormValid()) {
            try {
                // API 요청 데이터 형식으로 변환
                const requestData: StoreRegistrationRequest = {
                    location: {
                        type: "Point",
                        coordinates: [formData.longitude, formData.latitude],
                    },
                    name: formData.storeName.trim(),
                    category: formData.category || "음식점",
                    description: formData.description || "상세 설명 없음",
                    address: formData.address.trim(),
                    operatingHours: formData.openingHours.filter(hour => hour.trim() !== "").join(", ") || "영업시간 미정",
                    qrPrefix: "https://miview.com/stores/",
                };

                // 이미지가 있는 경우에만 mainImage 필드 추가
                if (formData.mainImages.length > 0) {
                    console.log("📸 이미지 변환 시작:", formData.mainImages.length, "개");
                    const mainImageUrls = await Promise.all(formData.mainImages.map(convertToBase64));
                    requestData.mainImage = mainImageUrls;
                    console.log("✅ 이미지 변환 완료");
                } else {
                    console.log("📸 이미지 없음 - mainImage 필드 제외");
                }
                
                // 디버깅: 실제 전송되는 데이터 확인
                console.log("가게 등록 요청 데이터:", requestData);
                console.log("폼 데이터 상태:", formData);
                
                mutate(requestData);
            } catch (error) {
                console.error("이미지 변환 실패:", error);
                alert("이미지 처리 중 오류가 발생했습니다.");
            }
        } else {
            console.log("폼 유효성 검사 실패");
            alert("필수 항목을 모두 입력해주세요.");
        }
    };

    // API 성공 시 QR 코드 페이지로 이동
    useEffect(() => {
        if (isSuccess && data) {
            console.log("🎉 가게 등록 성공, QR 코드 페이지로 이동");
            
            // 가게 등록 성공 후 메뉴들 등록
            const validMenus = formData.menuList.filter(menu => 
                menu.name.trim() !== "" && menu.price.trim() !== ""
            );
            
            if (validMenus.length > 0) {
                // 각 메뉴를 순차적으로 등록
                validMenus.forEach(menu => {
                    const menuData = {
                        name: menu.name,
                        description: menu.detail || "상세 설명 없음",
                        price: parseInt(menu.price) || 0,
                        storeId: data._id,
                        image: menu.image ? `https://example.com/menu-${menu.name}.jpg` : undefined,
                    };
                    registerMenu(menuData);
                });
            }
            
            // QR 코드 페이지로 이동 (URL 파라미터 방식)
            navigate(`/qrcode?qrCode=${encodeURIComponent(data.qrCodeBase64)}&storeId=${data._id}&storeName=${encodeURIComponent(data.name)}`);
        }
    }, [isSuccess, data, navigate, formData.menuList, registerMenu]);

    const handleBack = () => navigate('/login');

    return (
        <div className="min-h-screen bg-white">
            <Header
                onBack={handleBack}
                center="가게 등록하기"
            />
            
            {/* 에러 메시지 표시 */}
            {error && <ErrorMessage message={error} />}
            
                            {/* 메인 사진 업로드 - 현재 선택사항 (이미지 업로드 API 완성 후 필수로 변경 예정) */}
                <div className="px-6 sm:px-8 md:px-10 lg:px-12 w-full max-w-screen-sm mx-auto" style={{ marginTop: "15px" }}>
                <div className="mb-6 flex flex-col items-center w-full">
                    <div className="flex gap-1.5 items-end justify-center">
                        {formData.mainImages.map((file: File, idx: number) => (
                            <ImageUpload
                                key={`${file.name}-${file.size}-${idx}`}
                                onImageSelect={(newFile) => handleReplaceMainImage(idx, newFile)}
                                size="large"
                                className="w-[115px] h-[115px]"
                                noBorder={true}
                                children={
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`메인사진${idx+1}`}
                                        className="w-full h-full object-cover rounded-xl"
                                        style={{ aspectRatio: "1/1" }}
                                        onLoad={(e) => {
                                            // 이미지 로드 완료 후 Object URL 즉시 해제 (메모리 최적화)
                                            URL.revokeObjectURL(e.currentTarget.src);
                                        }}
                                    />
                                }
                            />
                        ))}
                        {formData.mainImages.length < 3 && (
                            <ImageUpload
                                onImageSelect={handleMainImageSelect}
                                size={formData.mainImages.length === 0 ? "large" : "small"}
                                className={formData.mainImages.length === 0 ? "w-[115px] h-[115px]" : "w-[85px] h-[85px]"}
                                noBorder={true}
                            />
                        )}
                    </div>
                    <p className="text-black text-[15px] mt-3 text-center w-full break-keep">
                        메인 사진 첨부하기 <span className="text-gray-400">(선택사항, 최대 3개)</span>
                    </p>
                </div>
                
                {/* 입력 필드들 */}
                <div className="space-y-6">
                    {/* 가게명 */}
                    <div>
                        <label className="block text-gray-800 font-medium mb-2">상호명</label>
                        <StoreFormInput
                            placeholder="상호명을 입력해주세요"
                            value={formData.storeName}
                            onChange={(value) => handleInputChange("storeName", value)}
                            variant="default"
                        />
                    </div>

                    {/* 카테고리 */}
                    <div>
                        <label className="block text-gray-800 font-medium mb-2">카테고리</label>
                        <select
                            value={formData.category}
                            onChange={(e) => handleInputChange("category", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-[#FF774C] text-xs"
                        >
                            <option value="한식">한식</option>
                            <option value="중식">중식</option>
                            <option value="일식">일식</option>
                            <option value="양식">양식</option>
                            <option value="카페">카페</option>
                            <option value="술집">술집</option>
                            <option value="기타">기타</option>
                        </select>
                    </div>

                    {/* 설명 */}
                    <div>
                        <label className="block text-gray-800 font-medium mb-2">가게 설명</label>
                        <StoreFormInput
                            placeholder="가게에 대한 설명을 입력해주세요"
                            value={formData.description}
                            onChange={(value) => handleInputChange("description", value)}
                            variant="large"
                        />
                    </div>

                    {/* 주소 */}
                    <div className="space-y-2">
                        <label className="block text-gray-800 font-medium mb-2">가게 주소</label>
                        <div className="flex gap-2 items-end">
                            <StoreFormInput
                                value={formData.postalCode}
                                onChange={value => handleInputChange("postalCode", value)}
                                placeholder="우편번호"
                                variant="small"
                                inputClassName="text-[13px]"
                                disabled={!formData.address}
                            />
                            <PostcodeSearch
                                onAddressSelect={(address, postcode) => {
                                    handleInputChange("address", address);
                                    handleInputChange("postalCode", postcode);
                                }}
                                className="flex-shrink-0"
                            />
                        </div>
                        <StoreFormInput
                            value={formData.address}
                            onChange={value => handleInputChange("address", value)}
                            placeholder="가게 주소를 입력해주세요."
                            variant="default"
                            disabled={!formData.postalCode}
                        />
                        <StoreFormInput
                            value={formData.detailAddress}
                            onChange={value => handleInputChange("detailAddress", value)}
                            placeholder="상세 주소를 입력해주세요."
                            variant="default"
                            disabled={!formData.address}
                        />
                    </div>
                    
                    {/* 영업시간 */}
                    <div className="mt-6 mb-5">
                        <label className="block text-gray-800 font-medium mb-2">영업시간</label>
                        {formData.openingHours.map((hour, idx) => (
                            <div key={idx} className="mb-2">
                                <StoreFormInput
                                    value={hour}
                                    onChange={value => handleOpeningHourChange(idx, value)}
                                    placeholder="영업시간을 입력해주세요."
                                    variant="default"
                                />
                            </div>
                        ))}
                        <div className="mt-10">
                            <AddItemButton onClick={handleAddOpeningHour} variant="center">
                                영업시간 추가하기 +
                            </AddItemButton>
                        </div>
                    </div>
                </div>
                
                {/* 메뉴판 사진 */}
                <StoreMenuSection menus={formData.menuList} onMenuChange={handleMenuChange} />
                
                {/* 메뉴 추가하기 버튼 */}
                <AddItemButton onClick={handleAddMenu} variant="full">
                  메뉴 추가하기 +
                </AddItemButton>
                
                {/* BottomFixedButton 위에 여백 추가 */}
                <div className="h-38"></div>
            </div>
            
            {/* 등록 완료 버튼 - 하단 고정 */}
            <BottomFixedButton
                onClick={handleSubmit}
                disabled={!isFormValid() || isLoading}
                variant={isFormValid() && !isLoading ? "primary" : "disabled"}
            >
                {isLoading ? "등록 중..." : "가게 등록 완료"}
            </BottomFixedButton>
        </div>
    );
};

export default StoreRegistrationPage;
