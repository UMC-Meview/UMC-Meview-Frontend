import React, { useState } from "react";
import BottomSheet from "../common/BottomSheet";
import StoreList from "./StoreList";
import StoreDetail from "./StoreDetailCard";

interface StoreBottomSheetProps {
    onFullScreenChange: (isFullScreen: boolean) => void;
}

const StoreBottomSheet: React.FC<StoreBottomSheetProps> = ({
    onFullScreenChange,
}) => {
    const [mode, setMode] = useState<"list" | "detail">("list");
    const [selectedStoreId, setSelectedStoreId] = useState<string>("");

    const handleStoreSelect = (storeId: string) => {
        setSelectedStoreId(storeId);
        setMode("detail");
    };

    const handleBackToList = () => {
        setMode("list");
        setSelectedStoreId("");
    };

    const handleExpandedChange = () => {
        // 확장 상태가 변경될 때의 추가 로직이 필요한 경우 여기에 구현
    };

    return (
        <BottomSheet
            onFullScreenChange={onFullScreenChange}
            onExpandedChange={handleExpandedChange}
        >
            {mode === "list" ? (
                <StoreList onStoreSelect={handleStoreSelect} />
            ) : (
                <StoreDetail
                    storeId={selectedStoreId}
                    onBackToList={handleBackToList}
                />
            )}
        </BottomSheet>
    );
};

export default StoreBottomSheet;
