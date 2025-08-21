import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { useEffect, useMemo, useState, useRef } from "react";
import SearchBar from "../../components/common/SearchBar";
import Footer from "../../components/common/Footer";
import StoreBottomSheet from "../../components/store/StoreBottomSheet";
import { useHomeStores } from "../../hooks/queries/useGetStoreList";
import { SortType } from "../../types/store";
import { RotateCwIcon } from "lucide-react";
import { useCallback } from "react";
import { useLocation } from "react-router-dom";

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
    const initialLat = 37.545377367170566;
    const initialLng = 126.95256128269644;
    const DEFAULT_MAP_LEVEL = 5;

    // URL 쿼리에서 keyword 읽기 (항상 최상단에서 훅 호출)
    const location = useLocation();
    const keywordFromQuery = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return params.get("keyword") || "";
    }, [location.search]);

    // 현재 검색 기준 위치 (실제 데이터를 가져오는 기준)
    const [searchLocation, setSearchLocation] = useState({
        lat: initialLat,
        lng: initialLng,
    });

    // 지도의 현재 중심점 (사용자가 이동시킨 위치) 및 반경(km)
    const [mapCenter, setMapCenter] = useState({
        lat: initialLat,
        lng: initialLng,
    });
    const [mapLevel, setMapLevel] = useState<number>(DEFAULT_MAP_LEVEL); // 기본 확대 레벨
    const [mapRadiusKm, setMapRadiusKm] = useState<number | undefined>(
        undefined
    );
    const [pendingCenter, setPendingCenter] = useState({
        lat: initialLat,
        lng: initialLng,
    });
    const [pendingRadiusKm, setPendingRadiusKm] = useState<number | undefined>(
        undefined
    );

    // 지도가 이동했는지 여부 (재검색 버튼 표시용)
    const [hasMapMoved, setHasMapMoved] = useState(false);

    const [isBottomSheetFullScreen, setIsBottomSheetFullScreen] =
        useState(false);
    const [selectedStoreId, setSelectedStoreId] = useState<string>("");
    const [shouldExpandBottomSheet, setShouldExpandBottomSheet] =
        useState(false);
    const [hasAppliedExpandFromQuery, setHasAppliedExpandFromQuery] =
        useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // 정렬 기준 상태 추가
    const [currentSortBy, setCurrentSortBy] =
        useState<SortType>("positiveScore");

    // 검색 유입 시 BottomSheet 자동 확장 처리 쿼리 파싱
    const shouldExpandByQuery = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return params.get("expand") === "1";
    }, [location.search]);

    useEffect(() => {
        if (shouldExpandByQuery && !hasAppliedExpandFromQuery) {
            setShouldExpandBottomSheet(true);
            setHasAppliedExpandFromQuery(true);
        }
    }, [shouldExpandByQuery, hasAppliedExpandFromQuery]);

    useEffect(() => {
        if (hasAppliedExpandFromQuery && shouldExpandBottomSheet) {
            setShouldExpandBottomSheet(false);
        }
    }, [hasAppliedExpandFromQuery, shouldExpandBottomSheet]);

    const DEFAULT_RADIUS_KM = 3; // 초기/미지정 반경 기본값

    // 가게 목록 가져오기 (검색 기준 위치 + 정렬 기준 + 키워드)
    const { stores, loading, error } = useHomeStores(
        currentSortBy,
        {
            latitude: searchLocation.lat,
            longitude: searchLocation.lng,
            radius: mapRadiusKm ?? DEFAULT_RADIUS_KM,
        },
        true,
        keywordFromQuery
    );

    // 가게 클릭 시 지도 이동 함수
    const moveToStore = useCallback(
        (lat: number, lng: number) => {
            console.log(mapLevel);
            if (
                mapLevel <= DEFAULT_MAP_LEVEL + 2 &&
                mapLevel >= DEFAULT_MAP_LEVEL
            ) {
                setMapCenter({ lat: lat - 0.005, lng });
            }
            setSearchLocation({ lat: lat, lng });
            setHasMapMoved(false);
        },
        [mapLevel]
    );

    // 키워드 검색 결과의 첫 가게 위치로 지도 자동 이동
    const lastCenteredKeywordRef = useRef<string | null>(null);
    useEffect(() => {
        if (!keywordFromQuery) {
            lastCenteredKeywordRef.current = null;
            return;
        }
        if (loading) return;
        if (!stores || stores.length === 0) return;
        if (lastCenteredKeywordRef.current === keywordFromQuery) return;

        const params = new URLSearchParams(location.search);
        const latParam = params.get("lat");
        const lngParam = params.get("lng");
        if (latParam && lngParam) return; // 좌표 지정 진입은 유지

        const [lng, lat] = stores[0].location.coordinates || [];
        if (lat !== undefined && lng !== undefined) {
            setMapLevel(DEFAULT_MAP_LEVEL);
            moveToStore(lat, lng);
            lastCenteredKeywordRef.current = keywordFromQuery;
        }
    }, [keywordFromQuery, stores, loading, location.search, moveToStore]);

    // 쿼리의 lat/lng가 있으면 홈 진입 시 해당 위치로 지도 이동
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const latParam = params.get("lat");
        const lngParam = params.get("lng");
        const levelParam = params.get("level");
        if (latParam && lngParam) {
            const lat = parseFloat(latParam);
            const lng = parseFloat(lngParam);
            if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
                moveToStore(lat, lng);
            }
        }
        if (levelParam) {
            const lv = parseInt(levelParam);
            if (!Number.isNaN(lv)) {
                setMapLevel(lv);
            }
        }
    }, [location.search, moveToStore]);

    const handleBottomSheetFullScreenChange = (isFullScreen: boolean) => {
        setIsBottomSheetFullScreen(isFullScreen);
    };

    const handleMarkerClick = (storeId: string, lat?: number, lng?: number) => {
        setSelectedStoreId(storeId);
        if (!isExpanded) {
            setShouldExpandBottomSheet(true);
        }

        if (lat !== undefined && lng !== undefined) {
            moveToStore(lat, lng);
        }
    };

    const handleBottomSheetExpandedChange = (expanded: boolean) => {
        setIsExpanded(expanded);
        if (expanded && shouldExpandBottomSheet) {
            setShouldExpandBottomSheet(false);
        }
        if (expanded && selectedStoreId) {
            const store = stores.find((s) => s._id === selectedStoreId);
            if (store?.location?.coordinates) {
                const [lng, lat] = store.location.coordinates;
                moveToStore(lat, lng);
            }
        }
        if (!expanded) {
            setSelectedStoreId("");
        }
    };

    const calculateRadiusKmFromBounds = (
        bounds: kakao.maps.LatLngBounds,
        center: { lat: number; lng: number }
    ) => {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const R = 6371e3;
        const toRad = (deg: number) => (deg * Math.PI) / 180;

        // 중심에서 북쪽/남쪽까지의 반경(세로), 동쪽/서쪽까지의 반경(가로)을 계산
        const north = { lat: ne.getLat(), lng: center.lng };
        const south = { lat: sw.getLat(), lng: center.lng };
        const east = { lat: center.lat, lng: ne.getLng() };
        const west = { lat: center.lat, lng: sw.getLng() };

        const haversine = (
            aLat: number,
            aLng: number,
            bLat: number,
            bLng: number
        ) => {
            const dLat = toRad(bLat - aLat);
            const dLng = toRad(bLng - aLng);
            const A =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(aLat)) *
                    Math.cos(toRad(bLat)) *
                    Math.sin(dLng / 2) *
                    Math.sin(dLng / 2);
            const C = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1 - A));
            return R * C; // meters
        };

        const verticalRadiusM = Math.max(
            haversine(center.lat, center.lng, north.lat, north.lng),
            haversine(center.lat, center.lng, south.lat, south.lng)
        );
        const horizontalRadiusM = Math.max(
            haversine(center.lat, center.lng, east.lat, east.lng),
            haversine(center.lat, center.lng, west.lat, west.lng)
        );

        const radiusMeters = Math.max(verticalRadiusM, horizontalRadiusM);
        return radiusMeters / 1000; // km
    };

    const handleBoundsOrDragChanged = (map: kakao.maps.Map) => {
        const center = map.getCenter();
        const newLat = center.getLat();
        const newLng = center.getLng();
        setMapCenter({ lat: newLat, lng: newLng });

        const bounds = map.getBounds();
        if (bounds) {
            const radiusKm = calculateRadiusKmFromBounds(bounds, {
                lat: newLat,
                lng: newLng,
            });
            setPendingRadiusKm(radiusKm);
        }
        setPendingCenter({ lat: newLat, lng: newLng });

        const distance = Math.sqrt(
            Math.pow(newLat - searchLocation.lat, 2) +
                Math.pow(newLng - searchLocation.lng, 2)
        );
        const shouldShow = distance > 0.001;
        setHasMapMoved(shouldShow);
    };

    const handleZoomChanged = (map: kakao.maps.Map) => {
        // console.log(map.getLevel());

        const center = map.getCenter();
        const newLat = center.getLat();
        const newLng = center.getLng();
        setMapCenter({ lat: newLat, lng: newLng });

        const bounds = map.getBounds();
        if (bounds) {
            const radiusKm = calculateRadiusKmFromBounds(bounds, {
                lat: newLat,
                lng: newLng,
            });
            setMapRadiusKm(radiusKm);
        }

        setSearchLocation({ lat: newLat, lng: newLng });
        setMapLevel(map.getLevel());
        setHasMapMoved(false);
    };

    // 재검색 버튼 클릭 핸들러
    const handleResearch = () => {
        // 보류해 둔 중심/반경을 실제 검색 기준으로 확정
        setSearchLocation({ lat: pendingCenter.lat, lng: pendingCenter.lng });
        setMapRadiusKm(pendingRadiusKm);
        setHasMapMoved(false);
    };

    // 정렬 변경 핸들러
    const handleSortChange = (newSortBy: SortType) => {
        setCurrentSortBy(newSortBy);
    };

    // 카카오맵 로더 사용
    const [mapLoading, mapError] = useKakaoLoader({
        appkey: import.meta.env.VITE_KAKAO_MAP_API_KEY,
    });

    // 카카오맵 로딩 중
    if (mapLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-gray-500">지도를 불러오는 중...</div>
            </div>
        );
    }

    // 카카오맵 로딩 에러
    if (mapError) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500">
                    지도를 불러올 수 없습니다: {mapError.message}
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen">
            {!isBottomSheetFullScreen && (
                <SearchBar keyword={keywordFromQuery} />
            )}

            {/* 재검색 버튼 */}
            {hasMapMoved && !isBottomSheetFullScreen && (
                <div
                    className="fixed top-[130px] left-1/2 transform -translate-x-1/2 z-50"
                    style={{ zIndex: 9999 }}
                >
                    <button
                        onClick={handleResearch}
                        className="bg-white text-black py-[5px] px-3 rounded-full shadow-xl cursor-pointer text-sm flex items-center gap-1"
                        style={{
                            boxShadow:
                                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        }}
                    >
                        <RotateCwIcon size={16} className="text-gray-700" />
                        <p className="text-gray-700">이 지역 재검색</p>
                    </button>
                </div>
            )}

            <Map
                center={{ lat: mapCenter.lat, lng: mapCenter.lng }}
                style={{ width: "100%", height: "100vh" }}
                level={mapLevel}
                onBoundsChanged={handleBoundsOrDragChanged}
                onDragEnd={handleBoundsOrDragChanged}
                onZoomChanged={handleZoomChanged}
            >
                {/* 가게 마커들 렌더링 - 로딩 중이 아닐 때만 표시 */}
                {!loading &&
                    stores.map((store) => {
                        const level = getStoreLevel(store.averagePositiveScore);
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
                                onClick={() =>
                                    handleMarkerClick(
                                        store._id,
                                        store.location.coordinates[1],
                                        store.location.coordinates[0]
                                    )
                                }
                            />
                        );
                    })}
            </Map>
            <StoreBottomSheet
                onFullScreenChange={handleBottomSheetFullScreenChange}
                selectedStoreId={selectedStoreId}
                shouldExpand={shouldExpandBottomSheet}
                onExpandedChange={handleBottomSheetExpandedChange}
                stores={stores}
                currentLocation={searchLocation}
                currentSortBy={currentSortBy}
                onSortChange={handleSortChange}
                loading={loading}
                error={error}
                onStoreLocationMove={moveToStore}
            />
            <Footer />
        </div>
    );
};

export default Homepage;
