import React, { useState } from "react";
import {
  FilterAlt,
  RocketLaunch,
  CalendarToday,
  PeopleAlt
} from "@mui/icons-material";

interface FilterFloatingButtonProps {
  onFilterChange?: (filterType: string) => void;
}

const FilterFloatingButton: React.FC<FilterFloatingButtonProps> = ({ onFilterChange }) => {
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const handleFilterClick = (filterType: string) => {
    setOpenFilter(openFilter === filterType ? null : filterType);
    
    if (onFilterChange) {
      onFilterChange(filterType);
    }
  };

  const renderFilterModal = () => {
    if (!openFilter) return null;
    
    return (
      <div className="absolute top-14 left-0 w-64 bg-white shadow-md z-20 p-4">
        <div className="text-regular font-gmarket-bold text-bold">모달 제목: {openFilter}</div>
      </div>
    );
  };

  const TriangleIcon = () => (
    <svg 
      width="10" 
      height="6" 
      viewBox="0 0 10 6" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 6L0 0H10L5 6Z" />
    </svg>
  );

  return (
    <div className="absolute top-6 left-6 z-10 pointer-events-none">
      <div className="flex items-center gap-6 pointer-events-auto">
        <button
          className={`flex items-center gap-4 bg-white rounded-full border py-2 px-4 shadow-md ${
            openFilter === "기간" ? "border-bold text-bold" : "text-gray-600"
          }`}
          onClick={() => handleFilterClick("기간")}
        >
          <CalendarToday sx={{ fontSize: 24 }} />
          <span className="text-regular font-gmarket-bold text-bold">기간</span>
          <TriangleIcon />
        </button>

        <button
          className={`flex items-center gap-4 bg-white rounded-full border py-2 px-4 shadow-md ${
            openFilter === "스택" ? "border-bold text-bold" : "text-gray-600"
          }`}
          onClick={() => handleFilterClick("스택")}
        >
          <RocketLaunch sx={{ fontSize: 24 }} />
          <span className="text-regular font-gmarket-bold text-bold">스택</span>
          <TriangleIcon />
        </button>
        
        <button
          className={`flex items-center gap-4 bg-white rounded-full border py-2 px-4 shadow-md ${
            openFilter === "인원" ? "border-bold text-bold" : "text-gray-600"
          }`}
          onClick={() => handleFilterClick("인원")}
        >
          <PeopleAlt sx={{ fontSize: 24 }} />
          <span className="text-regular font-gmarket-bold text-bold">인원</span>
          <TriangleIcon />
        </button>

        <button
          className={`flex items-center gap-4 bg-white rounded-full border py-2 px-4 shadow-md ${
            openFilter === "지역" ? "border-bold text-bold" : "text-gray-600"
          }`}
          onClick={() => handleFilterClick("지역")}
        >
          <FilterAlt sx={{ fontSize: 24 }} />
          <span className="text-regular font-gmarket-bold text-bold">지역</span>
          <TriangleIcon />
        </button>
      </div>
      
      {renderFilterModal()}
    </div>
  );
};

export default FilterFloatingButton;