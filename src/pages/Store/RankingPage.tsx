import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import RankingItem from "../../components/store/RankingItem";
import { useRankingStores } from "../../hooks/queries/useGetStoreList";
import StoreListSkeleton from "../../components/store/StoreListSkeleton";

const RankingPage = () => {
    const navigate = useNavigate();
    const { stores, loading, error } = useRankingStores();

    const handleStoreClick = (storeId: string) => {
        navigate(`/store/${storeId}`);
    };

    return (
        <div className="h-screen bg-white flex flex-col mx-auto max-w-[450px]">
            {/* 헤더 - 고정 */}
            <div className="flex-shrink-0">
                <Header onBack={() => navigate("/")} center={"랭킹"} />
            </div>

            {/* 랭킹 리스트 */}
            <div className="flex-1 overflow-y-auto bg-white">
                {loading && (
                    <div className="px-4">
                        <StoreListSkeleton />
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
                                (store.averagePositiveScore || 0) -
                                    (store.averageNegativeScore || 0)
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
