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
}

const StudyList = React.memo<StudyListProps>(
  ({ meetings, currentPage, totalPages, onPageChange, onSearch }) => {
    return (
      <div 
        className="flex flex-col bg-background w-full h-full"
        data-testid="study-list-container"
      >
        <div className="px-4 pt-4 pb-2">
          <SearchBar onSearch={onSearch} />
        </div>
        
        <div className="px-4 py-4">
          <div 
            className="grid grid-rows-4 gap-8 flex-1 w-full items-center"
            data-testid="study-grid"
           >
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="w-full min-h-0 justify-center flex"
                data-testid="card-container"
              >
                <InformCard meeting={meeting} />
              </div>
            ))}
          </div>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    );
  }
);

export default StudyList;
