import { useParams } from 'react-router-dom';
import { useMeetingDetail } from '../hooks/api/useMeeting';
import MeetingHeader from '../components/meeting/detail/MeetingHeader';
import MeetingInfo from '../components/meeting/detail/MeetingInfo';
import MeetingContent from '../components/meeting/detail/MeetingContent';
import ApplicationList from '../components/meeting/detail/ApplicationList';
import ApplicationForm from '../components/meeting/detail/ApplicationForm';
import MyApplication from '../components/meeting/detail/MyApplication';
import Button from '../components/common/ui/Button';

const MeetingDetailPage = () => {
  const { meetingId } = useParams();
  const { data, isLoading } = useMeetingDetail(Number(meetingId));

  if (isLoading || !data) return <div>Loading...</div>;

  const { isApplicant, applicationStatus, postInfo } = data.data;

  const renderApplicationSection = () => {
    // 모임이 확정된 경우
    if (postInfo.isConfirmed) {
      return (
        <div className='flex justify-end'>
          <Button size='small' className='mt-8'>
            스터디원 보기
          </Button>
        </div>
      );
    }

    // 모임 개설자인 경우
    if (!isApplicant) {
      return <ApplicationList meetingId={postInfo.id} />;
    }

    // 지원자인 경우
    return applicationStatus ? (
      <MyApplication meetingId={postInfo.id} />
    ) : (
      <ApplicationForm meetingId={postInfo.id} />
    );
  };

  return (
    <div className={
      `flex flex-col w-full px-60 py-24 ${isApplicant ? 'bg-gray-100' : 'bg-background'}`}
    >
      <MeetingHeader
        meetingDetail={data.data}
        isApplicant={isApplicant}
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