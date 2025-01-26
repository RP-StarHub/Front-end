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
  const { data: meetingDetail, isLoading } = useMeetingDetail(Number(meetingId));

  console.log(meetingDetail);

  if (isLoading || !meetingDetail) {
    return <div>Loading...</div>;
  }

  const { isApplicant, applicationStatus, postInfo } = meetingDetail.data;

  return (
    <div className={`flex flex-col w-full ${isApplicant ? 'bg-white' : 'bg-background'}`}>
      <MeetingHeader />
      <MeetingInfo />
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