import React from "react";
import StackIcon from "../../assets/icons/StackIcon.png";
import FinishIcon from "../../assets/icons/FinishIcon.png";
import PlaceIcon from "../../assets/icons/PlaceIcon.png";
import PeopleIcon from "../../assets/icons/PeopleIcon.png";
import DuringIcon from "../../assets/icons/DuringIcon.png";
import { useNavigate } from "react-router-dom";
import { IconType, IconStyle } from "../../types/models/common"
import { Meeting } from "../../types/models/meeting";

const iconStyles: Record<IconType, IconStyle> = {
  '스택': {
    width: "14px",
    height: "14px",
    margin: "4px"
  },
  '마감': {
    width: "14px",
    height: "16px",
    margin: "3px 4px"
  },
  '장소': {
    width: "10px",
    height: "16px",
    margin: "3px 6px"
  },
  '인원': {
    width: "16px",
    height: "14px",
    margin: "4px 3px"
  },
  '기간': {
    width: "14px",
    height: "14px",
    margin: "4px"
  }
};

interface ShotInformProps {
  image: string;
  title: IconType;
  content: string;
  unit: string;
}

const shotInform = ({ image, title, content, unit }: ShotInformProps) => {
  const isPlace = title === "장소";
  let displayContent = content;

  if (isPlace) {
    const match = content.match(/\(([^)]+)\)/);
    displayContent = match ? match[1] : "";
  }

  return (
    <div className="flex flex-row items-center mb-2">
      <img
        src={image}
        alt={title}
        style={iconStyles[title]}
      />
      <p className="text-center text-regular text-sub font-scdream4 mx-2">{title}</p>
      <div
        className="text-bold text-regular font-scdream4"
      >
        {displayContent}{unit}
      </div>
    </div>
  );
}

interface Props {
  meeting: Meeting;
}

function InformCard({ meeting }: Props) {
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
    latitude,
    longitude,
    likeDto
  } = meeting;

  function moveDetail() {
    navigate(`/study/detail/${id}`);
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md px-5 py-4 cursor-pointer w-3/5 min-w-max"
      onClick={moveDetail}
    >
      <div className="w-full grid grid-cols-2 gap-1">
        <p className="col-span-2 text-bold mb-2 text-label font-gmarket-bold w-full">[{recruitmentType}] {title}</p>
        {shotInform({ image: StackIcon, title: '스택', content: techStacks.join(", "), unit: "" })}
        {shotInform({ image: FinishIcon, title: '마감', content: endDate, unit: "" })}
        {shotInform({ image: DuringIcon, title: '기간', content: duration.toString(), unit: "" })}
        {shotInform({ image: PeopleIcon, title: '인원', content: maxParticipants.toString(), unit: "명" })}
        <div className="col-span-2">
          {shotInform({ image: PlaceIcon, title: '장소', content: location, unit: "" })}
        </div>
      </div>
    </div>
  );
}

export default InformCard;
