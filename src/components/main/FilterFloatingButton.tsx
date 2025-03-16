import React, { useState } from "react";
import {
  FilterAlt,
  RocketLaunch,
  CalendarToday,
  PeopleAlt
} from "@mui/icons-material";
import MainDurationModal from "./modals/MainDurationModal";
import MainTechStackModal from "./modals/MainTechStackModal";
import MainParticipantsModal from "./modals/MainParticipantsModal";
import { DURATION } from "../../types/models/meeting";

interface FilterFloatingButtonProps {
  onFilterChange?: (filterType: string, values?: any) => void;
}

const FilterFloatingButton: React.FC<FilterFloatingButtonProps> = ({ onFilterChange }) => {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // 필터 상태들
  const [selectedDurations, setSelectedDurations] = useState<DURATION[]>([]);
  const [selectedTechStacks, setSelectedTechStacks] = useState<{
    selectedIds: number[],
    customStacks: string[]
  }>({ selectedIds: [], customStacks: [] });
  const [selectedParticipants, setSelectedParticipants] = useState<{
    min: number,
    max: number
  }>({ min: 1, max: 5 });

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

  // 필터 선택 핸들러들
  const handleDurationSelect = (durations: DURATION[]) => {
    setSelectedDurations(durations);
    if (onFilterChange) {
      onFilterChange("기간", durations);
    }
  };

  const handleTechStackSelect = (techStacks: { selectedIds: number[], customStacks: string[] }) => {
    setSelectedTechStacks(techStacks);
    if (onFilterChange) {
      onFilterChange("스택", techStacks);
    }
  };

  const handleParticipantsSelect = (participants: { min: number, max: number }) => {
    setSelectedParticipants(participants);
    if (onFilterChange) {
      onFilterChange("인원", participants);
    }
  };

  // 기존 더미 모달 렌더링 함수
  const renderFilterModal = () => {
    if (!openFilter || openFilter === "기간" || openFilter === "스택" || openFilter === "인원") return null;

    return (
      <div
        className="absolute top-14 left-0 w-64 bg-white shadow-md z-50 p-4"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        style={{ pointerEvents: 'all' }}
      >
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
    <div className="absolute top-6 left-6 z-40 pointer-events-none">
      <div className="flex items-center gap-6 pointer-events-auto">
        <button
          className={`flex items-center gap-4 bg-white rounded-full border py-2 px-4 shadow-md ${openFilter === "기간" ? "border-bold text-bold" : "text-gray-600"
            }`}
          onClick={(e) => handleFilterClick(e, "기간")}
        >
          <CalendarToday sx={{ fontSize: 24 }} />
          <span className="text-regular font-gmarket-bold text-bold">기간</span>
          <TriangleIcon />
        </button>

        <button
          className={`flex items-center gap-4 bg-white rounded-full border py-2 px-4 shadow-md ${openFilter === "스택" ? "border-bold text-bold" : "text-gray-600"
            }`}
          onClick={(e) => handleFilterClick(e, "스택")}
        >
          <RocketLaunch sx={{ fontSize: 24 }} />
          <span className="text-regular font-gmarket-bold text-bold">스택</span>
          <TriangleIcon />
        </button>

        <button
          className={`flex items-center gap-4 bg-white rounded-full border py-2 px-4 shadow-md ${openFilter === "인원" ? "border-bold text-bold" : "text-gray-600"
            }`}
          onClick={(e) => handleFilterClick(e, "인원")}
        >
          <PeopleAlt sx={{ fontSize: 24 }} />
          <span className="text-regular font-gmarket-bold text-bold">인원</span>
          <TriangleIcon />
        </button>

        <button
          className={`flex items-center gap-4 bg-white rounded-full border py-2 px-4 shadow-md ${openFilter === "지역" ? "border-bold text-bold" : "text-gray-600"
            }`}
          onClick={(e) => handleFilterClick(e, "지역")}
        >
          <FilterAlt sx={{ fontSize: 24 }} />
          <span className="text-regular font-gmarket-bold text-bold">지역</span>
          <TriangleIcon />
        </button>
      </div>

      {renderFilterModal()}

      <MainDurationModal
        isOpen={openFilter === "기간"}
        onClose={handleCloseModal}
        onSelect={handleDurationSelect}
        selectedDurations={selectedDurations}
        anchorEl={anchorEl}
      />

      <MainTechStackModal
        isOpen={openFilter === "스택"}
        onClose={handleCloseModal}
        onSelect={handleTechStackSelect}
        selectedTechStacks={selectedTechStacks}
        anchorEl={anchorEl}
      />

      <MainParticipantsModal
        isOpen={openFilter === "인원"}
        onClose={handleCloseModal}
        onSelect={handleParticipantsSelect}
        selectedParticipants={selectedParticipants}
        anchorEl={anchorEl}
      />
    </div>
  );
};

export default FilterFloatingButton;