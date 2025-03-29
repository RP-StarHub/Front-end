import React, { useState, useEffect } from "react";
import {
  FilterAlt,
  RocketLaunch,
  CalendarToday,
  PeopleAlt
} from "@mui/icons-material";
import MainDurationModal from "./modals/MainDurationModal";
import MainTechStackModal from "./modals/MainTechStackModal";
import MainParticipantsModal from "./modals/MainParticipantsModal";
import MainLocationModal from "./modals/MainLocationModal";
import { DURATION } from "../../types/models/meeting";
import { preloadLocationData, SelectedLocation } from "../../util/locationUtils";
import useMapStore from "../../store/mapStore";

interface FilterFloatingButtonProps {
  onFilterChange?: (filterType: string, values?: any) => void;
}

/**
 * 메인 페이지 필터 버튼 컴포넌트
 * 기간, 기술 스택, 인원, 지역 필터링을 위한 플로팅 버튼 UI
 */
const FilterFloatingButton: React.FC<FilterFloatingButtonProps> = ({ onFilterChange }) => {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // 필터 상태들
  const filters = useMapStore(state => state.filters);
  const setDurations = useMapStore(state => state.setDurations);
  const setTechStacks = useMapStore(state => state.setTechStacks);
  const setParticipants = useMapStore(state => state.setParticipants);
  const setLocation = useMapStore(state => state.setLocation);

  useEffect(() => {
    preloadLocationData();
  }, []);

  const handleFilterClick = (e: React.MouseEvent<HTMLButtonElement>, filterType: string) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setOpenFilter(openFilter === filterType ? null : filterType);

    if (onFilterChange) {
      onFilterChange(filterType);
    }
  };

  const handleCloseModal = () => {
    setOpenFilter(null);
    setAnchorEl(null);
  };

  const handleDurationSelect = (duration: DURATION | null) => {
    setDurations(duration);
    
    if (onFilterChange) {
      onFilterChange("기간", duration);
    }
  };

  const handleTechStackSelect = (techStacks: number[]) => {
    setTechStacks(techStacks);
    
    if (onFilterChange) {
      onFilterChange("스택", techStacks);
    }
  };

  const handleParticipantsSelect = (minParticipants: number, maxParticipants: number) => {
    setParticipants(minParticipants, maxParticipants);
    
    if (onFilterChange) {
      onFilterChange("인원", { minParticipants, maxParticipants });
    }
  };

  const handleLocationSelect = (location: SelectedLocation) => {
    setLocation(location);
    
    if (onFilterChange) {
      onFilterChange("지역", location);
    }
  };

  // 지역 버튼 라벨 생성('시도명' 형식으로 표기)
  const getLocationButtonLabel = () => {
    if (filters?.location && 
        filters.location.selectedSido && 
        filters.location.selectedSigunguList && 
        filters.location.selectedSigunguList.length > 0) {
      return `${filters.location.selectedSido} (${filters.location.selectedSigunguList.length})`;
    }
    return "지역";
  };

  const isDurationActive = !!filters?.duration;
  const isTechStackActive = filters?.techStacks && filters.techStacks.length > 0;
  const isParticipantsActive = filters?.minParticipants !== 1 || filters?.maxParticipants !== 5;
  const isLocationActive = filters?.location && 
                          !!filters.location.selectedSido && 
                          filters.location.selectedSigunguList && 
                          filters.location.selectedSigunguList.length > 0;

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
    <div className="absolute top-6 left-6 z-40 pointer-events-none">
      <div className="flex items-center gap-6 pointer-events-auto">
        <button
          className={`flex items-center gap-4 bg-white rounded-full border py-2 px-4 shadow-md 
            ${openFilter === "기간" ? "border-bold text-bold" : "text-gray-600"}
            ${isDurationActive ? "border-main text-main" : ""}`}
          onClick={(e) => handleFilterClick(e, "기간")}
        >
          <CalendarToday sx={{ fontSize: 24 }} />
          <span className="text-regular font-gmarket-bold text-bold">기간</span>
          <TriangleIcon />
        </button>

        <button
          className={`flex items-center gap-4 bg-white rounded-full border py-2 px-4 shadow-md
            ${openFilter === "스택" ? "border-bold text-bold" : "text-gray-600"}
            ${isTechStackActive ? "border-main text-main" : ""}`}
          onClick={(e) => handleFilterClick(e, "스택")}
        >
          <RocketLaunch sx={{ fontSize: 24 }} />
          <span className="text-regular font-gmarket-bold text-bold">스택</span>
          <TriangleIcon />
        </button>

        <button
          className={`flex items-center gap-4 bg-white rounded-full border py-2 px-4 shadow-md 
            ${openFilter === "인원" ? "border-bold text-bold" : "text-gray-600"}
            ${isParticipantsActive ? "border-main text-main" : ""}`}
          onClick={(e) => handleFilterClick(e, "인원")}
        >
          <PeopleAlt sx={{ fontSize: 24 }} />
          <span className="text-regular font-gmarket-bold text-bold">인원</span>
          <TriangleIcon />
        </button>

        <button
          className={`flex items-center gap-4 bg-white rounded-full border py-2 px-4 shadow-md 
            ${openFilter === "지역" ? "border-bold text-bold" : "text-gray-600"}
            ${isLocationActive ? "border-main text-main" : ""}`}
          onClick={(e) => handleFilterClick(e, "지역")}
        >
          <FilterAlt sx={{ fontSize: 24 }} />
          <span className="text-regular font-gmarket-bold text-bold">
            {getLocationButtonLabel()}
          </span>
          <TriangleIcon />
        </button>
      </div>

      {openFilter === "기간" && (
        <MainDurationModal
          isOpen={true}
          onClose={handleCloseModal}
          onSelect={handleDurationSelect}
          selectedDuration={filters?.duration || null}
          anchorEl={anchorEl}
        />
      )}

      {openFilter === "스택" && (
        <MainTechStackModal
          isOpen={true}
          onClose={handleCloseModal}
          onSelect={handleTechStackSelect}
          selectedTechStacks={filters?.techStacks || []}
          anchorEl={anchorEl}
        />
      )}

      {openFilter === "인원" && (
        <MainParticipantsModal
          isOpen={true}
          onClose={handleCloseModal}
          onSelect={handleParticipantsSelect}
          selectedParticipants={{ 
            min: filters?.minParticipants || 1, 
            max: filters?.maxParticipants || 5 
          }}
          anchorEl={anchorEl}
        />
      )}

      {openFilter === "지역" && (
        <MainLocationModal
          isOpen={true}
          onClose={handleCloseModal}
          onSelect={handleLocationSelect}
          selectedLocation={filters?.location || { selectedSido: '', selectedSigunguList: [] }}
          anchorEl={anchorEl}
        />
      )}
    </div>
  );
};

export default FilterFloatingButton;