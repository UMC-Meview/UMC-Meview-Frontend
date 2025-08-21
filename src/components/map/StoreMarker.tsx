import React from "react";
import { MapMarker } from "react-kakao-maps-sdk";
import { StoreDetail } from "../../types/store";

// 가게의 averagePositiveScore를 기반으로 레벨 생성 (1-5)
const getStoreLevel = (averagePositiveScore?: number): number => {
    if (!averagePositiveScore) return 1;
    if (averagePositiveScore >= 8) return 5;
    if (averagePositiveScore >= 6) return 4;
    if (averagePositiveScore >= 4) return 3;
    if (averagePositiveScore >= 2) return 2;
    return 1;
};

interface StoreMarkerProps {
    store: StoreDetail;
    isSelected: boolean;
    onMarkerClick: (storeId: string, lat: number, lng: number) => void;
}

// 메모화된 마커 컴포넌트
const StoreMarker = React.memo<StoreMarkerProps>(({ store, isSelected, onMarkerClick }) => {
    const level = getStoreLevel(store.averagePositiveScore);
    const markerSize = isSelected ? 60 : 40;
    const offsetX = isSelected ? 30 : 20;
    const offsetY = isSelected ? 60 : 40;

    const handleClick = React.useCallback(() => {
        onMarkerClick(
            store._id,
            store.location.coordinates[1],
            store.location.coordinates[0]
        );
    }, [store._id, store.location.coordinates, onMarkerClick]);

    return (
        <MapMarker
            position={{
                lat: store.location.coordinates[1],
                lng: store.location.coordinates[0],
            }}
            image={{
                src: `/mark/lv${level}.svg`,
                size: {
                    width: markerSize,
                    height: markerSize,
                },
                options: {
                    offset: {
                        x: offsetX,
                        y: offsetY,
                    },
                },
            }}
            clickable={true}
            onClick={handleClick}
        />
    );
});

StoreMarker.displayName = 'StoreMarker';

export default StoreMarker;