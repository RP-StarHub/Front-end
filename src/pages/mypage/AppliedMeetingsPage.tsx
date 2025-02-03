import React, { useEffect, useState } from 'react'
import { useAppliedMeetings } from '../../hooks/api/useMypage';
import MeetingListLayout from '../../components/mypage/MeetingListLayout';

function AppliedMeetingsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useAppliedMeetings(page);

  useEffect(() => {
    refetch();
  }, [page, refetch]);

  return (
    <MeetingListLayout
      title="내가 참여한 모임"
      meetings={data?.content || []}
      isLoading={isLoading}
      page={page}
      totalPages={data?.totalPages || 1}
      onPageChange={setPage}
    />
  );
}

export default AppliedMeetingsPage