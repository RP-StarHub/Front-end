import React from "react";
import InformCard from "./InformCard";
import Pagination from "./Pagination";
import { Meeting } from "../../types/models/meeting";

interface StudyListProps {
  meetings: Meeting[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const StudyList = React.memo<StudyListProps>(
  ({ meetings, currentPage, totalPages, onPageChange }) => {
    return (
      <div
        className="flex flex-col bg-background w-full h-full px-4 py-12"
        data-testid="study-list-container"
      >
        <div
          className="grid grid-rows-4 gap-8 flex-1 w-full items-center"
          data-testid="study-grid"
        >
          {meetings?.map((meeting) => (
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
    );
  }
);

export default StudyList;
