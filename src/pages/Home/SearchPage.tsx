import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/common/Button/BackButton";
import { Search, X } from "lucide-react";
import {
    useSearchStores,
    SearchStoresParams,
} from "../../hooks/queries/useSearchStores";

const SearchPage = () => {
    const navigate = useNavigate();
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchParams, setSearchParams] = useState<SearchStoresParams | null>(
        null
    );

    // 검색 hook 사용 (searchParams가 있을 때만 실행)
    const { stores, loading, error } = useSearchStores(
        searchParams || { keyword: "" },
        !!searchParams
    );

    // 컴포넌트 마운트 시 로컬 스토리지에서 최근 검색어 불러오기
    useEffect(() => {
        const saved = localStorage.getItem("recentSearches");
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // 디바운싱된 자동 검색 (입력값 변경 시 0.3초 후 검색)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchKeyword.trim()) {
                setSearchParams({ keyword: searchKeyword.trim() });
            } else {
                setSearchParams(null);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchKeyword]);

    // 검색어 삭제 함수
    const removeSearchItem = (indexToRemove: number) => {
        const updated = recentSearches.filter(
            (_, index) => index !== indexToRemove
        );
        setRecentSearches(updated);
        localStorage.setItem("recentSearches", JSON.stringify(updated));
    };

    // 의도적인 검색 실행 함수 (엔터키, 검색버튼 클릭 시 - 최근 검색어 저장)
    const handleIntentionalSearch = (keyword: string) => {
        if (!keyword.trim()) return;

        // 최근 검색어에 추가 (중복 제거)
        const updatedSearches = [
            keyword,
            ...recentSearches.filter((item) => item !== keyword),
        ].slice(0, 20); // 최대 10개까지만 저장

        setRecentSearches(updatedSearches);
        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

        // 검색 실행
        setSearchParams({ keyword: keyword.trim() });
    };

    // 엔터키 처리
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleIntentionalSearch(searchKeyword);
        }
    };

    // 최근 검색어 클릭 처리
    const handleRecentSearchClick = (keyword: string) => {
        setSearchKeyword(keyword);
        handleIntentionalSearch(keyword);
    };

    return (
        <div className="h-screen bg-white overflow-hidden">
            {/* 헤더 영역 */}
            <div className="header absolute left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm">
                <div className="flex items-center py-3 px-3">
                    <BackButton onClick={() => navigate("/")} />
                    <div className="bg-white rounded-[24.5px] shadow-lg flex items-center px-4 h-[40px] cursor-pointer hover:shadow-xl transition-shadow flex-1">
                        <input
                            type="text"
                            placeholder="장소, 메뉴, 지역 검색"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1 ml-3 outline-none text-gray-700 placeholder-gray-400"
                        />
                        <Search
                            color="#FF694F"
                            size={20}
                            className="flex-shrink-0 cursor-pointer"
                            onClick={() =>
                                handleIntentionalSearch(searchKeyword)
                            }
                        />
                    </div>
                </div>
            </div>

            {/* 메인 콘텐츠 영역 */}
            <div className="main-content-with-header px-4 max-w-sm mx-auto">
                {loading ? (
                    // 로딩 상태
                    <div className="flex justify-center items-center py-20">
                        <div className="text-gray-500">검색 중...</div>
                    </div>
                ) : searchParams ? (
                    // 검색 결과가 있을 때
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            '{searchParams.keyword}' 검색 결과 ({stores.length})
                        </h2>
                        {error ? (
                            <div className="text-red-500 text-center py-4">
                                {error}
                            </div>
                        ) : stores.length > 0 ? (
                            <div className="max-h-[calc(100vh-160px)] overflow-y-auto pb-4">
                                <div className="space-y-3">
                                    {stores.map((store) => (
                                        <div
                                            key={store._id}
                                            className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                                            onClick={() =>
                                                navigate(`/store/${store._id}`)
                                            }
                                        >
                                            <div className="flex items-start space-x-3">
                                                {store.mainImage && (
                                                    <img
                                                        src={store.mainImage}
                                                        alt={store.name}
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 mb-1">
                                                        {store.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mb-1">
                                                        {store.category}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {store.address}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="text-gray-500">
                                    검색 결과가 없습니다.
                                </div>
                            </div>
                        )}
                    </div>
                ) : recentSearches.length > 0 ? (
                    // 최근 검색어가 있을 때
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            최근 검색어
                        </h2>
                        <div className="space-y-0 max-h-[calc(100vh-160px)] overflow-y-auto pb-4">
                            {recentSearches.map((searchTerm, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between py-3 bg-white ${
                                        index !== recentSearches.length - 1
                                            ? "border-b border-gray-200"
                                            : ""
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <div
                                            className="flex items-center flex-1 cursor-pointer"
                                            onClick={() =>
                                                handleRecentSearchClick(
                                                    searchTerm
                                                )
                                            }
                                        >
                                            <div className="w-[30px] h-[30px] bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                                <img
                                                    src="/mark/skeleton-mark.svg"
                                                    alt="search"
                                                    className="w-full h-full p-0.5"
                                                />
                                            </div>
                                            <span className="text-gray-700 font-medium">
                                                {searchTerm}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeSearchItem(index)}
                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X
                                            size={16}
                                            className="text-gray-400"
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    // 최근 검색어가 없을 때
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Search size={24} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-center">
                            검색어를 입력하세요
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
