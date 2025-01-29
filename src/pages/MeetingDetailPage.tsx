import { useParams } from 'react-router-dom';
import { useMeetingDetail } from '../hooks/api/useMeeting';
import MeetingHeader from '../components/meeting/detail/MeetingHeader';
import MeetingInfo from '../components/meeting/detail/MeetingInfo';
import MeetingContent from '../components/meeting/detail/MeetingContent';
import ApplicationList from '../components/meeting/detail/ApplicationList';
import ApplicationForm from '../components/meeting/detail/ApplicationForm';
import MyApplication from '../components/meeting/detail/MyApplication';
import Button from '../components/common/ui/Button';
import { ApplicationStatus, UserType } from '../types/models/meeting';

const MeetingDetailPage = () => {
  const { meetingId } = useParams();
  const { data, isLoading } = useMeetingDetail(Number(meetingId));

  if (isLoading || !data) return <div>Loading...</div>;

  const { userType, isApplication, applicationStatus, postInfo } = data.data;

  const renderApplicationSection = () => {
    // 모임이 확정된 경우
    if (postInfo.isConfirmed) {
      // 개설자이거나 승인된 지원자만 스터디원 보기 가능
      if (
        userType === UserType.Creator ||
        (userType === UserType.Applicant && applicationStatus === ApplicationStatus.APPROVED)
      ) {
        return (
          <div className="flex justify-end">
            <Button size="small" className="mt-8">
              스터디원 보기
            </Button>
          </div>
        );
      }
      else if (userType === UserType.Applicant && applicationStatus === ApplicationStatus.REJECTED) {
        return (
          <div className='flex flex-col items-center justify-center w-full py-20'>
            <p className='font-scdream6 text-sub text-lg mb-2'>아쉽게도 최종 모임원으로 선정되지 못했습니다.</p>
            <p className='font-scdream4 text-sub'>StarHub와 함께 다른 모임을 찾아봐요!</p>
          </div>
        );
      }
      // 익명 사용자
      else {
        return (
          <div className='flex flex-col items-center justify-center w-full py-20'>
            <p className='font-scdream6 text-sub text-lg mb-2'>해당 모임글은 모집이 마감되었습니다.</p>
            <p className='font-scdream4 text-sub'>StarHub와 함께 다른 모임을 찾아봐요!</p>
          </div>
        );
      }
    } else {
      // 모임이 확정되지 않은 경우
      if (userType === UserType.Creator) {
        return <ApplicationList meetingId={postInfo.id} />
      };

      // 지원자인 경우
      if (userType === UserType.Applicant) {
        return isApplication ? (
          <MyApplication meetingId={postInfo.id} />
        ) : (
          <ApplicationForm meetingId={postInfo.id} />
        );
      }

      // 익명 사용자 
      if (userType === UserType.Anonymous) {
        return (
          <ApplicationForm meetingId={postInfo.id} userType={userType} />
        );
      }
    }
  };

  return (
    <div
      className={`flex flex-col w-full px-60 py-24 ${userType === UserType.Creator ? 'bg-background' : 'bg-gray-100'
        }`}
    >
      <MeetingHeader
        meetingDetail={data.data}
        userType={userType}
      />
      <MeetingInfo
        postInfo={postInfo}
      />
      <MeetingContent
        postInfo={postInfo}
      />
      {renderApplicationSection()}
    </div>
  );
};

export default MeetingDetailPage;