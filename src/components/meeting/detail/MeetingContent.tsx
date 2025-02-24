import React from "react"
import { MeetingDetail } from "../../../types/models/meeting"

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
    <div
      className="flex flex-col bg-white rounded-xl box-border px-16 py-10 shadow-md my-4"
      data-testid="meeting-content"
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
          <p
            className="font-scdream6 text-bold text-label mb-4"
            data-testid="description-label"
          >
            🚀 스터디/프로젝트 소개
          </p>
          <p
            className="font-scdream4 text-regular text-bold"
            data-testid="description-content"
          >
            {description}
          </p>
        </div>

        <div className="w-full h-px bg-main my-2" data-testid="divider" />

        <div className="flex flex-col">
          <p
            className="font-scdream6 text-bold text-label mb-4"
            data-testid="goal-label"
          >
            👍 목표
          </p>
          <p
            className="font-scdream4 text-regular text-bold"
            data-testid="goal-content"
          >
            {goal}
          </p>
        </div>

        <div className="w-full h-px bg-main my-2" data-testid="divider" />

        <div className="flex flex-col">
          <p
            className="font-scdream6 text-bold text-label mb-4"
            data-testid="other-info-label"
          >
            😊 기타 정보
          </p>
          <p
            className="font-scdream4 text-regular text-bold"
            data-testid="other-info-content"
          >
            {otherInfo}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MeetingContent