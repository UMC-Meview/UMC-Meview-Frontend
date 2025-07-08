import { Search } from "lucide-react";
import { useState } from "react";

const SearchBar = () => {
    // 검색어 입력값 상태 관리
    const [searchValue, setSearchValue] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    return (
        <div
            className="absolute left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-sm"
            style={{
                top: `max(env(safe-area-inset-top, 0px) + 16px, 64px)`, // 아이폰 노치 및 다이나믹 아일랜드 대응
            }}
        >
            <div className="bg-white rounded-[24.5px] shadow-lg flex items-center px-4 w-full h-[40px]">
                <Search color="#FF694F" size={20} className="flex-shrink-0" />

                <input
                    type="text"
                    value={searchValue}
                    onChange={handleInputChange}
                    placeholder="검색어를 입력하세요"
                    className="flex-1 ml-3 outline-none text-gray-700 placeholder-gray-400 min-w-0"
                    autoFocus
                />
            </div>
        </div>
    );
};

export default SearchBar;
