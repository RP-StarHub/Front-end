import React from "react";
import StackIcon from "../../assets/icons/StackIcon.png";
import FinishIcon from "../../assets/icons/FinishIcon.png";
import PlaceIcon from "../../assets/icons/PlaceIcon.png";
import PeopleIcon from "../../assets/icons/PeopleIcon.png";
import DuringIcon from "../../assets/icons/DuringIcon.png";
import { useNavigate } from "react-router-dom";
import { InformCardProps, IconType, IconStyle } from "../../types";

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

function InformCard({
  type,
  postId,
  title,
  skill,
  deadline,
  progress,
  peopleNum,
  place,
}: InformCardProps) {
  const navigate = useNavigate();

  function moveDetail() {
    navigate(`/study/detail/${postId}`);
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md px-5 py-4 cursor-pointer w-3/5 min-w-max"
      onClick={moveDetail}
    >
      <div className="w-full grid grid-cols-2 gap-1">
        <p className="col-span-2 text-bold mb-2 text-label font-gmarket-bold w-full">[{type}] {title}</p>
        {shotInform({ image: StackIcon, title: '스택', content: skill, unit: "" })}
        {shotInform({ image: FinishIcon, title: '마감', content: deadline, unit: "" })}
        {shotInform({ image: DuringIcon, title: '기간', content: progress, unit: "개월" })}
        {shotInform({ image: PeopleIcon, title: '인원', content: peopleNum.toString(), unit: "명" })}
        <div className="col-span-2">
          {shotInform({ image: PlaceIcon, title: '장소', content: place, unit: "" })}
        </div>
      </div>
    </div>
  );
}

export default InformCard;
