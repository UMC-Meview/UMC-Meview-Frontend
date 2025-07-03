import { Map, MapMarker } from "react-kakao-maps-sdk";
import SearchBar from "../../components/common/SearchBar";
import Footer from "../../components/common/Footer";

const Homepage = () => {
    const lat = 35.8457189028033;
    const lng = 127.12960348882953;
    return (
        <div className="relative w-full h-screen">
            <SearchBar />
            <Map
                center={{ lat, lng }}
                style={{ width: "100%", height: "100vh" }}
            >
                <MapMarker position={{ lat, lng }}>
                    {/* <div style={{ color: "#000" }}>Hello World!</div> */}
                </MapMarker>
            </Map>
            <Footer />
        </div>
    );
};

export default Homepage;
