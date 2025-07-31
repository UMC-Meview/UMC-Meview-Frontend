import { useGetFavoriteStores } from "../../hooks/queries/useGetFavoriteStores";
import StoreDetailCard from "../../components/store/StoreDetailCard";
import Header from "../../components/common/Header";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Heart } from "lucide-react";

const FavoritePage = () => {
    const { favoriteStores, loading, error } = useGetFavoriteStores();
    const navigate = useNavigate();

    return (
        <div className="bg-white mx-auto max-w-[390px]">
            {/* 고정 헤더 */}
            <div className="sticky top-0 z-30 bg-white">
                <Header
                    onBack={() => navigate("/")}
                    center={`나의 찜 ${loading ? "" : favoriteStores.length}`}
                />
            </div>

            {/* 콘텐츠 영역 - 푸터 높이만큼 확실히 제외 */}
            <div
                className="overflow-y-auto"
                style={{
                    height: "calc(100vh - 180px)", // 화면 전체 - 헤더 - 푸터
                    maxHeight: "calc(100vh - 180px)",
                }}
            >
                <>
                    {error && (
                        <div className="flex flex-col items-center justify-center py-6 px-4 bg-red-50 mx-4 mt-4 rounded-lg">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-3">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                            <div className="text-center">
                                <p className="text-gray-900 font-medium mb-1">
                                    데이터를 불러올 수 없습니다
                                </p>
                                <p className="text-gray-500 text-sm">
                                    임시로 더미 데이터를 표시합니다
                                </p>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="px-4 py-6 space-y-6 text-center text-gray-500">
                            <p>Loading...</p>
                        </div>
                    ) : favoriteStores.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <Heart
                                className="w-16 h-16 mb-4"
                                stroke="#FF694F"
                            />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">
                                아직 찜한 가게가 없어요
                            </h3>
                        </div>
                    ) : (
                        <div className="px-4 py-6 space-y-6">
                            {favoriteStores.map((store) => (
                                <div
                                    key={store._id}
                                    className="border-b border-gray-200 last:border-b-0"
                                >
                                    <StoreDetailCard storeId={store._id} />
                                </div>
                            ))}
                        </div>
                    )}
                </>
            </div>
        </div>
    );
};

export default FavoritePage;
