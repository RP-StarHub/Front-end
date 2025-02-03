import React, { useState } from 'react';
import { useCreatedMeetings } from '../../hooks/api/useMypage';
import MeetingListLayout from '../../components/mypage/MeetingListLayout';

function CreatedMeetingsPage() {
  const [page, setPage] = useState(1);
  const totalPages = 1;
  const { data, isLoading } = useCreatedMeetings(page);

  return (
    <MeetingListLayout
      title="내가 작성한 글"
      meetings={data?.content || []}
      isLoading={isLoading}
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  );
}

export default CreatedMeetingsPage;