import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import FixedFrameLayout from "../../layouts/FixedFrameLayout";
import RankingItem from "../../components/store/RankingItem";
import { useRankingStores } from "../../hooks/queries/useGetStoreList";
import StoreListSkeleton from "../../components/store/StoreListSkeleton";

const RankingPage = () => {
    const navigate = useNavigate();
    const { stores, loading, error } = useRankingStores();

    const handleStoreClick = (storeId: string) => {
        navigate(`/stores/${storeId}`);
    };

    const calculateTotalScore = (
        positiveScore: number | undefined,
        negativeScore: number | undefined
    ) => {
        const positive = positiveScore || 0;
        const negative = negativeScore || 0;
        return positive - negative < 0 ? 0 : positive - negative;
    };

    return (
        <FixedFrameLayout
            header={<Header onBack={() => navigate("/")} center={"랭킹"} />}
        >
            <div className="bg-white">
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
                            image={
                                Array.isArray(store.mainImage)
                                    ? store.mainImage[0]
                                    : store.mainImage || ""
                            }
                            storeName={store.name}
                            category={store.category}
                            score={Math.round(
                                calculateTotalScore(
                                    store.totalPositiveScore,
                                    store.totalNegativeScore
                                )
                            )}
                            bonusAmount={store.totalPositiveScore || 0}
                            reviewCount={store.reviewCount || 0}
                            onClick={() => handleStoreClick(store._id)}
                        />
                    ))}
            </div>
        </FixedFrameLayout>
    );
};

export default RankingPage;
