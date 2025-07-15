import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { useState } from "react";
import SearchBar from "../../components/common/SearchBar";
import Footer from "../../components/common/Footer";
import StoreBottomSheet from "../../components/store/StoreBottomSheet";
import { useGetStoresList } from "../../hooks/queries/useGetStoresList";

// 가게의 averagePositiveScore를 기반으로 레벨 생성 (1-5)
const getStoreLevel = (averagePositiveScore?: number): number => {
    if (!averagePositiveScore) return 1; // 점수가 없으면 기본 레벨 1

    // 0~10 점수를 5단계로 나누기
    if (averagePositiveScore >= 8) return 5;
    if (averagePositiveScore >= 6) return 4;
    if (averagePositiveScore >= 4) return 3;
    if (averagePositiveScore >= 2) return 2;
    return 1;
};

const Homepage = () => {
    const lat = 37.5665;
    const lng = 126.978;
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
                    const level = getStoreLevel(store.averagePositiveScore);
                    console.log(store.location.coordinates);
                    return (
                        <MapMarker
                            key={store._id}
                            position={{
                                lat: store.location.coordinates[1],
                                lng: store.location.coordinates[0],
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
