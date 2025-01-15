import React from 'react'
import styled from "styled-components";
// import HumanIcon from "../assets/icons/HumanIcon.png";
import PhoneIcon from "../../assets/icons/PhoneIcon.png";
import MessageIcon from "../../assets/icons/MessageIcon.png";

const PageContainer = styled.div`
  height: 230px;
  width: 280px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
`

// const ProfileImageContainer = styled.div`
//   width: 150px;
//   height: 150px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background-color: #B3B4DC;
//   border-radius: 50%;
//   margin-bottom: 20px;
// `

// const ProfileImage = styled.img`
//   width: 120px;
//   height: 120px;
//   margin-top: 20px;
//   margin-bottom: 20px;
// `

const RowDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`

const NameText = styled.div`
  font-size: 20px;
  font-family: "SCDream6";
  color: #313866;
  margin-right: 5px;
`

const BirthText = styled.div`
  font-size: 16px;
  font-family: "SCDream4";
  color: #7C8BBE;
  margin-left: 5px;
`

const IntroText = styled.div`
  font-size: 16px;
  font-family: "SCDream4";
  color: #313866;
  margin-top: 10px;
  margin-bottom: 10px;
`

const RowLeftDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 10px;
`

const PhoneText = styled.div`
  font-size: 16px;
  font-family: "SCDream4";
  color: #313866;
  /* margin-right: 60px; */
`

const EmailText = styled.div`
  font-size: 16px;
  font-family: "SCDream4";
  color: #313866;
`

interface ProfileCardProps {
  name: string;
  introduction: string;
  email: string;
  phoneNum: string;
  age: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  introduction,
  email,
  phoneNum,
  age
}) => {
  return (
    <PageContainer>
      {/* <ProfileImageContainer>
        <ProfileImage src={HumanIcon} />
      </ProfileImageContainer> */}
      <RowDiv>
        <NameText>{name}</NameText>
        <BirthText>{age}세</BirthText>
      </RowDiv>
      <IntroText>{introduction}</IntroText>
      <RowLeftDiv>
        <img
          src={PhoneIcon}
          style={{ width: "15px", height: "15px", marginRight: "10px" }}
          alt="phoneIcon"
        />
        <PhoneText>{phoneNum}</PhoneText>
      </RowLeftDiv>
      <RowLeftDiv>
        <img
          src={MessageIcon}
          style={{ width: "17px", height: "17px", marginRight: "10px" }}
          alt="messageIcon"
        />
        <EmailText>{email}</EmailText>
      </RowLeftDiv>
    </PageContainer>
  );
}


export default ProfileCard
