import { Outlet } from "react-router-dom";

const HomeLayout = () => {
    return (
        <div className="flex flex-col">
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default HomeLayout;
