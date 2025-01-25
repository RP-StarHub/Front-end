import React from "react";
import { useNavigate } from "react-router-dom";
import { Meeting } from "../../types/models/meeting";
import {
  Favorite,
  PeopleAlt,
  Timer,
  CalendarToday,
  RocketLaunch,
  LocationOn
} from "@mui/icons-material";

type IconTitleType = '관심' | '스택' | '마감' | '장소' | '인원' | '기간';

const IconComponent = ({ title }: { title: IconTitleType }) => {
  const iconStyle = { fontSize: 18, color: "#7C8BBE" };

  switch (title) {
    case '관심':
      return <Favorite sx={iconStyle} />;
    case '스택':
      return <RocketLaunch sx={iconStyle} />;
    case '마감':
      return <CalendarToday sx={iconStyle} />;
    case '장소':
      return <LocationOn sx={iconStyle} />;
    case '인원':
      return <PeopleAlt sx={iconStyle} />;
    case '기간':
      return <Timer sx={iconStyle} />;
    default:
      return null;
  }
};

interface ShotInformProps {
  title: IconTitleType;
  content: string;
  unit: string;
}

const ShotInform = ({ title, content, unit }: ShotInformProps) => {
  const isPlace = title === "장소";
  let displayContent = content;

  if (isPlace) {
    const match = content.match(/\(([^)]+)\)/);
    displayContent = match ? match[1] : content;
  }

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

interface OverCardProps {
  meeting: Meeting;
  onClose: () => void;
}

function OverCard({ meeting, onClose }: OverCardProps) {
  const navigate = useNavigate();
  const {
    id,
    title,
    recruitmentType,
    maxParticipants,
    duration,
    endDate,
    techStacks,
    location,
    likeDto: { likeCount }
  } = meeting;

  const handleClick = () => {
    navigate(`/study/detail/${id}`);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
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
              [{recruitmentType}] {title}
            </p>
          </div>
          <ShotInform title="관심" content={likeCount.toString()} unit="" />
          <ShotInform title="인원" content={maxParticipants.toString()} unit="명" />
          <ShotInform title="기간" content={duration.toString()} unit="개월" />
          <ShotInform title="마감" content={endDate} unit="" />
          <div className="col-span-2">
            <ShotInform title="스택" content={techStacks.join(", ")} unit="" />
          </div>
          <div className="col-span-2">
            <ShotInform title="장소" content={location} unit="" />
          </div>
        </div>
        <button
          onClick={handleClose}
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