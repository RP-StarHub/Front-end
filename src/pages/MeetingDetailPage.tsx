import { useNavigate, useParams } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { meetingId } = useParams();
  const { data, isLoading } = useMeetingDetail(Number(meetingId));

  if (isLoading || !data) return <div>Loading...</div>;

  const { userType, isApplication, applicationStatus, postInfo } = data.data;

  // 확정된 모임 상태 메시지 컴포넌트
  const ConfirmedMessage = () => (
    <div className='flex flex-col items-center justify-center w-full py-20'>
      <p className='font-scdream6 text-sub text-lg mb-2'>
        {userType === UserType.Applicant && applicationStatus === ApplicationStatus.REJECTED
          ? '아쉽게도 최종 모임원으로 선정되지 못했습니다.'
          : '해당 모임글은 모집이 마감되었습니다.'}
      </p>
      <p className='font-scdream4 text-sub'>StarHub와 함께 다른 모임을 찾아봐요!</p>
    </div>
  );

  const renderApplicationSection = () => {
    // 모임원이 확정된 경우
    if (postInfo.isConfirmed) {
      // 최종 모임원은 개설자와 승인된 사용자
      const canViewMembers = userType === UserType.Creator ||
        (userType === UserType.Applicant && applicationStatus === ApplicationStatus.APPROVED);

      return canViewMembers ? (
        <div className="flex justify-end">
          <Button
            size="small"
            className="mt-8"
            onClick={() => { navigate(`/applicant/list/${meetingId}`); }}>
            스터디원 보기
          </Button>
        </div>
      ) : <ConfirmedMessage />;
    }

    // 모집중인 모임 게시글 보이기
    const applicationComponents = {
      [UserType.Creator]: <ApplicationList meetingId={postInfo.id} />,
      [UserType.Applicant]: isApplication
        ? <MyApplication meetingId={postInfo.id} />
        : <ApplicationForm meetingId={postInfo.id} />,
      [UserType.Anonymous]: <ApplicationForm meetingId={postInfo.id} userType={userType} />
    };

    return applicationComponents[userType];
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