import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useState } from "react";
import SearchBar from "../../components/common/SearchBar";
import Footer from "../../components/common/Footer";
import StoreBottomSheet from "../../components/store/StoreBottomSheet";

const Homepage = () => {
    const lat = 35.8457189028033;
    const lng = 127.12960348882953;
    const [isBottomSheetFullScreen, setIsBottomSheetFullScreen] =
        useState(false);

    const handleBottomSheetFullScreenChange = (isFullScreen: boolean) => {
        setIsBottomSheetFullScreen(isFullScreen);
    };

    return (
        <div className="relative w-full h-screen">
            {!isBottomSheetFullScreen && <SearchBar />}
            <Map
                center={{ lat, lng }}
                style={{ width: "100%", height: "100vh" }}
            >
                <MapMarker position={{ lat, lng }}>
                    {/* <div style={{ color: "#000" }}>Hello World!</div> */}
                </MapMarker>
            </Map>
            <StoreBottomSheet
                onFullScreenChange={handleBottomSheetFullScreenChange}
            />
            <Footer />
        </div>
    );
};

export default Homepage;
