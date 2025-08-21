import React from 'react';
import { StoreDetail } from '../../types/store';
import StoreMarker from './StoreMarker';

interface StoreMarkerListProps {
    stores: StoreDetail[];
    loading: boolean;
    selectedStoreId: string;
    isExpanded: boolean;
    onMarkerClick: (storeId: string, lat: number, lng: number) => void;
}

// 마커 리스트 컴포넌트 - stores 배열 변경시만 리렌더링
const StoreMarkerList = React.memo<StoreMarkerListProps>(({ 
    stores, 
    loading, 
    selectedStoreId, 
    isExpanded, 
    onMarkerClick 
}) => {
    if (loading) return null;

    return (
        <>
            {stores.map((store) => (
                <StoreMarker
                    key={store._id}
                    store={store}
                    isSelected={isExpanded && selectedStoreId === store._id}
                    onMarkerClick={onMarkerClick}
                />
            ))}
        </>
    );
});

StoreMarkerList.displayName = 'StoreMarkerList';

export default StoreMarkerList;