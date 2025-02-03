import React from 'react'
import MyProfile from '../../components/mypage/MyProfile'
import { useMyProfile } from '../../hooks/api/useMypage'

function MainMyPage() {
  const { data, isLoading } = useMyProfile();
  
  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div
      className='flex flex-col w-full px-60 py-24 bg-background'
    >
      <MyProfile profile={data} />
    </div>
  )
}

export default MainMyPage