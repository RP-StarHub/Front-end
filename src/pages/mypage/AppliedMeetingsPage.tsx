import React, { useState } from 'react'
import { useAppliedMeetings } from '../../hooks/api/useMypage';
import MeetingListLayout from '../../components/mypage/MeetingListLayout';

function AppliedMeetingsPage() {
  const [page, setPage] = useState(1);
  const totalPages = 1;
  const { data, isLoading } = useAppliedMeetings(page);

  return (
    <MeetingListLayout
      title="내가 참여한 모임"
      meetings={data?.content || []}
      isLoading={isLoading}
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  );
}

export default AppliedMeetingsPage