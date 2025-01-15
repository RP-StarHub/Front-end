import React from 'react';
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import StarIcon from "../../../assets/icons/StarIcon.png";
import { DetailPageProps } from '../../../types';

const PageContainer = styled.div`
  display: flex;
  padding: 50px 200px 50px 200px;
  background-color: #F6F1FB;
  flex-direction: column;
`;

const Box = styled.div`
  padding: 20px;
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  flex-direction: column;
`;

const AddressContent = styled.p`
  margin: 0px 0px 20px 20px;
  width: 700px;
  font-size: 18px;
  font-family: "SCDream4";
  color: #313866;
`;

const TitleText = styled.p`
  margin: 0px 0px 0px 10px;
  font-size: 50px;
  font-family: 'GmarketSans';
  color: #313866;
`;

const AuthText = styled.p`
  margin: 0px 0px 20px 20px;
  font-size: 25px;
  font-family: 'SCDream4';
  color: #7C8BBE;
`;

const SubtitleText = styled.p`
  margin: 0px 0px 20px 20px;
  font-size: 24px;
  font-family: 'SCDream6';
  color: #B3B4DC;
`;

const SubWrapper = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
`;

const TextContent = styled.p`
  margin: 0px 0px 20px 20px;
  width: 300px;
  font-size: 18px;
  font-family: 'SCDream4';
  color: #313866;
`;

const Subbox = styled.div`
  display: flex;
  flex-direction: row;
`;

const TextContent2 = styled.p`
  margin: 0px 0px 20px 20px;
  font-size: 18px;
  font-family: 'SCDream4';
  color: #313866;
`;

const Button = styled.button`
  margin-top: 40px;
  width: 150px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background-color: #B3B4DC;
  font-family: 'SCDream4';
  color: white;
  font-size: 16px;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const HorizontalLine = styled.div`
  width: 100%;
  height: 2px;
  background-color: #7C8BBE;
  margin: 30px 0px 40px 0px;
`;

const RowWrapper = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
  margin: 0px 0px 20px 0px;
`;

const StudyDetailPageFounderDone: React.FC<DetailPageProps> = ({ studyDetail }) => {
  const navigate = useNavigate();

  function moveToApplicantList() {
    navigate(`/applicant/list/${studyDetail[1]}`);
  }

  return (
    <PageContainer>
      <Box>
        <RowWrapper>
          <img src={StarIcon} alt={'Star Icon'} style={{ width: 'auto', height: '50px'}} />
          <TitleText>[{studyDetail[0].type}] {studyDetail[0].title}</TitleText>
        </RowWrapper>
        <AuthText>{studyDetail[0].userName} | {studyDetail[0].createdAt}</AuthText>
        <SubWrapper>
            <SubtitleText>진행 장소</SubtitleText>
            <AddressContent>{studyDetail[0].place}</AddressContent>
        </SubWrapper>
        <Subbox>
          <SubWrapper>
          <SubtitleText>기술 스택</SubtitleText>
          <TextContent>{studyDetail[0].skill}</TextContent>
          </SubWrapper>
          <SubWrapper>
            <SubtitleText>진행 기간</SubtitleText>
            <TextContent>{studyDetail[0].progress}개월</TextContent>
          </SubWrapper>
        </Subbox>
        <Subbox>
          <SubWrapper>
            <SubtitleText>모집 인원</SubtitleText>
            <TextContent>{studyDetail[0].peopleNum}명</TextContent>
          </SubWrapper>
          <SubWrapper>
            <SubtitleText>모집 마감일</SubtitleText>
            <TextContent>{studyDetail[0].deadline}</TextContent>
          </SubWrapper>
        </Subbox>
        <HorizontalLine/>
        <SubtitleText>스터디 소개</SubtitleText>
        <TextContent2>{studyDetail[0].content}</TextContent2>
      </Box>
      <ButtonContainer>
        <Button onClick={moveToApplicantList}>스터디원 보기</Button>
      </ButtonContainer>
    </PageContainer>
  );
};

export default StudyDetailPageFounderDone;