import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import "./App.css";
import Homepage from "./pages/Home/Homepage";
import { RouteObject } from "react-router-dom";
import NotFoundPage from "./pages/Auth/NotFoundPage";
import ProtectedLayout from "./layouts/ProtectedLayout";
import FavoritePage from "./pages/Store/FavoritePage";
import RankingPage from "./pages/Store/RankingPage";
import ProfilePage from "./pages/Auth/ProfilePage";
import StoreDetailPage from "./pages/Store/StoreDetailPage";
import QRCodePage from "./pages/QR/QRCodePage";
import AuthMainPage from "./pages/Auth/AuthMainPage";
import SignupPage from "./pages/Auth/SignupPage";
import HomeLayout from "./layouts/HomeLayout";
import StoreRegistrationPage from "./pages/Store/StoreRegistrationPage";
import TastePreferencePage from "./pages/Auth/TastePreferencePage";
import ProfileInfoPage from "./pages/Auth/ProfileInfoPage";
import SignupCompletePage from "./pages/Auth/SignupCompletePage";

// public Routes: 인증 없이 접근 가능
const publicRoutes: RouteObject[] = [
    {
        path: "/",
        element: <HomeLayout />,
        errorElement: <NotFoundPage />,
        children: [
            { index: true, element: <Homepage /> },
            { path: "login", element: <AuthMainPage /> },
            { path: "signup", element: <SignupPage /> },
            { path: "qrcode", element: <QRCodePage /> },
            {
                path: "ranking",
                element: <RankingPage />,
            },
            {
                path: "store-registration",
                element: <StoreRegistrationPage />,
            },
            {
                path: "taste-preference",
                element: <TastePreferencePage />,
            },
            {
                path: "profile-info",
                element: <ProfileInfoPage />,
            },
            {
                path: "signup-complete",
                element: <SignupCompletePage />,
            },
        ],
    },
];

// protected Routes: 인증이 필요한 라우트
const protectedRoutes: RouteObject[] = [
    {
        path: "/",
        element: <ProtectedLayout />,
        errorElement: <NotFoundPage />,
        children: [
            {
                path: "favorite",
                element: <FavoritePage />,
            },

            {
                path: "profile",
                element: <ProfilePage />,
            },
            {
                path: "store/:storeId",
                element: <StoreDetailPage />,
            },
        ],
    },
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            {/* {import.meta.env.DEV && (
                    <ReactQueryDevtools initialIsOpen={false} />
                )} */}
        </QueryClientProvider>
    );
}

export default App;
