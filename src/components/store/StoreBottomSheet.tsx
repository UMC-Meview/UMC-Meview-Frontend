import React, { useState, useEffect } from "react";
import BottomSheet, { BottomSheetContext } from "../common/BottomSheet";
import StoreList from "./StoreList";
import StoreDetailCard from "./StoreDetailCard";
import BottomSheetHeader from "../common/BottomSheetHeader";
import { StoreDetail } from "../../types/store";
import { ServerSortType } from "../../hooks/queries/useGetStoreList";

interface StoreBottomSheetProps {
    onFullScreenChange: (isFullScreen: boolean) => void;
    selectedStoreId?: string;
    shouldExpand?: boolean;
    onExpandedChange?: (isExpanded: boolean) => void;
    stores?: StoreDetail[];
    currentLocation?: { lat: number; lng: number };
    currentSortBy?: ServerSortType;
    onSortChange?: (sortBy: ServerSortType) => void;
    loading?: boolean; // 추가
    error?: string | null; // 추가
}

const StoreDetailContainer: React.FC<{
    storeId: string;
    onBackToList: () => void;
    bottomSheetContext?: BottomSheetContext;
}> = ({ storeId, onBackToList, bottomSheetContext }) => {
    return (
        <div className="flex flex-col h-full">
            <BottomSheetHeader onBack={onBackToList} />
            <StoreDetailCard
                storeId={storeId}
                bottomSheetContext={bottomSheetContext}
            />
        </div>
    );
};

const StoreBottomSheet: React.FC<StoreBottomSheetProps> = ({
    onFullScreenChange,
    selectedStoreId,
    shouldExpand = false,
    onExpandedChange,
    stores = [],
    currentLocation,
    currentSortBy = "positiveScore",
    onSortChange,
    loading = false,
    error = null,
}) => {
    const [mode, setMode] = useState<"list" | "detail">("list");
    const [internalSelectedStoreId, setInternalSelectedStoreId] =
        useState<string>("");

    // shouldExpand가 true가 되고 selectedStoreId가 있을 때도 detail 모드로 전환
    useEffect(() => {
        if (selectedStoreId) {
            setInternalSelectedStoreId(selectedStoreId);
            setMode("detail");
        }
    }, [shouldExpand, selectedStoreId]);

    const handleStoreSelect = (storeId: string) => {
        setInternalSelectedStoreId(storeId);
        setMode("detail");
    };

    const handleBackToList = () => {
        setMode("list");
        setInternalSelectedStoreId("");
    };

    const handleExpandedChange = (isExpanded: boolean) => {
        onExpandedChange?.(isExpanded);
        // 축소될 때 detail 모드에서 list 모드로 돌아가기
        if (!isExpanded && mode === "detail") {
            setMode("list");
            setInternalSelectedStoreId("");
        }
    };

    return (
        <BottomSheet
            onFullScreenChange={onFullScreenChange}
            onExpandedChange={handleExpandedChange}
            forceExpanded={shouldExpand}
        >
            {mode === "list" ? (
                <StoreList
                    onStoreSelect={handleStoreSelect}
                    stores={stores}
                    currentLocation={currentLocation}
                    currentSortBy={currentSortBy}
                    onSortChange={onSortChange}
                    loading={loading}
                    error={error}
                />
            ) : (
                <StoreDetailContainer
                    storeId={internalSelectedStoreId}
                    onBackToList={handleBackToList}
                />
            )}
        </BottomSheet>
    );
};

export default StoreBottomSheet;
