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

  return (
    <div className={
      `flex flex-col w-full px-60 py-24 ${isApplicant ? 'bg-white' : 'bg-background'}`}
    >
      <MeetingHeader
        meetingDetail={data.data}
        isApplicant={isApplicant}
      />
      <MeetingInfo 
        postInfo={postInfo}
      />
      <MeetingContent />

      {
        !postInfo.isConfirmed ? (
          !isApplicant ? (
            <ApplicationList />
          ) : (
            applicationStatus ? (
              <MyApplication />
            ) : (
              <ApplicationForm />
            )
          )
        ) : (
          <div className='flex justify-end'>
            <Button
              variant='secondary'
              size='small'
              className='mt-8'
            >
              스터디원 보기
            </Button>
          </div>
        )
      }
    </div>
  );
};

export default MeetingDetailPage;