import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import BottomFixedButton from "../../components/common/Button/BottomFixedButton";
import StoreMenuSection from "../../components/store/StoreMenuSection";
import ErrorMessage from "../../components/common/ErrorMessage";
import StoreBasicInfoSection from "../../components/store/StoreBasicInfoSection";
import StoreAddressSection from "../../components/store/StoreAddressSection";
import StoreOperatingHoursSection from "../../components/store/StoreOperatingHoursSection";
import StoreImageSection from "../../components/store/StoreImageSection";
import { useStoreRegistration } from "../../hooks/queries/usePostStoreRegistration";
import { usePostMenuRegistration } from "../../hooks/queries/usePostMenuRegistration";
import { useStoreRegistrationForm } from "../../hooks/useStoreRegistrationForm";
import { StoreRegistrationRequest } from "../../types/store";
import { useKeyboardDetection } from "../../hooks/useKeyboardDetection";

const StoreRegistrationPage: React.FC = () => {
    const navigate = useNavigate();
    const { mutate, isLoading, isSuccess, data, error } = useStoreRegistration();
    const { registerMenu } = usePostMenuRegistration();
    const isKeyboardVisible = useKeyboardDetection();

    // 폼 상태 관리 훅 사용
    const {
        formData,
        handleInputChange,
        handleMainImageSelect,
        handleReplaceMainImage,
        handleMenuChange,
        handleAddMenu,
        handleOpeningHourChange,
        handleAddOpeningHour,
        getImageUrl,
        revokeImage,
        convertToBase64,
        isFormValid,
    } = useStoreRegistrationForm();

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
            
                            <div className="px-6 sm:px-8 md:px-10 lg:px-12 w-full max-w-screen-sm mx-auto" style={{ marginTop: "15px" }}>
                {/* 메인 이미지 섹션 */}
                <StoreImageSection
                    mainImages={formData.mainImages}
                    onImageSelect={handleMainImageSelect}
                    onReplaceImage={handleReplaceMainImage}
                    getImageUrl={getImageUrl}
                    revokeImage={revokeImage}
                />
                {/* 기본 정보 섹션 */}
                <StoreBasicInfoSection
                    storeName={formData.storeName}
                    category={formData.category}
                    description={formData.description}
                    onInputChange={handleInputChange}
                />
                {/* 주소 섹션 */}
                <StoreAddressSection
                    address={formData.address}
                    detailAddress={formData.detailAddress}
                    postalCode={formData.postalCode}
                    onInputChange={handleInputChange}
                    onAddressSelect={(address, postcode) => {
                        handleInputChange("address", address);
                        handleInputChange("postalCode", postcode);
                    }}
                />
                {/* 영업시간 섹션 */}
                <StoreOperatingHoursSection
                    openingHours={formData.openingHours}
                    onOpeningHourChange={handleOpeningHourChange}
                    onAddOpeningHour={handleAddOpeningHour}
                />
                {/* 메뉴판 사진 */}
                <StoreMenuSection 
                    menus={formData.menuList} 
                    onMenuChange={handleMenuChange}
                    onAddMenu={handleAddMenu}
                />
                {/* BottomFixedButton 위에 여백 추가 */}
                <div className="h-38"></div>
            </div>
            
            {/* 등록 완료 버튼 - 하단 고정 */}
            {!isKeyboardVisible && (
                <BottomFixedButton
                    onClick={handleSubmit}
                    disabled={!isFormValid() || isLoading}
                    variant={isFormValid() && !isLoading ? "primary" : "disabled"}
                >
                    {isLoading ? "등록 중..." : "가게 등록 완료"}
                </BottomFixedButton>
            )}
        </div>
    );
};

export default StoreRegistrationPage;
