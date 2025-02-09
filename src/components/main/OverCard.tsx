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
  const { 
    recruitmentType,
    title,
    likeDto, 
    maxParticipants, 
    duration,
    endDate, 
    techStacks, 
    location 
  } = meeting;

  return (
    <div
      data-overcard
      className="bg-white h-fit cursor-pointer box-content"
      style={{ width: 'max-content' }}
    >
      <div className="flex flex-row justify-between p-5">
        <div className="w-full grid grid-cols-2 gap-1">
          <div className="col-span-2 flex justify-between items-start">
            <p className="text-bold mb-2 text-label font-gmarket-bold truncate max-w-[80%]">
              [{toKoreanRecruitmentType(recruitmentType)}] {title}
            </p>
          </div>
          <ShotInform title="관심" content={likeDto.likeCount.toString()} />
          <ShotInform title="인원" content={maxParticipants.toString()} unit="명" />
          <ShotInform title="기간" content={toKoreanDuration(duration)} />
          <ShotInform title="마감" content={endDate} />
          <div className="col-span-2">
            <ShotInform title="스택" content={techStacks.join(", ")} />
          </div>
          <div className="col-span-2">
            <ShotInform title="장소" content={location} />
          </div>
        </div>
        <button
          data-button="close"
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