import React, { useState } from 'react';
import { useLikedMeetings } from '../../hooks/api/useMypage';
import MeetingListLayout from '../../components/mypage/MeetingListLayout';

function LikedMeetingsPage() {
  const [page, setPage] = useState(1);
  const totalPages = 1;
  const { data, isLoading } = useLikedMeetings(page);

  return (
    <MeetingListLayout
      title="내가 관심있는 글"
      meetings={data?.data.content || []}
      isLoading={isLoading}
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  );
}

export default LikedMeetingsPage;