import React from "react";
import {
  Favorite,
  PeopleAlt,
  Timer,
  CalendarToday,
  RocketLaunch,
  LocationOn
} from "@mui/icons-material";
import { Meeting } from "../../types/models/meeting";
import { toKoreanDuration, toKoreanRecruitmentType } from "../../util/transformKorean";

interface OverCardProps {
  meeting: Meeting;
}

type IconTitleType = '관심' | '스택' | '마감' | '장소' | '인원' | '기간';

const IconComponent = ({ title }: { title: IconTitleType }) => {
  const iconStyle = { fontSize: 18, color: "#7C8BBE" };

  switch (title) {
    case '관심': return <Favorite sx={iconStyle} />;
    case '스택': return <RocketLaunch sx={iconStyle} />;
    case '마감': return <CalendarToday sx={iconStyle} />;
    case '장소': return <LocationOn sx={iconStyle} />;
    case '인원': return <PeopleAlt sx={iconStyle} />;
    case '기간': return <Timer sx={iconStyle} />;
    default: return null;
  }
};

const ShotInform = ({ title, content, unit }: { title: IconTitleType; content: string; unit?: string }) => {
  const isPlace = title === "장소";
  const displayContent = isPlace ? (content.match(/\(([^)]+)\)/) ?? [null, content])[1] : content;

  return (
    <div className="flex flex-row items-center mb-2">
      <IconComponent title={title} />
      <p className="text-center text-regular text-sub font-scdream4 mx-2">{title}</p>
      <div className="text-bold text-regular font-scdream4">
        {displayContent}{unit}
      </div>
    </div>
  );
};

function OverCard({ meeting }: OverCardProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (!target.closest('[aria-label="Close"]')) {
      window.location.href = `/meeting/detail/${meeting.id}`;
    }
  };

  return (
    <div
      className="bg-white h-fit cursor-pointer box-content"
      style={{ width: 'max-content' }}
      onClick={handleClick}
    >
      <div className="flex flex-row justify-between p-5">
        <div className="w-full grid grid-cols-2 gap-1">
          <div className="col-span-2 flex justify-between items-start">
            <p className="text-bold mb-2 text-label font-gmarket-bold truncate max-w-[80%]">
              [{toKoreanRecruitmentType(meeting.recruitmentType)}] {meeting.title}
            </p>
          </div>
          <ShotInform title="관심" content={meeting.likeDto.likeCount.toString()} />
          <ShotInform title="인원" content={meeting.maxParticipants.toString()} unit="명" />
          <ShotInform title="기간" content={toKoreanDuration(meeting.duration)} />
          <ShotInform title="마감" content={meeting.endDate} />
          <div className="col-span-2">
            <ShotInform title="스택" content={meeting.techStacks.join(", ")} />
          </div>
          <div className="col-span-2">
            <ShotInform title="장소" content={meeting.location} />
          </div>
        </div>
        <button
          className="text-sub hover:text-bold self-start font-gmarket-bold ml-2 text-regular"
          aria-label="Close"
        >
          X
        </button>
      </div>
    </div>
  );
}

export default OverCard;