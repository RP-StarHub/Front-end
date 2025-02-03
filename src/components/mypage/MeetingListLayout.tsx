// components/mypage/MeetingListLayout.tsx
import React from 'react';
import { Star } from '@mui/icons-material';
import InformCard from '../main/InformCard';
import Pagination from '../main/Pagination';
import { Meeting } from '../../types/models/meeting';

interface MeetingListLayoutProps {
  title: string;
  meetings: Meeting[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function MeetingListLayout({
  title,
  meetings,
  isLoading,
  page,
  totalPages,
  onPageChange
}: MeetingListLayoutProps) {
  if (isLoading) return <div>로딩중...</div>;

  return (
    <div className='flex flex-col w-full px-60 py-24 bg-background'>
      <div className="flex items-center gap-2">
        <Star className="text-yellow" sx={{ fontSize: 30 }} />
        <h3 className="text-page-title font-gmarket-bold text-bold">
          {title}
        </h3>
      </div>

      <div className="w-full h-px bg-bold mt-4 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-20">
        {meetings.map((meeting: Meeting) => (
          <InformCard
            key={meeting.id}
            meeting={meeting}
            fullWidth
          />
        ))}
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={page}
        onPageChange={onPageChange}
      />
    </div>
  );
}

export default MeetingListLayout;