import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import RankingItem from "../../components/store/RankingItem";

const RankingPage = () => {
    const navigate = useNavigate();

    // 더미 랭킹 데이터
    const rankingData = [
        {
            id: "1",
            rank: 1,
            image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            storeName: "모토이시",
            category: "술집",
            score: 58293,
            bonusAmount: 63348,
            reviewCount: 12328,
        },
        {
            id: "2",
            rank: 2,
            image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            storeName: "모토이시",
            category: "술집",
            score: 45124,
            bonusAmount: 63348,
            reviewCount: 12328,
        },
        {
            id: "3",
            rank: 3,
            image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            storeName: "모토이시",
            category: "술집",
            score: 42156,
            bonusAmount: 63348,
            reviewCount: 12328,
        },
        {
            id: "4",
            rank: 4,
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            storeName: "모토이시",
            category: "술집",
            score: 42156,
            bonusAmount: 63348,
            reviewCount: 12328,
        },
    ];

    const handleStoreClick = (storeId: string) => {
        navigate(`/store/${storeId}`);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* 헤더 */}
            <Header onBack={() => navigate("/")} center={<div>랭킹</div>} />

            {/* 랭킹 리스트 */}
            <div className="bg-white">
                {rankingData.map((store) => (
                    <RankingItem
                        key={store.id}
                        rank={store.rank}
                        image={store.image}
                        storeName={store.storeName}
                        category={store.category}
                        score={store.score}
                        bonusAmount={store.bonusAmount}
                        reviewCount={store.reviewCount}
                        onClick={() => handleStoreClick(store.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default RankingPage;
