import { Navigate, Outlet } from "react-router-dom";
import Footer from "../components/common/Footer";
import { isLoggedIn } from "../utils/auth";

/**
 * 인증이 필요한 페이지들을 위한 레이아웃 컴포넌트
 */
const ProtectedLayout = () => {
    if (!isLoggedIn()) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex flex-col">
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default ProtectedLayout;
