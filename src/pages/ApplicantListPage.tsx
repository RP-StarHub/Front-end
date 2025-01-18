import React from 'react';
import ProfileCard from '../components/user/ProfileCard';
import PickIcon from "../assets/icons/PickIcon.png";
import { useParams } from 'react-router-dom';
import { useUserPicked } from '../hooks/api/useComment';

const ApplicantListPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { data: response, isLoading } = useUserPicked(Number(postId));

  const pickedUsers = response?.data.data || [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='w-full bg-background px-48 py-24'>
      <div className='flex items-center pt-12 mb-12'>
        <img
          src={PickIcon}
          style={{ width: "45px", height: "45px" }}
          alt="Pick Icon"
          className='w-16 mr-4'
        />
        <p className='text-6xl font-gmarket-bold text-sub'>Pick!</p>
      </div>

      <div className='grid grid-cols-4 gap-8'>
        {pickedUsers.map((pickedUser) => (
          <div key={pickedUser.user.email} className="flex justify-center">
            <ProfileCard
              name={pickedUser.user.name}
              introduction={pickedUser.user.introduction}
              email={pickedUser.user.email}
              phoneNum={pickedUser.user.phoneNum}
              age={pickedUser.user.age}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicantListPage;