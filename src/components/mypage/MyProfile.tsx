import React from 'react'
import { UserProfile } from '../../types/api/mypage'
import { Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface MyProfileProps {
  profile: UserProfile;
}

const MyProfile: React.FC<MyProfileProps> = ({ profile }) => {
  const navigate = useNavigate();

  const formatPhoneNumber = (phoneNumber: string): string => {
    const numbers = phoneNumber.replace(/[^0-9]/g, '');
    if (numbers.length !== 11) {
      return phoneNumber;
    }
    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  };

  const handleEdit = () => {
    navigate('/mypage/profile/edit')
  }

  return (
    <div className='flex bg-white rounded-lg px-40 py-10 box-border shadow-md justify-center'>
      <div className='flex w-2/3'>
        <div className='flex items-start justify-between w-full'>
          <img
            src={profile.profileImage}
            alt='프로필 이미지'
            className='w-32 h-32 rounded-full self-center'
          />

          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-4'>
              <p className='text-page-title text-bold font-scdream6'>{profile.name}</p>
              <p className='text-regular text-sub font-scdream4'>{profile.age}세</p>
            </div>
            <p className='text-label text-bold font-scdream4'>{formatPhoneNumber(profile.phoneNumber)}</p>
            <p className='text-label text-bold font-scdream4'>{profile.email}</p>
          </div>

          <div className='flex flex-col gap-4'>
            <p className='text-page-title text-white'>.</p>
            <p className='text-label text-bold font-scdream4'>{profile.nickname}</p>
            <p className='text-label text-bold font-scdream4'>{profile.bio}</p>
          </div>

          <button onClick={handleEdit}>
            <Edit sx={{ fontSize: 24, color: "#313866", marginRight: 2 }} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MyProfile