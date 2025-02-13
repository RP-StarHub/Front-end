import React, { useEffect, useRef, useState } from "react";
import { Star, KeyboardArrowDown } from "@mui/icons-material";
import { AddressSearch } from "../../components/meeting/form/AddressSearch";
import Button from "../../components/common/ui/Button";
import TextInput from "../../components/common/ui/TextInput";
import LargeStepIndicator from "../../components/common/ui/LagreStepIndicator";
import { RecruitmentType } from "../../types/models/meeting";
import { toKoreanDuration } from "../../util/transformKorean";
import DurationModal from "../../components/meeting/modals/DurationModal";
import ParticipantsModal from "../../components/meeting/modals/ParticipantsModal";
import TechStackModal from "../../components/meeting/modals/TechStackModal";
import { useGeolocation } from "../../hooks/common/useGeolocation";
import { useNavigate } from "react-router-dom";
import { useMeetingFormStore } from "../../store/meetingForm";
import { useGetTechStack } from "../../hooks/api/useTechstack";
import toast from "react-hot-toast";

declare global {
  interface Window {
    naver: any;
  }
}

const CreateMeetingBasicPage = () => {
  const navigation = useNavigate();
  const { location: userLocation, loaded } = useGeolocation();
  const { data: techStacksData } = useGetTechStack();
  
  const mapRef = useRef<HTMLDivElement>(null);
  const [naverMap, setNaverMap] = useState<naver.maps.Map | null>(null);
  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);
  
  const durationInputRef = useRef<HTMLDivElement>(null);
  const participantsInputRef = useRef<HTMLDivElement>(null);
  const techStackInputRef = useRef<HTMLDivElement>(null);
  const recruitmentDropdownRef = useRef<HTMLDivElement>(null);

  const {
    recruitmentType,
    maxParticipants,
    duration,
    endDate,
    location,
    addressInfo,
    techStacks,
    errors,
    setBasicInfo,
    setLocation,
    setAddressInfo,
    setTechStacks,
    handleInputChange,
    validateBasicInfo
  } = useMeetingFormStore();

  const [isRecruitmentDropdownOpen, setIsRecruitmentDropdownOpen] = useState(false);
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [isTechStackModalOpen, setIsTechStackModalOpen] = useState(false);

  // 네이버 지도 초기화
  useEffect(() => {
    if (!mapRef.current || !location.latitude || !location.longitude || !window.naver) return;

    const mapOptions = {
      center: new window.naver.maps.LatLng(location.latitude, location.longitude),
      zoom: 15,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT
      }
    };

    const map = new window.naver.maps.Map(mapRef.current, mapOptions);
    const newMarker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(location.latitude, location.longitude),
      map
    });

    setNaverMap(map);
    setMarker(newMarker);

    return () => {
      newMarker.setMap(null);
      map.destroy();
    };
  }, [location.latitude, location.longitude]);

  // 위치 변경 시 지도와 마커 위치만 업데이트
  useEffect(() => {
    if (!naverMap || !location.latitude || !location.longitude || !marker) return;

    const position = new window.naver.maps.LatLng(location.latitude, location.longitude);
    naverMap.setCenter(position);
    marker.setPosition(position);
  }, [location.latitude, location.longitude, naverMap, marker]);

  // 기술 스택 표시 텍스트 생성
  const getDisplayTechStacks = () => {
    if (!techStacksData?.data) return "";
    
    const selectedNames = techStacksData.data
      .filter(stack => techStacks.selectedIds.includes(stack.id))
      .map(stack => stack.name);

    return [...selectedNames, ...techStacks.customStacks].join(", ");
  };

  // 모집 인원 표시 텍스트 생성
  const getDisplayParticipants = () => {
    if (!maxParticipants) return "1명";
    if (maxParticipants === 10) return "10명 이상";
    return `${maxParticipants}명`;
  };

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (recruitmentDropdownRef.current && !recruitmentDropdownRef.current.contains(event.target as Node)) {
        setIsRecruitmentDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 사용자 위치로 초기화
  useEffect(() => {
    if (loaded && userLocation) {
      setLocation({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude
      });
    }
  }, [loaded, userLocation, setLocation]);

  const handleNext = () => {
    const isValid = validateBasicInfo();

    if (!isValid) {
      toast.error('필수 정보를 모두 입력해주세요.');
      return;
    }

    navigation('/meeting/create/detail');
  };

  const steps = [
    { title: "기본 정보" },
    { title: "모임 소개" },
    { title: "완료" }
  ];

  return (
    <div className="flex flex-col w-full bg-background px-48 py-20">
      <LargeStepIndicator currentStep={0} steps={steps} />

      <div className="flex items-center mt-20 mb-6">
        <Star className="text-yellow" sx={{ fontSize: 40 }} />
        <p className="font-gmarket-bold text-page-title text-bold">기본 정보 입력</p>
      </div>
      <p className="text-label text-bold">모집글에 쓰일 기본 정보들을 입력해주세요</p>

      <div className="col-span-2 h-px bg-sub my-8" />

      <div className="grid grid-cols-2 gap-x-8 gap-y-10">
        <div ref={recruitmentDropdownRef} className="relative">
          <p className="font-scdream6 text-label text-bold mb-4">모집 구분</p>
          <TextInput
            value={recruitmentType === RecruitmentType.STUDY ? "스터디" : "프로젝트"}
            onClick={() => setIsRecruitmentDropdownOpen(!isRecruitmentDropdownOpen)}
            readOnly
            fullWidth
            inputSize="medium"
            endIcon={<KeyboardArrowDown />}
            error={errors.recruitmentType}
          />
          {isRecruitmentDropdownOpen && (
            <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              <div
                className="p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setBasicInfo({ recruitmentType: RecruitmentType.STUDY });
                  setIsRecruitmentDropdownOpen(false);
                }}
              >
                스터디
              </div>
              <div
                className="p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setBasicInfo({ recruitmentType: RecruitmentType.PROJECT });
                  setIsRecruitmentDropdownOpen(false);
                }}
              >
                프로젝트
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={techStackInputRef}>
          <p className="font-scdream6 text-label text-bold mb-4">기술 스택</p>
          <TextInput
            value={
              techStacks.selectedIds.length > 0 || techStacks.customStacks.length > 0
                ? getDisplayTechStacks()
                : "기술 스택을 선택해주세요"
            }
            onClick={() => setIsTechStackModalOpen(true)}
            readOnly
            fullWidth
            inputSize="medium"
            endIcon={<KeyboardArrowDown />}
            error={errors.techStacks}
          />
        </div>

        <div className="relative" ref={participantsInputRef}>
          <p className="font-scdream6 text-label text-bold mb-4">모집 인원</p>
          <TextInput
            value={getDisplayParticipants()}
            onClick={() => setIsParticipantsModalOpen(true)}
            readOnly
            fullWidth
            inputSize="medium"
            endIcon={<KeyboardArrowDown />}
            error={errors.maxParticipants}
          />
        </div>

        <div ref={durationInputRef}>
          <p className="font-scdream6 text-label text-bold mb-4">진행 기간</p>
          <TextInput
            value={duration ? toKoreanDuration(duration) : "진행 기간을 선택해주세요"}
            onClick={() => setIsDurationModalOpen(true)}
            readOnly
            fullWidth
            inputSize="medium"
            endIcon={<KeyboardArrowDown />}
            error={errors.duration}
          />
        </div>

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

        <div className="col-span-2 h-px bg-sub my-4" />

        <div className="col-span-2">
          <p className="font-scdream6 text-label text-bold mb-4">진행 장소</p>
          <AddressSearch
            addressValue={addressInfo.townAddress}
            setAddressInfo={setAddressInfo}
            setLocation={setLocation}
            setFormData={() => {}}
            handleInputChange={() => {}}
            error={errors.location}
          />
          {location.latitude && location.longitude && (
            <div className="mt-10 h-[600px] rounded-lg overflow-hidden relative">
              <div 
                ref={mapRef} 
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          )}
        </div>
      </div>

      <DurationModal
        isOpen={isDurationModalOpen}
        onClose={() => setIsDurationModalOpen(false)}
        onSelect={(duration) => setBasicInfo({ duration })}
        selectedDuration={duration}
        anchorEl={durationInputRef.current}
      />

      <ParticipantsModal
        isOpen={isParticipantsModalOpen}
        onClose={() => setIsParticipantsModalOpen(false)}
        onSelect={(participants) => setBasicInfo({ maxParticipants: participants })}
        selectedParticipants={maxParticipants}
        anchorEl={participantsInputRef.current}
      />

      <TechStackModal
        isOpen={isTechStackModalOpen}
        onClose={() => setIsTechStackModalOpen(false)}
        onSelect={setTechStacks}
        selectedTechStacks={techStacks}
        anchorEl={techStackInputRef.current}
      />

      <div className="flex justify-end mt-8">
        <Button
          variant="secondary"
          onClick={handleNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default CreateMeetingBasicPage;