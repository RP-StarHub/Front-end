import React from "react";
import styled from "styled-components";
import StackIcon from "../assets/icons/StackIcon.png";
import FinishIcon from "../assets/icons/FinishIcon.png";
import PlaceIcon from "../assets/icons/PlaceIcon.png";
import PeopleIcon from "../assets/icons/PeopleIcon.png";
import DuringIcon from "../assets/icons/DuringIcon.png";
import { useNavigate } from "react-router-dom";
import { InformCardProps, IconType, IconStyle } from "../types";

const PageContainer = styled.div`
  width: 335px;
  height: 100px;
  border-radius: 5px;
  padding: 10px 20px;
  padding-bottom: 32px;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
`;

const GridContainer = styled.div`
  width: 335px;
  height: 100px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto auto auto;
  padding-bottom: 2px;
`;

const TitleContainer = styled.div`
  grid-column: span 2;
  color: #313866;
  font-size: 20px;
  font-family: "GmarketSans";
  width: 100%;
  /* margin-bottom: 3px; */
`;

const ShortContainer = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 16px;
  align-items: center;
  margin-bottom: 7px;
`;

const ShortTitleContainer = styled.div`
  text-decoration: none;
  text-align: center;
  align-items: center;
  color: #7c8bbe;
  font-size: 16px;
  font-family: "SCDream4";
  margin: 0px 5px;
`;

const ShortDetailContainer = styled.div`
  text-decoration: none;
  /* text-align: center; */
  color: #313866;
  font-size: 16px;
  font-family: "SCDream4";
`;

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
    <ShortContainer>
      <img
        src={image}
        alt={title}
        style={iconStyles[title]}
      />
      <ShortTitleContainer>{title}</ShortTitleContainer>
      <ShortDetailContainer style={{ width: isPlace ? "80%" : "auto" }}>
        {displayContent} {unit}
      </ShortDetailContainer>
    </ShortContainer>
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
    navigate(`/studydetail/${postId}`); 
  }

  return (
    <PageContainer onClick={moveDetail}>
      <GridContainer>
        <TitleContainer>[{type}] {title}</TitleContainer>
        {shotInform({ image: StackIcon, title: '스택', content: skill, unit: "" })}
        {shotInform({ image: FinishIcon, title: '마감', content: deadline, unit: "" })}
        {shotInform({ image: DuringIcon, title: '기간', content: progress, unit: "개월" })}
        {shotInform({ image: PeopleIcon, title: '인원', content: peopleNum.toString(), unit: "명" })}
      </GridContainer>
      {shotInform({ image: PlaceIcon, title: '장소', content: place, unit: "" })}
    </PageContainer>
  );
}

export default InformCard;
