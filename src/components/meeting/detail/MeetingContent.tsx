import React from 'react'
import { MeetingDetail } from '../../../types/models/meeting'

interface MeetingContentProps {
  postInfo: MeetingDetail;
}

const MeetingContent: React.FC<MeetingContentProps> = ({ postInfo }) => {
  const {
    description,
    goal,
    otherInfo
  } = postInfo;

  return (
    <div className='flex flex-col bg-white rounded-xl box-border px-16 py-10 
    shadow-md my-4'>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
          <p className="font-scdream6 text-bold text-label mb-4">
            🚀 스터디/프로젝트 소개
          </p>
          <p className="font-scdream4 text-regular text-bold">
            {description}
          </p>
        </div>

        <div className='w-full h-px bg-main my-2' />

        <div className="flex flex-col">
          <p className="font-scdream6 text-bold text-label mb-4">
            👍 목표
          </p>
          <p className="font-scdream4 text-regular text-bold">
            {goal}
          </p>
        </div>

        <div className='w-full h-px bg-main my-2' />

        <div className="flex flex-col">
          <p className="font-scdream6 text-bold text-label mb-4">
            😊 기타 정보
          </p>
          <p className="font-scdream4 text-regular text-bold">
            {otherInfo}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MeetingContent