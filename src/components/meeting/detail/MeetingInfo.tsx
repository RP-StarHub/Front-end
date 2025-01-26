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

  return (
    <div className='flex flex-col bg-white rounded-xl box-border px-16 py-10 
    shadow-md my-4'>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center col-span-2">
          <p className="font-scdream6 text-bold text-label">
            기술 스택
          </p>
          <p className="font-scdream4 text-regular text-bold ml-4">
            {techStacks.join(", ")}
          </p>
        </div>

        <div className="flex items-center">
          <p className="font-scdream6 text-bold text-label">
            진행 장소
          </p>
          <p className="font-scdream4 text-regular text-bold ml-4">
            {location}
          </p>
        </div>

        <div className="flex items-center">
          <p className="font-scdream6 text-bold text-label">
            진행 기간
          </p>
          <p className="font-scdream4 text-regular text-bold ml-4">
            {toKoreanDuration(duration)}
          </p>
        </div>

        <div className="flex items-center">
          <p className="font-scdream6 text-bold text-label">
            모집 인원
          </p>
          <p className="font-scdream4 text-regular text-bold ml-4">
            {maxParticipants.toString()}명
          </p>
        </div>

        <div className="flex items-center">
          <p className="font-scdream6 text-bold text-label">
            모집 마감일
          </p>
          <p className="font-scdream4 text-regular text-bold ml-4">
            {endDate}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MeetingInfo