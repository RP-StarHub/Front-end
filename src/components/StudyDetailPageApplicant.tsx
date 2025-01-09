import React, {useState} from "react";
import styled from "styled-components";

import StarIcon from "../assets/icons/StarIcon.png";
import CommentList from "./CommentList";
import axios from 'axios';
import { StudyDetail } from "../types";

const PageContainer = styled.div`
  display: flex;
  padding: 50px 200px 50px 200px;
  background-color: #fff;
  flex-direction: column;
`;

const Box = styled.div`
  padding: 20px;
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-color: #fff;
  // box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  flex-direction: column;
`;

const TitleText = styled.p`
  margin: 0px 0px 0px 10px;
  font-size: 50px;
  font-family: "GmarketSans";
  color: #313866;
`;

const AuthText = styled.p`
  margin: 0px 0px 20px 20px;
  font-size: 25px;
  font-family: "SCDream4";
  color: #7c8bbe;
`;

const SubtitleText = styled.p`
  margin: 0px 0px 20px 20px;
  font-size: 24px;
  font-family: "SCDream6";
  color: #b3b4dc;
`;

const SubWrapper = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
`;

const AddressContent = styled.p`
  margin: 0px 0px 20px 20px;
  width: 700px;
  font-size: 18px;
  font-family: "SCDream4";
  color: #313866;
`;

const TextContent = styled.p`
  margin: 0px 0px 20px 20px;
  width: 300px;
  font-size: 18px;
  font-family: "SCDream4";
  color: #313866;
`;

const Subbox = styled.div`
  display: flex;
  flex-direction: row;
`;

const TextContent2 = styled.p`
  margin: 0px 0px 20px 20px;
  font-size: 18px;
  font-family: "SCDream4";
  color: #313866;
`;

const HorizontalLine = styled.div`
  width: 100%;
  height: 2px;
  background-color: #7c8bbe;
  margin: 30px 0px 40px 0px;
`;

const RowWrapper = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
  margin: 0px 0px 20px 0px;
`;

const CommentArea = styled.div`
  padding: 0px 20px;
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const Textarea = styled.textarea`
  flex: 1;
  padding: 15px;
  border: 3px solid #7c8bbe;
  border-radius: 25px;
  font-size: 18px;
  font-family: "SCDream4", sans-serif;
  resize: none;
`;

const CommentButton = styled.button`
  margin-top: 10px;
  width: 95px;
  height: 35px;
  border: none;
  border-radius: 30px;
  background-color: #b3b4dc;
  font-family: "SCDream4";
  color: white;
  font-size: 16px;
  cursor: pointer;
`;

const CommentButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StudyDetailPageApplicant = (data: StudyDetail) => {
  const [comment, setComment] = useState("");
  // console.log(data);

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const userId = userInfo.userId;

  const handleSubmit = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/comment/create`, {
        postId:data.studyDetail[1],
        userId:userId,
        content:comment,
        pick:false,
      })
      .then((response) => {
        // console.log(response.data)
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error fetching comment create:', error.message);
      });
  };

  return (
    <PageContainer>
      <Box>
        <RowWrapper>
          <img
            src={StarIcon}
            alt={"Star Icon"}
            style={{ width: "auto", height: "50px" }}
          />
          <TitleText>
            [{data.studyDetail[0].type}] {data.studyDetail[0].title}
          </TitleText>
        </RowWrapper>
        <AuthText>
          {data.studyDetail[0].userName} | {data.studyDetail[0].createdAt}.
        </AuthText>
        <SubWrapper>
          <SubWrapper>
            <SubtitleText>진행 장소</SubtitleText>
            <AddressContent>{data.studyDetail[0].place}</AddressContent>
          </SubWrapper>
        </SubWrapper>
        <Subbox>
          <SubWrapper>
            <SubtitleText>기술 스택</SubtitleText>
            <TextContent>{data.studyDetail[0].skill}</TextContent>
          </SubWrapper>
          <SubWrapper>
            <SubtitleText>진행 기간</SubtitleText>
            <TextContent>{data.studyDetail[0].progress}개월</TextContent>
          </SubWrapper>
        </Subbox>
        <Subbox>
          <SubWrapper>
            <SubtitleText>모집 인원</SubtitleText>
            <TextContent>{data.studyDetail[0].peopleNum}명</TextContent>
          </SubWrapper>
          <SubWrapper>
            <SubtitleText>모집 마감일</SubtitleText>
            <TextContent>{data.studyDetail[0].deadline}</TextContent>
          </SubWrapper>
        </Subbox>
        <HorizontalLine />
        <SubtitleText>스터디 소개</SubtitleText>
        <TextContent2>{data.studyDetail[0].content}</TextContent2>
        <HorizontalLine />
      </Box>
      <SubtitleText>댓글</SubtitleText>
      <CommentArea>
        <Textarea
          placeholder="댓글을 입력해주세요."
          onChange={(e) => setComment(e.target.value)}
        />
        <CommentButtonContainer>
          <CommentButton onClick={handleSubmit}>등록</CommentButton>
        </CommentButtonContainer>
        <CommentList 
          comments={data.studyDetail[2]} 
          isSelectable={false}
          postId={data.studyDetail[1]}
        />
      </CommentArea>
    </PageContainer>
  );
};

export default StudyDetailPageApplicant;
