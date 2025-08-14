import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
    keyword?: string;
}

const SearchBar = ({ keyword }: SearchBarProps) => {
    const navigate = useNavigate();

    const handleSearchBarClick = () => {
        navigate("/search");
    };

    return (
        <div className="absolute left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-sm top-[80px]">
            <div
                className="bg-white rounded-[24.5px] shadow-lg flex items-center px-4 w-full h-[40px] cursor-pointer hover:shadow-xl transition-shadow"
                onClick={handleSearchBarClick}
            >
                <Search color="#FF694F" size={20} className="flex-shrink-0" />
                <div
                    className={`flex-1 ml-3 min-w-0 ${
                        keyword ? "text-gray-700" : "text-gray-400"
                    }`}
                >
                    {keyword && keyword.trim().length > 0
                        ? keyword
                        : "검색어를 입력하세요"}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
