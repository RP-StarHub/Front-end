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
import { useNavigate } from "react-router-dom";

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

interface ShotInformProps {
  title: IconTitleType;
  content: string;
}

const ShotInform = ({ title, content }: ShotInformProps) => {
  const isPlace = title === "장소";
  let displayContent = content;

  if (isPlace) {
    const match = content.match(/\(([^)]+)\)/);
    displayContent = match ? match[1] : content;
  }

  return (
    <div
      className="flex flex-row items-center mb-2"
      data-testid={`inform-${title}`}
    >
      <IconComponent title={title} />
      <p
        className="text-center text-regular text-sub font-scdream4 mx-2"
        data-testid={`inform-${title}-label`}
      >
        {title}
      </p>
      <div
        className="text-bold text-regular font-scdream4"
        data-testid={`inform-${title}-content`}
      >
        {displayContent}
      </div>
    </div>
  );
};

function OverCard({ meeting }: OverCardProps) {
  const navigate = useNavigate();
  const {
    id,
    recruitmentType,
    title,
    likeDto,
    maxParticipants,
    duration,
    endDate,
    techStacks,
    location
  } = meeting;

  const moveDetail = () => {
    navigate(`/meeting/detail/${id}`);
  }

  const getDisplayParticipants = () => {
    if (!maxParticipants) return "1명";
    if (maxParticipants === 10) return "10명 이상";
    return `${maxParticipants}명`;
  };

  return (
    <div
      data-overcard
      data-testid="overcard"
      className="bg-white h-fit cursor-pointer box-content"
      onClick={moveDetail}
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
          <ShotInform title="인원" content={getDisplayParticipants()} />
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