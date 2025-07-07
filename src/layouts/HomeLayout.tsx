import { Outlet } from "react-router-dom";
import Footer from "../components/common/Footer";

const HomeLayout = () => {
    return (
        <div className="flex flex-col">
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default HomeLayout;
