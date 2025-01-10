import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";
import axios from 'axios';
import { LoginUserRequest, PostUserLogin } from '../types/api/user';

const PageContainer = styled.div`
  display: flex;
  padding: 50px;
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 450px;
  height: 250px;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  flex-direction: column;
`;

const InputWrapper = styled.div`
  margin-bottom: 10px;
`;

const Input = styled.input`
  margin-bottom: 15px;
  padding: 15px;
  border: 3px solid #B3B4DC;
  border-radius: 10px;
  width: 300px;
  font-size: 18px;
  font-family: 'SCDream4';
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

const HorizontalLine = styled.div`
  width: 50%;
  height: 2px;
  background-color: #7C8BBE;
  margin: 60px 0px 10px 0px;
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

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState<LoginUserRequest>({
    loginId: '',
    password: '',
  });

  const handleLogin = async () => {
    try {
      const response = await axios.post<PostUserLogin>(
        `${process.env.REACT_APP_API_URL}/api/user/login`,
        loginData
      );

      // 서버에서 받은 로그인 정보를 localStorage에 저장
      localStorage.setItem('userInfo', JSON.stringify(response.data.data));
    
      navigate('/');
      window.location.reload();
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        alert('로그인에 실패했습니다.');
      }
    }
  };

  // localStorage에서 정보 삭제하기
  // localStorage.removeItem('userInfo');

  // localStorage에서 정보 가져오기 및 확인하기
  // const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  // console.log(userInfo)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  }

  return (
    <PageContainer>
      <TitleText>Sign In</TitleText>
      <Box>
        <InputWrapper>
          <Input
            type="text"
            name="loginId"
            placeholder="아이디"
            value={loginData.loginId}
            onChange={handleChange}
          />
        </InputWrapper>
        <InputWrapper>
          <Input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={loginData.password}
            onChange={handleChange}
          />
        </InputWrapper>
      </Box>
      <Button onClick={handleLogin}>Login</Button>
      <HorizontalLine />
      <Text>
        <TextContent>아직 회원이 아니신가요?</TextContent>
        <TextLink to="/signup">회원가입</TextLink>
      </Text>
    </PageContainer>
  );
};

export default Login;
