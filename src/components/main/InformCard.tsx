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

export type IconTitleType = '관심' | '스택' | '마감' | '장소' | '인원' | '기간';

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
}

const ShotInform = ({ title, content }: ShotInformProps) => {
  const isPlace = title === "장소";
  let displayContent = content;

  if (isPlace) {
    const match = content.match(/\(([^)]+)\)/);
    displayContent = match ? match[1] : content;
  }

  // 타이틀별로 다른 스타일 적용
  let contentClassName = "text-bold text-regular font-scdream4";
  
  // 스택과 장소일 경우 말줄임표 스타일 추가
  if (title === "스택" || title === "장소") {
    contentClassName += " overflow-hidden text-ellipsis whitespace-nowrap";
    
    // 스택과 장소는 더 넓은 공간 차지
    if (title === "스택") {
      contentClassName += " max-w-[400px]";
    } else {
      contentClassName += " max-w-[350px]";
    }
  }

  return (
    <div
      className="flex flex-row items-center mb-2"
      data-testid={`inform-${title}`}
    >
      <IconComponent title={title} />
      <p
        className="text-center text-regular text-sub font-scdream4 mx-2 flex-shrink-0"
        data-testid={`inform-${title}-label`}
      >
        {title}
      </p>
      <div className={contentClassName} title={displayContent}>
        {displayContent}
      </div>
    </div>
  );
};

interface Props {
  meeting: Meeting;
  fullWidth?: boolean;
}

const InformCard: React.FC<Props> = ({ meeting, fullWidth }) => {
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
    navigate(`/meeting/detail/${id}`);
  }

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike.mutate(meeting.likeDto.isLiked || false);
  };

  const getDisplayParticipants = () => {
    if (!maxParticipants) return "1명";
    if (maxParticipants === 10) return "10명 이상";
    return `${maxParticipants}명`;
  };

  const widthClass = fullWidth ? 'w-full' : 'w-3/5 min-w-max';

  return (
    <div
      className={`bg-white rounded-lg shadow-md px-5 py-3 cursor-pointer ${widthClass}`}
      onClick={moveDetail}
      data-testid="inform-card"
    >
      <div className="w-full">
        <div className="flex justify-between items-start mb-3">
          <p className="text-bold text-label font-gmarket-bold truncate max-w-[80%]">
            [{toKoreanRecruitmentType(recruitmentType)}] {title}
          </p>
          <div onClick={handleLikeClick} className="flex-shrink-0 ml-2">
            {isLiked ?
              <Favorite
                sx={{ fontSize: 28, color: "#7C8BBE" }}
                data-testid="like-filled-button"
              /> :
              <FavoriteBorder
                sx={{ fontSize: 28, color: "#7C8BBE" }}
                data-testid="like-border-button"
              />
            }
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4">
          <ShotInform title="관심" content={likeCount.toString()}/>
          <ShotInform title="인원" content={getDisplayParticipants()} />
          <ShotInform title="기간" content={toKoreanDuration(duration)}/>
          <ShotInform title="마감" content={endDate}/>
        </div>
        
        <div className="mt-1">
          <ShotInform title="스택" content={techStacks.join(", ")}/>
        </div>
        
        <div className="mt-1">
          <ShotInform title="장소" content={location}/>
        </div>
      </div>
    </div>
  );
};

export default InformCard;