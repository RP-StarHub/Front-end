import React from 'react';
import { Star } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/ui/Button";
import TextInput from "../../components/common/ui/TextInput";
import TextArea from "../../components/common/ui/TextArea";
import LargeStepIndicator from "../../components/common/ui/LagreStepIndicator";

const CreateMeetingDetailPage = () => {
  const navigation = useNavigate();

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
          placeholder="제목을 입력해주세요"
          fullWidth
          className="h-12"
        />

        {/* 스터디/프로젝트 소개 */}
        <p className="font-scdream6 text-label text-bold mb-4">🚀 스터디/프로젝트 소개</p>
        <TextArea
          placeholder="스터디/프로젝트에 대한 간단한 소개를 해주세요."
          fullWidth
          className="h-40"
        />

        {/* 목표 */}
        <p className="font-scdream6 text-label text-bold mb-4">👍 목표</p>
        <TextArea
          placeholder="스터디/프로젝트를 통해 이루고자하는 목표를 알려주세요."
          fullWidth
          className="h-40"
        />

        {/* 진행 방법 */}
        <p className="font-scdream6 text-label text-bold mb-4">😊 기타 정보</p>
        <TextArea
          placeholder="여러분에 대한 소개나 현재 상황 등 기타 정보를 입력해주세요."
          fullWidth
          className="h-40"
        />
      </div>

      <div className="flex justify-end mt-8 gap-4">
        <Button
          variant="secondary"
          onClick={() => { navigation('/meeting/create/basic') }}
        >
          이전
        </Button>
        <Button
          variant="secondary"
          onClick={() => { navigation('/meeting/create/preview') }}
        >
          글 등록
        </Button>
      </div>
    </div>
  );
};

export default CreateMeetingDetailPage;