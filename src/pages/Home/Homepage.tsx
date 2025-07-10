import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { useState } from "react";
import SearchBar from "../../components/common/SearchBar";
import Footer from "../../components/common/Footer";
import StoreBottomSheet from "../../components/store/StoreBottomSheet";
import { useGetStoresList } from "../../hooks/queries/useGetStoresList";

// 가게 ID를 기반으로 임시 레벨 생성 (1-5)
const getStoreLevel = (storeId: string): number => {
    let hash = 0;
    for (let i = 0; i < storeId.length; i++) {
        const char = storeId.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash % 5) + 1; // 1-5 사이의 값
};

const Homepage = () => {
    const lat = 35.84662;
    const lng = 127.136609;
    const [isBottomSheetFullScreen, setIsBottomSheetFullScreen] =
        useState(false);
    const [selectedStoreId, setSelectedStoreId] = useState<string>("");
    const [shouldExpandBottomSheet, setShouldExpandBottomSheet] =
        useState(false);

    // 가게 목록 가져오기
    const { stores } = useGetStoresList({
        latitude: lat,
        longitude: lng,
        radius: 2000,
    });

    const handleBottomSheetFullScreenChange = (isFullScreen: boolean) => {
        setIsBottomSheetFullScreen(isFullScreen);
    };

    const handleMarkerClick = (storeId: string) => {
        // 이미 선택된 가게라도 detail 모드로 전환하기 위해
        // 먼저 selectedStoreId를 초기화하고 다시 설정
        if (selectedStoreId === storeId) {
            setSelectedStoreId("");
            setTimeout(() => {
                setSelectedStoreId(storeId);
                setShouldExpandBottomSheet(true);
            }, 0);
        } else {
            setSelectedStoreId(storeId);
            setShouldExpandBottomSheet(true);
        }
    };

    const handleBottomSheetExpandedChange = (isExpanded: boolean) => {
        setShouldExpandBottomSheet(isExpanded);
        // 축소될 때 선택된 가게 초기화
        if (!isExpanded) {
            setSelectedStoreId("");
        }
    };

    // 카카오맵 로더 사용
    const [loading, error] = useKakaoLoader({
        appkey: import.meta.env.VITE_KAKAO_MAP_API_KEY,
    });

    // 카카오맵 로딩 중
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-gray-500">지도를 불러오는 중...</div>
            </div>
        );
    }

    // 카카오맵 로딩 에러
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500">
                    지도를 불러올 수 없습니다: {error.message}
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen">
            {!isBottomSheetFullScreen && <SearchBar />}
            <Map
                center={{ lat, lng }}
                style={{ width: "100%", height: "100vh" }}
            >
                {/* 가게 마커들 렌더링 */}
                {stores.map((store) => {
                    const level = getStoreLevel(store._id);
                    return (
                        <MapMarker
                            key={store._id}
                            position={{
                                lat: store.latitude,
                                lng: store.longitude,
                            }}
                            image={{
                                src: `/mark/lv${level}.svg`,
                                size: {
                                    width: 40,
                                    height: 40,
                                },
                                options: {
                                    offset: {
                                        x: 20,
                                        y: 40,
                                    },
                                },
                            }}
                            clickable={true}
                            onClick={() => handleMarkerClick(store._id)}
                        />
                    );
                })}
            </Map>
            <StoreBottomSheet
                onFullScreenChange={handleBottomSheetFullScreenChange}
                selectedStoreId={selectedStoreId}
                shouldExpand={shouldExpandBottomSheet}
                onExpandedChange={handleBottomSheetExpandedChange}
            />
            <Footer />
        </div>
    );
};

export default Homepage;
