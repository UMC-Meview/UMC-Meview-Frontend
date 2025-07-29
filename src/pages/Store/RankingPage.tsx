import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import RankingItem from "../../components/store/RankingItem";
import { useRankingStores } from "../../hooks/queries/useGetStoreList";

const RankingPage = () => {
    const navigate = useNavigate();
    const { stores, loading, error } = useRankingStores();

    const handleStoreClick = (storeId: string) => {
        navigate(`/store/${storeId}`);
    };

    return (
        <div className="h-screen bg-white flex flex-col">
            {/* 헤더 - 고정 */}
            <div className="flex-shrink-0">
                <Header onBack={() => navigate("/")} center={<div>랭킹</div>} />
            </div>

            {/* 랭킹 리스트 */}
            <div className="flex-1 overflow-y-auto bg-white">
                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="text-gray-500">
                            랭킹을 불러오는 중...
                        </div>
                    </div>
                )}

                {error && (
                    <div className="flex justify-center items-center py-4">
                        <div className="text-red-500 text-sm">
                            {error}
                            <br />
                            <span className="text-gray-500 text-xs">
                                더미 데이터를 표시합니다.
                            </span>
                        </div>
                    </div>
                )}

                {!loading &&
                    stores.map((store, index) => (
                        <RankingItem
                            key={store._id}
                            rank={index + 1}
                            image={store.mainImage || ""}
                            storeName={store.name}
                            category={store.category}
                            score={Math.round(
                                ((store.averagePositiveScore || 0) -
                                    (store.averageNegativeScore || 0)) /
                                    (store.reviewCount || 1)
                            )}
                            bonusAmount={store.averagePositiveScore || 0}
                            reviewCount={store.reviewCount || 0}
                            onClick={() => handleStoreClick(store._id)}
                        />
                    ))}
            </div>
        </div>
    );
};

export default RankingPage;
