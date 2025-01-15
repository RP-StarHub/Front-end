import React, { useEffect } from "react";
import styled from "styled-components";
import StarIcon from "../assets/icons/StarIcon.png";
import { AddressSearch } from "../components/study/form/AddressSearch";
import { useRecruitForm } from "../hooks/study/useRecruitForm";

const PageContainer = styled.div`
  padding: 50px 100px 50px 100px;
  display: flex;
  background-color: #f6f1fb;
  flex-direction: column;
`;

const Info = styled.div`
  padding: 20px 0px 50px 0px;
  display: flex;
  flex-direction: column;
`;

const Intro = styled.div`
  padding: 20px 0px 50px 0px;
  display: flex;
  flex-direction: column;
`;

const HorizontalLine = styled.div`
  width: 100%;
  height: 2px;
  background-color: #7c8bbe;
  margin: 0px;
`;

const TitleText = styled.p`
  margin: 0px 0px 0px 10px;
  font-size: 24px;
  font-family: "GmarketSans";
  color: #7c8bbe;
`;

const InputWrapper = styled.div`
  flex-direction: column;
  margin: 0px 20px;
`;

const Inputbox = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Input = styled.input`
  margin-top: 5px;
  margin-bottom: 15px;
  padding: 15px;
  border: 3px solid #b3b4dc;
  border-radius: 10px;
  width: 35vw;
  font-size: 18px;
  font-family: "SCDream4", sans-serif;
`;

const TextInput = styled.p`
  flex-direction: column;
  margin: 0px;
  font-size: 18px;
  font-family: "SCDream4";
  color: #b3b4dc;
`;

const Textarea = styled.textarea`
  margin-bottom: 15px;
  padding: 15px;
  border: 3px solid #b3b4dc;
  border-radius: 10px;
  width: 100%;
  height: 450px;
  font-size: 18px;
  font-family: "SCDream4", sans-serif;
  resize: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  width: 100px;
  height: 50px;
  border: none;
  border-radius: 10px;
  background-color: #b3b4dc;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  font-family: "SCDream6";
  color: white;
  font-size: 16px;
  cursor: pointer;
`;

const RowWrapper = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
`;

const StudyRecruitPage = () => {
  const {
    formData,
    latLng,
    setFormData,
    setAddressObj,
    setLatLng,
    handleInputChange,
    handleSubmit,
  } = useRecruitForm();

  useEffect(() => {
    console.log("Latitude:", latLng.latitude);
    console.log("Longitude:", latLng.longitude);
    // window.location.reload();
  }, [latLng]);

  return (
    <PageContainer>
      <RowWrapper>
        <img
          src={StarIcon}
          alt={"Star Icon"}
          style={{ width: "auto", height: "20px" }}
        />
        <TitleText>프로젝트 기본 정보</TitleText>
      </RowWrapper>
      <HorizontalLine />
      <Info>
        <Inputbox>
          <InputWrapper>
            <TextInput>모집 구분</TextInput>
            <Input
              type="text"
              name="type"
              placeholder="스터디와 프로젝트 중 선택해주세요."
              value={formData.type}
              onChange={handleInputChange}
            />
          </InputWrapper>
          <InputWrapper>
            <TextInput>기술 스택</TextInput>
            <Input
              type="text"
              name="skill"
              placeholder="사용되는 기술 스택을 입력해주세요. ex) 리액트, 스프링..."
              value={formData.skill}
              onChange={handleInputChange}
            />
          </InputWrapper>
        </Inputbox>
        <Inputbox>
          <InputWrapper>
            <TextInput>모집 인원</TextInput>
            <Input
              type="text"
              name="peopleNum"
              placeholder="모집 인원 수를 입력해주세요. ex) 3~5"
              value={formData.peopleNum}
              onChange={handleInputChange}
            />
          </InputWrapper>
          <InputWrapper>
            <TextInput>진행 기간</TextInput>
            <Input
              type="text"
              name="progress"
              placeholder="진행 기간을 입력해주세요."
              value={formData.progress}
              onChange={handleInputChange}
            />
          </InputWrapper>
        </Inputbox>
        <Inputbox>
          <InputWrapper>
            <TextInput>진행 장소</TextInput>
            <AddressSearch
              addressValue={formData.place}
              setAddressObj={setAddressObj}
              setLatLng={setLatLng}
              setFormData={setFormData}
              handleInputChange={handleInputChange}
            />
          </InputWrapper>
          <InputWrapper>
            <TextInput>모집 마감일</TextInput>
            <Input
              type="text"
              name="deadline"
              placeholder="**** - ** - **"
              value={formData.deadline}
              onChange={handleInputChange}
            />
          </InputWrapper>
        </Inputbox>
      </Info>
      <RowWrapper>
        <img
          src={StarIcon}
          alt={"Star Icon"}
          style={{ width: "auto", height: "20px" }}
        />
        <TitleText>프로젝트 소개</TitleText>
      </RowWrapper>
      <HorizontalLine />
      <Intro>
        <TextInput>제목</TextInput>
        <Input
          type="text"
          name="title"
          placeholder="제목을 입력해주세요."
          value={formData.title}
          onChange={handleInputChange}
        />
        <TextInput>내용</TextInput>
        <Textarea
          name="content"
          placeholder="내용을 입력해주세요."
          value={formData.content}
          onChange={handleInputChange}
        />
      </Intro>
      <ButtonContainer>
        <Button onClick={handleSubmit}>글 등록</Button>
      </ButtonContainer>
    </PageContainer>
  );
};

export default StudyRecruitPage;
