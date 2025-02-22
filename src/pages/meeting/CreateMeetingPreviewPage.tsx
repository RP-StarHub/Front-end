import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star } from "@mui/icons-material";
import MeetingHeader from '../../components/meeting/detail/MeetingHeader';
import MeetingInfo from '../../components/meeting/detail/MeetingInfo';
import MeetingContent from '../../components/meeting/detail/MeetingContent';
import LargeStepIndicator from '../../components/common/ui/LargeStepIndicator';
import { useMeetingDetail } from '../../hooks/api/useMeeting';
import Button from '../../components/common/ui/Button';

const CreateMeetingPreviewPage = () => {
  const { meetingId } = useParams();
  const { data, isLoading } = useMeetingDetail(Number(meetingId));
  const navigation = useNavigate();

  const steps = [
    { title: "기본 정보" },
    { title: "모임 소개" },
    { title: "완료" }
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-main border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-lg text-gray-600">잠시만 기다려주세요...</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-col w-full bg-background px-48 py-20">
      <LargeStepIndicator currentStep={3} steps={steps} />

      <div className="flex items-center mt-20 mb-6">
        <Star className="text-yellow" sx={{ fontSize: 40 }} />
        <p className="font-gmarket-bold text-page-title text-bold">모집글이 작성되었습니다.</p>
      </div>
      <p className="text-label text-bold">등록된 글을 확인해주세요. 지원서를 통해 모임원들을 확정할 수 있습니다.</p>

      <div className="col-span-2 h-px bg-sub my-8" />

      <div className="flex flex-col w-full">
        <MeetingHeader 
          meetingDetail={data.data}
          userType={data.data.userType}
        />
        <MeetingInfo 
          postInfo={data.data.postInfo}
        />
        <MeetingContent 
          postInfo={data.data.postInfo}
        />
      </div>

      <div className="flex justify-end mt-8 gap-4">
        <Button
          variant="secondary"
          onClick={() => { navigation('/') }}
        >
          확인
        </Button>
      </div>
    </div>
  );
};

export default CreateMeetingPreviewPage;