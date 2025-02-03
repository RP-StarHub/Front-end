import React, { useState } from 'react';
import { Star } from '@mui/icons-material';
import { useCreatedMeetings } from '../../hooks/api/useMypage';
import InformCard from '../../components/main/InformCard';
import { Meeting } from '../../types/models/meeting';
import Pagination from '../../components/main/Pagination';

function CreatedMeetingsPage() {
  const [page, setPage] = useState(1);
  const totalPages = 1;
  const { data, isLoading } = useCreatedMeetings(page);

  if (isLoading || !data) return <div>로딩중...</div>;

  const meetings = data.data.content;

  return (
    <div className='flex flex-col w-full px-60 py-24 bg-background'>
      <div className="flex items-center gap-2">
        <Star className="text-yellow" sx={{ fontSize: 30 }} />
        <h3 className="text-page-title font-gmarket-bold text-bold">
          내가 작성한 글
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
        onPageChange={setPage}
      />
    </div>
  );
}

export default CreatedMeetingsPage;