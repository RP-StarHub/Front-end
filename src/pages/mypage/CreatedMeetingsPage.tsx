import React, { useEffect, useState } from 'react';
import { useCreatedMeetings } from '../../hooks/api/useMypage';
import MeetingListLayout from '../../components/mypage/MeetingListLayout';

function CreatedMeetingsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useCreatedMeetings(page);

  useEffect(() => {
    refetch();
  }, [page, refetch]);

  return (
    <MeetingListLayout
      title="내가 작성한 글"
      meetings={data?.content || []}
      isLoading={isLoading}
      page={page}
      totalPages={data?.totalPages || 1}
      onPageChange={setPage}
    />
  );
}

export default CreatedMeetingsPage;