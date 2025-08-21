import { useCallback } from 'react';

interface MapNavigationProps {
    mapLevel: number;
    DEFAULT_MAP_LEVEL: number;
    setMapCenter: (center: { lat: number; lng: number }) => void;
    setHasMapMoved: (moved: boolean) => void;
}

export const useMapNavigation = ({
    mapLevel,
    DEFAULT_MAP_LEVEL,
    setMapCenter,
    setHasMapMoved,
}: MapNavigationProps) => {
    // 지도 중심만 이동하는 함수 (API 재요청 없음)
    const moveMapCenter = useCallback(
        (lat: number, lng: number) => {
            if (mapLevel <= DEFAULT_MAP_LEVEL + 2 && mapLevel >= DEFAULT_MAP_LEVEL) {
                setMapCenter({ lat: lat - 0.005, lng });
            }
            setHasMapMoved(false);
        },
        [mapLevel, DEFAULT_MAP_LEVEL, setMapCenter, setHasMapMoved]
    );

    // 검색 영역 이동 함수 (API 재요청 발생)
    const moveSearchLocation = useCallback(
        (lat: number, lng: number, setSearchLocation: (location: { lat: number; lng: number }) => void) => {
            setSearchLocation({ lat, lng });
            setHasMapMoved(false);
        },
        [setHasMapMoved]
    );

    return {
        moveMapCenter,
        moveSearchLocation,
    };
};