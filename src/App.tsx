import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import "./App.css";
import Homepage from "./pages/Home/Homepage";
import { RouteObject } from "react-router-dom";
import NotFoundPage from "./pages/Auth/NotFoundPage";
import ProtectedLayout from "./layouts/ProtectedLayout";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import FavoritePage from "./pages/Restaurant/FavoritePage";
import RankingPage from "./pages/Restaurant/RankingPage";
import ProfilePage from "./pages/Auth/ProfilePage";

// public Routes: 인증 없이 접근 가능
const publicRoutes: RouteObject[] = [
    {
        path: "/",
        element: <Homepage />,
        errorElement: <NotFoundPage />,
        children: [
            { index: true, element: <Homepage /> },
            // { path: "login", element: <LoginPage /> },
            // { path: "signup", element: <SignupPage /> },
            // { path: "qr", element: <QrPage /> },
            {
                path: "ranking",
                element: <RankingPage />,
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
