import React from 'react'
import MyProfile from '../../components/mypage/MyProfile'
import RecentMeetingSection from '../../components/mypage/RecentMeetingSection';
import { useMyProfile, useRecentAppliedMeetings, useRecentCreatedMeetings, useRecentLikedMeetings } from '../../hooks/api/useMypage'

function MainMyPage() {
  const { data: profileData, isLoading: profileLoading } = useMyProfile();
  const { data: createdData, isLoading: createdLoading } = useRecentCreatedMeetings();
  const { data: likedData, isLoading: likedLoading } = useRecentLikedMeetings();
  const { data: appliedData, isLoading: appliedLoading } = useRecentAppliedMeetings();

  if (profileLoading || createdLoading || likedLoading || appliedLoading) {
    return <div>Loading...</div>;
  }

  if (!profileData) return null;

  return (
    <div
      className='flex flex-col w-full px-60 py-24 bg-background'
    >
      <MyProfile profile={profileData} />

      <div className='flex flex-col gap-8 mt-12'>
      {createdData?.data && (
        <RecentMeetingSection
          title='내가 작성한 글'
          meetings={createdData.data}
          viewAllLink='/mypage/meetings/created'
        />
      )}

      {likedData?.data && (
        <RecentMeetingSection
          title='내가 관심있는 글'
          meetings={likedData.data}
          viewAllLink='/mypage/meetings/liked'
        />
      )}

      {appliedData?.data && (
        <RecentMeetingSection
          title='내가 참여한 모임'
          meetings={appliedData.data}
          viewAllLink='/mypage/meetings/applied'
        />
      )}
      </div>

    </div>
  )
}

export default MainMyPage