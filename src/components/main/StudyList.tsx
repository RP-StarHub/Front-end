import React from 'react';
import InformCard from "./InformCard";
import Pagination from "./Pagination";
import { Meeting } from '../../types/models/meeting';

interface StudyListProps {
  meetings: Meeting[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const StudyList = React.memo<StudyListProps>(({
  meetings,
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <div className='flex flex-col bg-background w-1/3 px-4 py-6 h-full'>
      <div className="grid grid-rows-4 gap-4 flex-1 w-full items-center">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="w-full min-h-0 justify-center flex">
            <InformCard
              meeting={meeting}
              onLikeToggle={() => { }}
            />
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
});

export default StudyList;