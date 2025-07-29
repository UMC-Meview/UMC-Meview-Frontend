import { useGetFavoriteStores } from "../../hooks/queries/useGetFavoriteStores";
import StoreListSkeleton from "../../components/store/StoreListSkeleton";

const FavoritePage = () => {
    const { favoriteStores, loading, error } = useGetFavoriteStores();

    if (loading) return <StoreListSkeleton count={3} />;
    if (error) return <div>에러: {error}</div>;

    return (
        <div className="px-4 py-6 space-y-6">
            {favoriteStores.map((store) => (
                <div
                    key={store._id}
                    className="border-b border-gray-200 pb-6 last:border-b-0"
                ></div>
            ))}
        </div>
    );
};

export default FavoritePage;
