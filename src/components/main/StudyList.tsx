import React from "react";
import InformCard from "./InformCard";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";
import { Meeting } from "../../types/models/meeting";

interface StudyListProps {
  meetings: Meeting[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch: (searchTerm: string) => void;
  isLoading?: boolean;
}

const StudyList = React.memo<StudyListProps>(
  ({ meetings, currentPage, totalPages, onPageChange, onSearch, isLoading = false }) => {
    return (
      <div
        className="flex flex-col bg-background w-full h-full"
        data-testid="study-list-container"
      >
        <div className="px-4 pt-4 pb-2">
          <SearchBar onSearch={onSearch} />
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-2">검색 중입니다...</div>
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        ) : (
          <div className="px-4 py-4">
            <div
              className="grid grid-rows-4 gap-4 flex-1 w-full items-center"
              data-testid="study-grid"
            >
              {meetings.length > 0 ? (
                meetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="w-full min-h-0 justify-center flex"
                    data-testid="card-container"
                  >
                    <InformCard meeting={meeting} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    );
  }
);

export default StudyList;