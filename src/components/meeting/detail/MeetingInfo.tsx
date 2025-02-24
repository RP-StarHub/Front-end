import React from 'react'
import { MeetingDetail } from '../../../types/models/meeting'
import { toKoreanDuration } from '../../../util/transformKorean';

interface MeetingInfoProps {
  postInfo: MeetingDetail;
}

const MeetingInfo: React.FC<MeetingInfoProps> = ({ postInfo }) => {
  const {
    location,
    techStacks,
    duration,
    maxParticipants,
    endDate,
  } = postInfo;

  const getDisplayParticipants = () => {
    if (!maxParticipants) return "1명";
    if (maxParticipants === 10) return "10명 이상";
    return `${maxParticipants}명`;
  };

  return (
    <div
      className="flex flex-col bg-white rounded-xl box-border px-16 py-10 shadow-md my-4"
      data-testid="meeting-info"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center col-span-2">
          <p className="font-scdream6 text-bold text-label" data-testid="tech-stack-label">
            기술 스택
          </p>
          <p className="font-scdream4 text-regular text-bold ml-4" data-testid="tech-stack-content">
            {techStacks.join(", ")}
          </p>
        </div>

        <div className="flex items-center">
          <p className="font-scdream6 text-bold text-label" data-testid="location-label">
            진행 장소
          </p>
          <p className="font-scdream4 text-regular text-bold ml-4" data-testid="location-content">
            {location}
          </p>
        </div>

        <div className="flex items-center">
          <p className="font-scdream6 text-bold text-label" data-testid="duration-label">
            진행 기간
          </p>
          <p className="font-scdream4 text-regular text-bold ml-4" data-testid="duration-content">
            {toKoreanDuration(duration)}
          </p>
        </div>

        <div className="flex items-center">
          <p className="font-scdream6 text-bold text-label" data-testid="participants-label">
            모집 인원
          </p>
          <p className="font-scdream4 text-regular text-bold ml-4" data-testid="participants-content">
            {getDisplayParticipants()}
          </p>
        </div>

        <div className="flex items-center">
          <p className="font-scdream6 text-bold text-label" data-testid="end-date-label">
            모집 마감일
          </p>
          <p className="font-scdream4 text-regular text-bold ml-4" data-testid="end-date-content">
            {endDate}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MeetingInfo