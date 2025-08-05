import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import "./App.css";
import Homepage from "./pages/Home/Homepage";
import SearchPage from "./pages/Home/SearchPage";
import { RouteObject } from "react-router-dom";
import NotFoundPage from "./pages/Auth/NotFoundPage";
import ProtectedLayout from "./layouts/ProtectedLayout";
import FavoritePage from "./pages/Store/FavoritePage";
import RankingPage from "./pages/Store/RankingPage";
import ProfilePage from "./pages/Auth/ProfilePage";
import StoreDetailPage from "./pages/Store/StoreDetailPage";
// import QRCodePage from "./pages/QR/QRCodePage";
import QRScanPage from "./pages/QR/QRScanPage";
import AuthMainPage from "./pages/Auth/AuthMainPage";
import SignupPage from "./pages/Auth/SignupPage";
import HomeLayout from "./layouts/HomeLayout";
import StoreRegistrationPage from "./pages/Store/StoreRegistrationPage";
import TastePreferencePage from "./pages/Auth/TastePreferencePage";
import ProfileInfoPage from "./pages/Auth/ProfileInfoPage";
import SignupCompletePage from "./pages/Auth/SignupCompletePage";
import ProfileEditPage from "./pages/Auth/ProfileEditPage";
import ReviewEntryPage from "./pages/Review/ReviewEntryPage";
import ReviewDetailPage from "./pages/Review/ReviewDetailPage";
import ReviewFeedbackPage from "./pages/Review/ReviewFeedbackPage";
import ReviewSatisfactionRatingPage from "./pages/Review/ReviewSatisfactionRatingPage";
import ReviewDissatisfactionRatingPage from "./pages/Review/ReviewDissatisfactionRatingPage";
import ReviewCompletePage from "./pages/Review/ReviewCompletePage";
import ReviewLoginPage from "./pages/Review/ReviewLoginPage";

// public Routes: 인증 없이 접근 가능
const publicRoutes: RouteObject[] = [
    {
        path: "/",
        element: <HomeLayout />,
        errorElement: <NotFoundPage />,
        children: [
            { index: true, element: <Homepage /> },
            { path: "search", element: <SearchPage /> },
            { path: "login", element: <AuthMainPage /> },
            { path: "signup", element: <SignupPage /> },
            { path: "qrcode", element: <QRScanPage /> },
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
            {
                path: "profile/edit",
                element: <ProfileEditPage />,
            },
            {
                path: "review/login",
                element: <ReviewLoginPage />,
            },
            {
                path: "review/entry",
                element: <ReviewEntryPage />,
            },
            {
                path: "review/detail",
                element: <ReviewDetailPage />,
            },
            {
                path: "review/feedback",
                element: <ReviewFeedbackPage />,
            },
            {
                path: "review/satisfaction-rating",
                element: <ReviewSatisfactionRatingPage />,
            },
            {
                path: "review/dissatisfaction-rating",
                element: <ReviewDissatisfactionRatingPage />,
            },
            {
                path: "review/complete",
                element: <ReviewCompletePage />,
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
                path: "stores/:storeId",
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
