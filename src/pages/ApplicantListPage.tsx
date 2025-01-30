import React from 'react';
import ProfileCard from '../components/user/ProfileCard';
import PickIcon from "../assets/icons/PickIcon.png";
import { useParams } from 'react-router-dom';
import { useGetMeetingMembers } from '../hooks/api/useMeeting';
import { MeetingMemberInfo } from '../types/api/meeting';

const ApplicantListPage: React.FC = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const { data: members, isLoading, error } = useGetMeetingMembers(Number(meetingId));

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="font-scdream4 text-sub text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="font-scdream4 text-red-500 text-xl">
          확정된 스터디원 목록을 불러오는데 실패했습니다.
        </div>
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="font-scdream4 text-sub text-xl">
          아직 확정된 스터디원이 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className='w-full bg-background px-48 py-24'>
      <div className='flex items-center pt-12 mb-12'>
        <img
          src={PickIcon}
          style={{ width: "45px", height: "45px" }}
          alt="Pick Icon"
        />
        <p className='text-big-title font-gmarket-bold text-sub'>Pick!</p>
      </div>

      <div className='grid grid-cols-4 gap-8'>
        {members.map((member: MeetingMemberInfo) => (
          <div key={member.email} className="flex justify-center">
            <ProfileCard
              name={member.name}
              bio={member.bio}
              email={member.email}
              phoneNumber={member.phoneNumber}
              age={member.age}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicantListPage;