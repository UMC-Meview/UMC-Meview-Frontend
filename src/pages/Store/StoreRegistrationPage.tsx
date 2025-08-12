import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import FixedFrameLayout from "../../layouts/FixedFrameLayout";
import BottomFixedButton from "../../components/common/Button/BottomFixedButton";
import StoreMenuSection from "../../components/store/StoreMenuSection";
import ErrorMessage from "../../components/common/ErrorMessage";
import StoreBasicInfoSection from "../../components/store/StoreBasicInfoSection";
import StoreAddressSection from "../../components/store/StoreAddressSection";
import StoreOperatingHoursSection from "../../components/store/StoreOperatingHoursSection";
import StoreImageSection from "../../components/store/StoreImageSection";
import { useStoreRegistration } from "../../hooks/queries/usePostStoreRegistration";
import { usePostMenuRegistration } from "../../hooks/queries/usePostMenuRegistration";
import { usePostImageUpload } from "../../hooks/queries/usePostImageUpload";
import { useStoreRegistrationForm } from "../../hooks/useStoreRegistrationForm";
import { StoreRegistrationRequest } from "../../types/store";
import { useKeyboardDetection } from "../../hooks/useKeyboardDetection";

const StoreRegistrationPage: React.FC = () => {
    const navigate = useNavigate();
    const { mutate, isLoading, isSuccess, data, error } = useStoreRegistration();
    const { registerMenuAsync } = usePostMenuRegistration();
    const { uploadImageAsync, isLoading: isImageUploading } = usePostImageUpload();
    const isKeyboardVisible = useKeyboardDetection();
    // 메뉴 이미지 업로드 프라미스 캐시
    const menuImageUploadCacheRef = useRef<Map<File, Promise<string | undefined>>>(new Map());

    const {
        formData,
        handleInputChange,
        updateCoordinates,
        handleMainImageSelect,
        handleReplaceMainImage,
        handleMenuChange,
        handleAddMenu,
        handleOpeningHourChange,
        handleAddOpeningHour,
        isFormValid,
    } = useStoreRegistrationForm();

    // 제출
    const handleSubmit = async () => {
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
                    address: formData.detailAddress 
                        ? `${formData.address.trim()} ${formData.detailAddress.trim()}`
                        : formData.address.trim(),
                    operatingHours: formData.openingHours.filter(hour => hour.trim() !== "").join(", ") || "영업시간 미정",
                    qrPrefix: "https://miview.com/stores/",
                };

                // 메뉴 이미지 선행 업로드(병렬)
                menuImageUploadCacheRef.current = new Map();
                formData.menuList.forEach((menu) => {
                    if (menu.image && !menuImageUploadCacheRef.current.has(menu.image)) {
                        const promise = uploadImageAsync(menu.image)
                            .then((res) => res.url)
                            .catch((e) => {
                                console.error("메뉴 이미지 선행 업로드 실패:", e);
                                return undefined;
                            });
                        menuImageUploadCacheRef.current.set(menu.image, promise);
                    }
                });

                if (formData.mainImages.length > 0) {
                    const uploadedMainImageUrls = await Promise.all(
                        formData.mainImages.map(async (file) => {
                            const result = await uploadImageAsync(file);
                            return result.url;
                        })
                    );
                    requestData.mainImage = uploadedMainImageUrls;
                }
                
                mutate(requestData);
            } catch (error) {
                console.error("이미지 처리 중 오류:", error);
                alert("이미지 처리 중 오류가 발생했습니다.");
            }
        } else {
            alert("필수 항목을 모두 입력해주세요.");
        }
    };

        // 등록 성공 시 메뉴 등록 → QR 페이지
    useEffect(() => {
        if (isSuccess && data) {
            // 유효 메뉴만 등록
            const validMenus = formData.menuList.filter(menu => 
                menu.name.trim() !== "" && menu.price.trim() !== ""
            );
            
            if (validMenus.length > 0) {
                // 메뉴 등록 병렬 처리
                const menuPromises = validMenus.map(async (menu) => {
                    // 선행 업로드 결과 재사용
                    let uploadedMenuImageUrl: string | undefined = undefined;
                    if (menu.image) {
                        const cached = menuImageUploadCacheRef.current.get(menu.image);
                        if (cached) {
                            try {
                                uploadedMenuImageUrl = await cached;
                            } catch (e) {
                                console.error("메뉴 이미지 캐시 업로드 결과 대기 중 오류:", e);
                            }
                        } else {
                            try {
                                const res = await uploadImageAsync(menu.image);
                                uploadedMenuImageUrl = res.url;
                            } catch (e) {
                                console.error("메뉴 이미지 업로드 실패, 이미지 없이 메뉴 등록 진행:", e);
                            }
                        }
                    }

                    const menuData = {
                        name: menu.name,
                        description: menu.detail || "상세 설명 없음",
                        price: parseInt(menu.price) || 0,
                        storeId: data._id,
                        image: uploadedMenuImageUrl,
                    };
                    return registerMenuAsync(menuData);
                });
                
                // 모두 완료 후 이동
                Promise.all(menuPromises)
                    .then(() => {
                        navigate(`/qrcode?qrCode=${encodeURIComponent(data.qrCodeBase64)}&storeId=${data._id}&storeName=${encodeURIComponent(data.name)}`);
                    })
                    .catch((error) => {
                        console.error("메뉴 등록 중 오류:", error);
                        // 실패해도 이동(가게는 등록됨)
                        navigate(`/qrcode?qrCode=${encodeURIComponent(data.qrCodeBase64)}&storeId=${data._id}&storeName=${encodeURIComponent(data.name)}`);
                    });
            } else {
                // 메뉴 없으면 바로 이동
                navigate(`/qrcode?qrCode=${encodeURIComponent(data.qrCodeBase64)}&storeId=${data._id}&storeName=${encodeURIComponent(data.name)}`);
            }
        }
    }, [isSuccess, data, navigate, formData.menuList, registerMenuAsync, uploadImageAsync]);

    const handleBack = () => navigate('/login');

    return (
        <FixedFrameLayout
            header={<Header onBack={handleBack} center="가게 등록하기" />}
            contentClassName="px-6"
        >
            {/* 에러 메시지 표시 */}
            {error && <ErrorMessage message={error} />}
            
            <div style={{ marginTop: "15px" }}>
                {/* 메인 이미지 섹션 */}
                <StoreImageSection
                    mainImages={formData.mainImages}
                    onImageSelect={handleMainImageSelect}
                    onReplaceImage={handleReplaceMainImage}
                    maxImages={3}
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
                    onAddressSelect={(address: string, postcode: string, latitude?: number, longitude?: number) => {
                        handleInputChange("address", address);
                        handleInputChange("postalCode", postcode);
                        // 위도/경도가 있으면 업데이트
                        if (latitude !== undefined && longitude !== undefined) {
                            updateCoordinates(latitude, longitude);
                            console.log(`좌표 업데이트됨 - 위도: ${latitude}, 경도: ${longitude}`);
                        }
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
                    disabled={!isFormValid() || isLoading || isImageUploading}
                    variant={isFormValid() && !isLoading && !isImageUploading ? "primary" : "disabled"}
                >
                    {isImageUploading ? "이미지 업로드 중..." : isLoading ? "등록 중..." : "가게 등록 완료"}
                </BottomFixedButton>
            )}
        </FixedFrameLayout>
    );
};

export default StoreRegistrationPage;
