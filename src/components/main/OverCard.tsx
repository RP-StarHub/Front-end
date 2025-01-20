import React from "react";
import StackIcon from "../../assets/icons/StackIcon.png";
import FinishIcon from "../../assets/icons/FinishIcon.png";
import PlaceIcon from "../../assets/icons/PlaceIcon.png";
import PeopleIcon from "../../assets/icons/PeopleIcon.png";
import DuringIcon from "../../assets/icons/DuringIcon.png";
import { useNavigate } from "react-router-dom";
import { IconType, IconStyle } from "../../types/models/common";

interface OverCardProps {
  type: string;
  title: string;
  skill: string;
  deadline: string;
  progress: string;
  peopleNum: number;
  place: string;
  onClose: () => void;
  postId: number;
}

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

const ShotInform = ({ image, title, content, unit }: ShotInformProps) => {
  const isPlace = title === "장소";
  let displayContent = content;

  if (isPlace) {
    const match = content.match(/\(([^)]+)\)/);
    displayContent = match ? match[1] : content;
  }

  return (
    <div className="flex flex-row items-center">
      <img
        src={image}
        alt={title}
        style={iconStyles[title]}
      />
      <p className="text-regular text-sub font-scdream4 mx-2">{title}</p>
      <div className="text-bold text-regular font-scdream4">
        {displayContent}{unit}
      </div>
    </div>
  );
};

function OverCard({
  type,
  postId,
  title,
  skill,
  deadline,
  progress,
  peopleNum,
  place,
  onClose
}: OverCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/study/detail/${postId}`);
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
        <div className="flex flex-col gap-2">
          <p className="text-label text-bold font-gmarket-bold">
            [{type}] {title}
          </p>
          <div className="flex items-center gap-12">
            <ShotInform
              image={StackIcon}
              title="스택"
              content={skill}
              unit=""
            />
            <ShotInform
              image={FinishIcon}
              title="마감"
              content={deadline}
              unit=""
            />
          </div>
          <div className="flex items-center gap-12">
            <ShotInform
              image={DuringIcon}
              title="기간"
              content={progress}
              unit="개월"
            />
            <ShotInform
              image={PeopleIcon}
              title="인원"
              content={peopleNum.toString()}
              unit="명"
            />
          </div>
          <div>
            <ShotInform
              image={PlaceIcon}
              title="장소"
              content={place}
              unit=""
            />
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