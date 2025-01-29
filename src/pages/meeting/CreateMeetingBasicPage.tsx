import React, { useState, useEffect, useRef } from "react";
import { Map as KakaoMap, MapMarker } from "react-kakao-maps-sdk";
import { Star, KeyboardArrowDown } from "@mui/icons-material";
import { AddressSearch } from "../../components/meeting/form/AddressSearch";
import Button from "../../components/common/ui/Button";
import TextInput from "../../components/common/ui/TextInput";
import LargeStepIndicator from "../../components/common/ui/LagreStepIndicator";
import { DURATION, RecruitmentType } from "../../types/models/meeting";
import { toKoreanDuration } from "../../util/transformKorean";
import DurationModal from "../../components/meeting/modals/DurationModal";
import ParticipantsModal from "../../components/meeting/modals/ParticipantsModal";
import TechStackModal from "../../components/meeting/modals/TechStackModal";
import { useGeolocation } from "../../hooks/common/useGeolocation";
import { useNavigate } from "react-router-dom";

const CreateMeetingBasicPage = () => {
  const navigation = useNavigate();
  const { location: userLocation, loaded } = useGeolocation();
  const [recruitmentType, setRecruitmentType] = useState<RecruitmentType>(RecruitmentType.STUDY);
  const [selectedDuration, setSelectedDuration] = useState<DURATION>();
  const [selectedParticipants, setSelectedParticipants] = useState<number>(1);
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  const [endDate, setEndDate] = useState<string>("");
  const [addressInfo, setAddressInfo] = useState({ areaAddress: "", townAddress: "" });
  const [location, setLocation] = useState<{ latitude: number | null; longitude: number | null }>({
    latitude: null,
    longitude: null
  });

  const [isRecruitmentDropdownOpen, setIsRecruitmentDropdownOpen] = useState(false);
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [isTechStackModalOpen, setIsTechStackModalOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const recruitmentDropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
  }, [loaded, userLocation]);

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
        <p className="font-gmarket-bold text-page-title text-bold">기본 정보 설정</p>
      </div>
      <p className="text-label text-bold">스터디에 관한 기본 정보를 입력해주세요</p>

      <div className="col-span-2 h-px bg-sub my-8" />

      <div className="grid grid-cols-2 gap-x-8 gap-y-10">
        {/* 모집 구분 */}
        <div ref={recruitmentDropdownRef} className="relative">
          <p className="font-scdream6 text-label text-bold mb-4">모집 구분</p>
          <TextInput
            value={recruitmentType === RecruitmentType.STUDY ? "스터디" : "프로젝트"}
            onClick={() => setIsRecruitmentDropdownOpen(!isRecruitmentDropdownOpen)}
            readOnly
            fullWidth
            inputSize="medium"
            endIcon={<KeyboardArrowDown />}
          />
          {isRecruitmentDropdownOpen && (
            <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              <div
                className="p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setRecruitmentType(RecruitmentType.STUDY);
                  setIsRecruitmentDropdownOpen(false);
                }}
              >
                스터디
              </div>
              <div
                className="p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setRecruitmentType(RecruitmentType.PROJECT);
                  setIsRecruitmentDropdownOpen(false);
                }}
              >
                프로젝트
              </div>
            </div>
          )}
        </div>

        {/* 기술 스택 */}
        <div className="relative">
          <p className="font-scdream6 text-label text-bold mb-4">기술 스택</p>
          <TextInput
            value={selectedTechStacks.length > 0 ? selectedTechStacks.join(", ") : "기술 스택을 선택해주세요"}
            onClick={() => setIsTechStackModalOpen(true)}
            readOnly
            fullWidth
            inputSize="medium"
            endIcon={<KeyboardArrowDown />}
          />
        </div>

        {/* 모집 인원 */}
        <div className="relative">
          <p className="font-scdream6 text-label text-bold mb-4">모집 인원</p>
          <TextInput
            value={selectedParticipants ? `${selectedParticipants}명` : "1명"}
            onClick={() => setIsParticipantsModalOpen(true)}
            readOnly
            fullWidth
            inputSize="medium"
            endIcon={<KeyboardArrowDown />}
          />
        </div>

        {/* 진행 기간 */}
        <div>
          <p className="font-scdream6 text-label text-bold mb-4">진행 기간</p>
          <TextInput
            value={selectedDuration ? toKoreanDuration(selectedDuration) : "진행 기간을 선택해주세요"}
            onClick={() => setIsDurationModalOpen(true)}
            readOnly
            fullWidth
            inputSize="medium"
            endIcon={<KeyboardArrowDown />}
          />
        </div>

        {/* 모집 마감일 */}
        <div>
          <p className="font-scdream6 text-label text-bold mb-4">모집 마감일</p>
          <TextInput
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            inputSize="medium"
          />
        </div>

        <div className="col-span-2 h-px bg-sub my-4" />

        {/* 진행 장소 */}
        <div className="col-span-2">
          <p className="font-scdream6 text-label text-bold mb-4">진행 장소</p>
          <AddressSearch
            addressValue={addressInfo.townAddress}
            setAddressInfo={setAddressInfo}
            setLocation={setLocation}
            setFormData={() => { }}
            handleInputChange={() => { }}
            error=""
          />
          {location.latitude && location.longitude && (
            <div className="mt-10 h-[800px] rounded-lg overflow-hidden relative">
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

      {/* 모달 컴포넌트들 */}
      <DurationModal
        isOpen={isDurationModalOpen}
        onClose={() => setIsDurationModalOpen(false)}
        onSelect={setSelectedDuration}
        selectedDuration={selectedDuration}
      />

      <ParticipantsModal
        isOpen={isParticipantsModalOpen}
        onClose={() => setIsParticipantsModalOpen(false)}
        onSelect={setSelectedParticipants}
        selectedParticipants={selectedParticipants}
      />

      <TechStackModal
        isOpen={isTechStackModalOpen}
        onClose={() => setIsTechStackModalOpen(false)}
        onSelect={setSelectedTechStacks}
        selectedTechStacks={selectedTechStacks}
      />

      <div className="flex justify-end mt-8">
        <Button
          variant="secondary"
          onClick={() => { navigation('/meeting/create/detail') }}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default CreateMeetingBasicPage;
