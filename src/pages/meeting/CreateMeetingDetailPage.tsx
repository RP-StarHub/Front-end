import React from 'react';
import { Star } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/ui/Button";
import TextInput from "../../components/common/ui/TextInput";
import TextArea from "../../components/common/ui/TextArea";
import LargeStepIndicator from "../../components/common/ui/LargeStepIndicator";
import { useMeetingFormStore } from '../../store/meetingForm';
import { useCreateMeeting } from '../../hooks/api/useMeeting';
import toast from 'react-hot-toast';

const CreateMeetingDetailPage = () => {
  const navigation = useNavigate();
  const createMeeting = useCreateMeeting();

  const {
    title,
    description,
    goal,
    otherInfo,
    errors,
    handleInputChange,
    validateDetailInfo,
    validateForm,
    getCreateMeetingRequest,
  } = useMeetingFormStore();

  // 이전 페이지로 이동
  const handlePrevious = () => {
    navigation('/meeting/create/basic');
  };

  // 글 등록 처리
  const handleSubmit = async () => {
    // 먼저 현재 페이지의 상세 정보만 검증
    const isDetailValid = validateDetailInfo();

    if (!isDetailValid) {
      toast.error('모임 소개 정보를 모두 입력해주세요.');
      return;
    }

    // 상세 정보가 유효하면 전체 폼 검증
    const isAllValid = validateForm();
    if (!isAllValid) {
      toast.error('이전 단계의 정보를 확인해주세요.');
      navigation('/meeting/create/basic');
      return;
    }

    // 모든 검증을 통과하면 요청 진행
    try {
      const requestData = getCreateMeetingRequest();
      const response = await createMeeting.mutateAsync(requestData);
      
      // 응답에서 생성된 모임의 ID를 추출
      const meetingId = response.data.data.id;
      
      toast.success('모임이 성공적으로 생성되었습니다.');
      // ID를 포함하여 preview 페이지로 이동
      navigation(`/meeting/create/preview/${meetingId}`);
    } catch (error) {
      console.error('모임생성 에러:', error);
      toast.error('모임 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const steps = [
    { title: "기본 정보" },
    { title: "모임 소개" },
    { title: "완료" }
  ];

  return (
    <div className="flex flex-col w-full bg-background px-48 py-20">
      <LargeStepIndicator currentStep={1} steps={steps} />

      <div className="flex items-center mt-20 mb-6">
        <Star className="text-yellow" sx={{ fontSize: 40 }} />
        <p className="font-gmarket-bold text-page-title text-bold">모임 소개</p>
      </div>
      <p className="text-label text-bold">모집글에 쓰일 제목과 내용을 작성해주세요.</p>

      <div className="col-span-2 h-px bg-sub my-8" />

      <div className="flex flex-col space-y-6">
        {/* 제목 */}
        <p className="font-scdream6 text-label text-bold mt-4">제목</p>
        <TextInput
          name="title"
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={handleInputChange}
          fullWidth
          className="h-12"
          error={errors.title}
        />

        {/* 스터디/프로젝트 소개 */}
        <p className="font-scdream6 text-label text-bold mb-4">🚀 스터디/프로젝트 소개</p>
        <TextArea
          name="description"
          placeholder="스터디/프로젝트에 대한 간단한 소개를 해주세요."
          value={description}
          onChange={handleInputChange}
          fullWidth
          className="h-40"
          error={errors.description}
        />

        {/* 목표 */}
        <p className="font-scdream6 text-label text-bold mb-4">👍 목표</p>
        <TextArea
          name="goal"
          placeholder="스터디/프로젝트를 통해 이루고자하는 목표를 알려주세요."
          value={goal}
          onChange={handleInputChange}
          fullWidth
          className="h-40"
          error={errors.goal}
        />

        {/* 기타 정보 */}
        <p className="font-scdream6 text-label text-bold mb-4">😊 기타 정보</p>
        <TextArea
          name="otherInfo"
          placeholder="여러분에 대한 소개나 현재 상황 등 기타 정보를 입력해주세요."
          value={otherInfo}
          onChange={handleInputChange}
          fullWidth
          className="h-40"
        />
      </div>

      <div className="flex justify-end mt-8 gap-4">
        <Button
          variant="secondary"
          onClick={handlePrevious}
        >
          이전
        </Button>
        <Button
          variant="secondary"
          onClick={handleSubmit}
        >
          글 등록
        </Button>
      </div>
    </div>
  );
};

export default CreateMeetingDetailPage;