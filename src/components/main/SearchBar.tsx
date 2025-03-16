import React, { useState } from "react";
import { Search } from "@mui/icons-material";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSearch} className="w-full relative">
      <div className="flex items-center w-full">
        <input
          type="text"
          placeholder="제목으로 검색하기"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-3 px-4 bg-white rounded-lg border border-main text-regular outline-none"
        />
        <button
          type="submit"
          className="absolute right-4"
          aria-label="Search"
        >
          <Search className="text-sub" sx={{ fontSize: 24 }} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;