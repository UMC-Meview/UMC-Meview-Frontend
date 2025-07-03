import { Map, MapMarker } from "react-kakao-maps-sdk";
import Navbar from "../../components/common/Navbar";

const Homepage = () => {
    const lat = 35.8457189028033;
    const lng = 127.12960348882953;
    return (
        <div className="relative w-full h-screen">
            <Map
                center={{ lat, lng }}
                style={{ width: "100%", height: "100vh" }}
            >
                <MapMarker position={{ lat, lng }}>
                    {/* <div style={{ color: "#000" }}>Hello World!</div> */}
                </MapMarker>
            </Map>
            <Navbar />
        </div>
    );
};

export default Homepage;
