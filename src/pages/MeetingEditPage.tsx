import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Map as KakaoMap, MapMarker } from 'react-kakao-maps-sdk';
import Button from '../components/common/ui/Button';
import TextInput from '../components/common/ui/TextInput';
import TextArea from '../components/common/ui/TextArea';
import { AddressSearch } from '../components/meeting/form/AddressSearch';
import { toKoreanDuration } from '../util/transformKorean';
import { useMeetingDetail, useMeetingPatch } from '../hooks/api/useMeeting';
import { useGetTechStack } from '../hooks/api/useTechstack';
import { useMeetingFormStore } from '../store/meetingForm';
import { PatchMeetingRequest } from '../types/api/meeting';
import { RecruitmentType } from '../types/models/meeting';
import DurationModal from '../components/meeting/modals/DurationModal';
import ParticipantsModal from '../components/meeting/modals/ParticipantsModal';
import TechStackModal from '../components/meeting/modals/TechStackModal';
import { KeyboardArrowDown } from '@mui/icons-material';
import toast from 'react-hot-toast';

const MeetingEditPage = () => {
  const { meetingId } = useParams<{ meetingId: string }>();  
  const navigate = useNavigate();

  const { data: meetingData } = useMeetingDetail(Number(meetingId));
  const { data: techStacksData } = useGetTechStack();
  const patchMeeting = useMeetingPatch();

  const {
    recruitmentType,
    maxParticipants,
    duration,
    endDate,
    location,
    addressInfo,
    title,
    description,
    goal,
    otherInfo,
    techStacks,
    errors,
    setBasicInfo,
    setLocation,
    setAddressInfo,
    setTechStacks,
    handleInputChange,
    validateForm,
    reset,
  } = useMeetingFormStore();

  // 모달 상태
  const [showRecruitmentType, setShowRecruitmentType] = useState(false);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showTechStackModal, setShowTechStackModal] = useState(false);

  // 기존 데이터 로드
  useEffect(() => {
    console.log('meetingData:', meetingData);

    if (!meetingData?.data) {
      console.log('No meeting data');
      return;
    }

    const meeting = meetingData.data.postInfo;
    setBasicInfo({
      recruitmentType: meeting.recruitmentType,
      maxParticipants: meeting.maxParticipants,
      duration: meeting.duration,
      endDate: meeting.endDate,
    });

    setLocation({
      latitude: meeting.latitude,
      longitude: meeting.longitude,
    });

    setAddressInfo({
      townAddress: meeting.location,
      areaAddress: "",
    });

    // 기술 스택 설정
    const techStackIds = meeting.techStacks
      .filter((stack: any) => stack.id)
      .map((stack: any) => stack.id);
    const customStacks = meeting.techStacks
      .filter((stack: any) => !stack.id)
      .map((stack: any) => stack.name);

    setTechStacks({
      selectedIds: techStackIds,
      customStacks: customStacks,
    });

    // 상세 정보 설정
    handleInputChange({ target: { name: "title", value: meeting.title } } as any);
    handleInputChange({ target: { name: "description", value: meeting.description } } as any);
    handleInputChange({ target: { name: "goal", value: meeting.goal } } as any);
    handleInputChange({ target: { name: "otherInfo", value: meeting.otherInfo || "" } } as any);
  }, [meetingData, setBasicInfo, setLocation, setAddressInfo, setTechStacks, handleInputChange]);

  // 취소 처리
  const handleCancel = () => {
    reset();
    navigate(`/meeting/${meetingId}`);
  };

  // 수정 요청 처리
  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) {
      toast.error('필수 정보를 모두 입력해주세요.');
      return;
    }

    const requestData: PatchMeetingRequest = {
      recruitmentType,
      maxParticipants,
      duration,
      endDate,
      location: addressInfo.townAddress,
      title,
      description,
      goal,
      otherInfo,
      techStacks: techStacks.selectedIds,
      otherTechStack: techStacks.customStacks,
    };

    // 위치 정보
    if (location.latitude && location.longitude) {
      requestData.latitude = location.latitude;
      requestData.longitude = location.longitude;
    }

    try {
      await patchMeeting.mutateAsync({
        id: Number(meetingId),
        data: requestData,
      });
      toast.success('모임이 성공적으로 수정되었습니다.');
      navigate(`/meeting/${meetingId}`);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        toast.error('모임 수정 권한이 없습니다.');
      } else {
        toast.error('수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  // 기술 스택 표시용 문자열
  const techStackDisplay = () => {
    if (!techStacksData?.data) return "";

    const selectedNames = techStacksData.data
      .filter(stack => techStacks.selectedIds.includes(stack.id))
      .map(stack => stack.name);

    return [...selectedNames, ...techStacks.customStacks].join(", ") || "기술 스택을 선택해주세요";
  };

  return (
    <div className="flex flex-col w-full bg-background px-48 py-20">
      {/* 기본 정보 섹션 */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-10 mb-12">
        {/* 모집 구분 */}
        <div className="relative">
          <p className="font-scdream6 text-label text-bold mb-4">모집 구분</p>
          <TextInput
            value={recruitmentType === RecruitmentType.STUDY ? "스터디" : "프로젝트"}
            onClick={() => setShowRecruitmentType(true)}
            readOnly
            fullWidth
            inputSize="medium"
            endIcon={<KeyboardArrowDown />}
            error={errors.recruitmentType}
          />
          {showRecruitmentType && (
            <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              <div
                className="p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setBasicInfo({ recruitmentType: RecruitmentType.STUDY });
                  setShowRecruitmentType(false);
                }}
              >
                스터디
              </div>
              <div
                className="p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setBasicInfo({ recruitmentType: RecruitmentType.PROJECT });
                  setShowRecruitmentType(false);
                }}
              >
                프로젝트
              </div>
            </div>
          )}
        </div>

        {/* 기술 스택 */}
        <div>
          <p className="font-scdream6 text-label text-bold mb-4">기술 스택</p>
          <TextInput
            value={techStackDisplay()}
            onClick={() => setShowTechStackModal(true)}
            readOnly
            fullWidth
            inputSize="medium"
            endIcon={<KeyboardArrowDown />}
            error={errors.techStacks}
          />
        </div>

        {/* 모집 인원 */}
        <div>
          <p className="font-scdream6 text-label text-bold mb-4">모집 인원</p>
          <TextInput
            value={`${maxParticipants}명`}
            onClick={() => setShowParticipantsModal(true)}
            readOnly
            fullWidth
            inputSize="medium"
            endIcon={<KeyboardArrowDown />}
            error={errors.maxParticipants}
          />
        </div>

        {/* 진행 기간 */}
        <div>
          <p className="font-scdream6 text-label text-bold mb-4">진행 기간</p>
          <TextInput
            value={duration ? toKoreanDuration(duration) : "진행 기간을 선택해주세요"}
            onClick={() => setShowDurationModal(true)}
            readOnly
            fullWidth
            inputSize="medium"
            endIcon={<KeyboardArrowDown />}
            error={errors.duration}
          />
        </div>

        {/* 모집 마감일 */}
        <div>
          <p className="font-scdream6 text-label text-bold mb-4">모집 마감일</p>
          <TextInput
            type="date"
            name="endDate"
            value={endDate}
            onChange={handleInputChange}
            fullWidth
            inputSize="medium"
            error={errors.endDate}
          />
        </div>

        {/* 진행 장소 */}
        <div className="col-span-2">
          <p className="font-scdream6 text-label text-bold mb-4">진행 장소</p>
          <AddressSearch
            addressValue={addressInfo.townAddress}
            setAddressInfo={setAddressInfo}
            setLocation={setLocation}
            setFormData={() => { }}
            handleInputChange={() => { }}
            error={errors.location}
          />
          {location.latitude && location.longitude && (
            <div className="mt-10 h-96 rounded-lg overflow-hidden">
              <KakaoMap
                center={{
                  lat: location.latitude,
                  lng: location.longitude
                }}
                style={{ width: "100%", height: "100%" }}
                level={3}
              >
                <MapMarker
                  position={{
                    lat: location.latitude,
                    lng: location.longitude
                  }}
                />
              </KakaoMap>
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-sub my-4" />

      {/* 상세 정보 섹션 */}
      <div className="flex flex-col space-y-6 mt-8">
        {/* 제목 */}
        <div>
          <p className="font-scdream6 text-label text-bold mb-4">제목</p>
          <TextInput
            name="title"
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={handleInputChange}
            fullWidth
            error={errors.title}
          />
        </div>

        {/* 스터디/프로젝트 소개 */}
        <div>
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
        </div>

        {/* 목표 */}
        <div>
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
        </div>

        {/* 기타 정보 */}
        <div>
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
      </div>

      <DurationModal
        isOpen={showDurationModal}
        onClose={() => setShowDurationModal(false)}
        onSelect={(duration) => setBasicInfo({ duration })}
        selectedDuration={duration}
        anchorEl={null}
      />

      <ParticipantsModal
        isOpen={showParticipantsModal}
        onClose={() => setShowParticipantsModal(false)}
        onSelect={(participants) => setBasicInfo({ maxParticipants: participants })}
        selectedParticipants={maxParticipants}
        anchorEl={null}
      />

      <TechStackModal
        isOpen={showTechStackModal}
        onClose={() => setShowTechStackModal(false)}
        onSelect={setTechStacks}
        selectedTechStacks={techStacks}
        anchorEl={null}
      />

      <div className="flex justify-end mt-8 gap-4">
        <Button
          size='small'
          onClick={handleCancel}
        >
          취소
        </Button>
        <Button
          size='small'
          onClick={handleSubmit}
        >
          수정 완료
        </Button>
      </div>
    </div>
  );
};

export default MeetingEditPage;