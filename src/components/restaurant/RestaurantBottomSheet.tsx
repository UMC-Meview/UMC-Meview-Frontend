import React, { useState } from "react";
import BottomSheet from "../common/BottomSheet";
import RestaurantList from "./RestaurantList";
import RestaurantDetail from "./RestaurantDetail";

interface RestaurantBottomSheetProps {
    onFullScreenChange: (isFullScreen: boolean) => void;
}

const RestaurantBottomSheet: React.FC<RestaurantBottomSheetProps> = ({
    onFullScreenChange,
}) => {
    const [mode, setMode] = useState<"list" | "detail">("list");
    const [selectedRestaurantId, setSelectedRestaurantId] =
        useState<string>("");

    const handleRestaurantSelect = (restaurantId: string) => {
        setSelectedRestaurantId(restaurantId);
        setMode("detail");
    };

    const handleBackToList = () => {
        setMode("list");
        setSelectedRestaurantId("");
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
                <RestaurantList onRestaurantSelect={handleRestaurantSelect} />
            ) : (
                <RestaurantDetail
                    restaurantId={selectedRestaurantId}
                    onBackToList={handleBackToList}
                />
            )}
        </BottomSheet>
    );
};

export default RestaurantBottomSheet;
