import React, { useState } from 'react';
import styled from "styled-components";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import StarIcon from "../assets/icons/StarIcon.png";

const PageContainer = styled.div`
  padding: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F6F1FB;
  flex-direction: column;
`;

const TitleText = styled.p`
  margin: 0px 0px 50px 0px;
  font-size: 50px;
  font-family: 'GmarketSans';
  color: #7C8BBE;
`;

const Box = styled.div`
  margin: 50px 0px 0px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  flex-direction: column;
  padding: 50px;
`;

const InputWrapper = styled.div`
  margin-bottom: 10px;
`;

const Input = styled.input`
  margin-bottom: 15px;
  padding: 15px;
  border: 3px solid #B3B4DC;
  border-radius: 10px;
  width: 30vw;
  font-size: 18px;
  font-family: 'SCDream4';
`;

const Textarea = styled.textarea`
  margin-bottom: 15px;
  padding: 15px;
  border: 3px solid #B3B4DC;
  border-radius: 10px;
  width: 30vw;
  font-size: 18px;
  font-family: 'SCDream4';
  resize: none;
`;

const TextInput = styled.p`
  margin: 0px;
  font-size: 18px;
  font-family: 'SCDream4';
  color: #B3B4DC;
`;

const TextStudy = styled.p`
  margin: 0px 0px 0px 10px;
  font-size: 18px;
  font-family: 'SCDream4';
  color: #B3B4DC;
`;

const HorizontalLine = styled.div`
  width: 30vw;
  height: 2px;
  background-color: #7C8BBE;
  margin: 10px 0px 20px 0px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-top: 40px;
  width: 250px;
  height: 50px;
  border: none;
  border-radius: 10px;
  background-color: #B3B4DC;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  font-family: 'SCDream6';
  color: white;
  font-size: 16px;
  cursor: pointer;
`;

const TextContent = styled.p`
  margin: 0px 10px 0px 0px;
  font-size: 18px;
  font-family: 'SCDream4';
  color: #313866;
`;

const TextLink = styled(Link)`
  text-decoration: none;
  font-size: 18px;
  font-family: 'SCDream6';
  color: #313866;
`;

const Text = styled.div`
  display: flex;
`;

const RowWrapper = styled.div`
  flex-direction: row;
  display: flex;
  margin: 10px 0px 30px 0px;
  align-items: center;
`;

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
    name: "",
    age: "",
    email: "",
    phoneNum: "",
    introduction: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = 'http://localhost:8080/api/user/register';

    const form = new FormData();
    form.append('info', JSON.stringify(formData));

    try {
      const response = await axios.post(url, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        
        // 서버에서 받은 로그인 정보를 localStorage에 저장
        localStorage.setItem('userInfo', JSON.stringify(response.data.data));
        navigate('/');
      } else {
        console.error('Signup failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <PageContainer>
      <TitleText>Sign Up</TitleText>
      <Text>
        <TextContent>이미 StarHub 회원이신가요?</TextContent>
        <TextLink to="/login">로그인</TextLink>
      </Text>
      <Box>
        <form onSubmit={handleSubmit}>
          <InputWrapper>
            <TextInput>아이디</TextInput>
            <Input
              type="text"
              name="loginId"
              value={formData.loginId}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <TextInput>비밀번호</TextInput>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </InputWrapper>
          <HorizontalLine />
          <RowWrapper>
            <img src={StarIcon} alt={'Star Icon'} style={{ width: 'auto', height: '17px' }} />
            <TextStudy>스터디 연락을 위한 정보입니다.</TextStudy>
          </RowWrapper>
          <InputWrapper>
            <TextInput>이름</TextInput>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <TextInput>나이</TextInput>
            <Input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <TextInput>이메일</TextInput>
            <Input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <TextInput>전화번호</TextInput>
            <Input
              type="text"
              name="phoneNum"
              value={formData.phoneNum}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <TextInput>한 줄 소개</TextInput>
            <Textarea
              type="text"
              name="introduction"
              value={formData.introduction}
              onChange={handleChange}
            />
          </InputWrapper>
          <Button type="submit">Sign Up</Button>
        </form>
      </Box>
    </PageContainer>
  );
};

export default Signup;
