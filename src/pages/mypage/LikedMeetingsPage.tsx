import React, { useEffect, useState } from 'react';
import { useLikedMeetings } from '../../hooks/api/useMypage';
import MeetingListLayout from '../../components/mypage/MeetingListLayout';

function LikedMeetingsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useLikedMeetings(page);

  useEffect(() => {
    refetch();
  }, [page, refetch]);

  return (
    <MeetingListLayout
      title="내가 관심있는 글"
      meetings={data?.content || []}
      isLoading={isLoading}
      page={page}
      totalPages={data?.totalPages || 1}
      onPageChange={setPage}
    />
  );
}

export default LikedMeetingsPage;