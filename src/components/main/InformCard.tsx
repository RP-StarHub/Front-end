import React from "react";
import { useNavigate } from "react-router-dom";
import { Meeting } from "../../types/models/meeting";
import {
  FavoriteBorder,
  Favorite,
  PeopleAlt,
  Timer,
  CalendarToday,
  RocketLaunch,
  LocationOn
} from "@mui/icons-material";
import { toKoreanDuration, toKoreanRecruitmentType } from "../../util/transformKorean";
import { useLike } from "../../hooks/api/useLike";

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
  unit?: string;
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

interface Props {
  meeting: Meeting;
  onLikeToggle: (id: number) => void;
}

function InformCard({ meeting, onLikeToggle }: Props) {
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
    likeDto: { isLiked, likeCount }
  } = meeting;
  const { toggleLike } = useLike(meeting.id);

  const moveDetail = () => {
    navigate(`/study/detail/${id}`);
  }

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike.mutate(meeting.likeDto.isLiked);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md px-5 py-4 cursor-pointer w-3/5 min-w-max"
      onClick={moveDetail}
    >
      <div className="w-full grid grid-cols-2 gap-1">
        <div className="col-span-2 flex justify-between items-start">
          <p className="text-bold mb-2 text-label font-gmarket-bold truncate max-w-[80%]">
            [{toKoreanRecruitmentType(recruitmentType)}] {title}
          </p>
          <div onClick={handleLikeClick}>
            { isLiked ?
              <Favorite sx={{ fontSize: 28, color: "#7C8BBE" }} /> :
              <FavoriteBorder sx={{ fontSize: 28, color: "#7C8BBE" }} />
            }
          </div>
        </div>
        <ShotInform title="관심" content={likeCount.toString()}/>
        <ShotInform title="인원" content={maxParticipants.toString()} unit="명" />
        <ShotInform title="기간" content={toKoreanDuration(duration)}/>
        <ShotInform title="마감" content={endDate}/>
        <div className="col-span-2">
          <ShotInform title="스택" content={techStacks.join(", ")}/>
        </div>
        <div className="col-span-2">
          <ShotInform title="장소" content={location}/>
        </div>
      </div>
    </div>
  );
}

export default InformCard;