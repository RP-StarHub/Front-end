import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { LoginUserRequest } from '../types/api/user';
import { useLogin } from '../hooks/api/useUser';
import Button from '../components/common/ui/Button';
import TextInput from '../components/common/ui/TextInput';

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
  
  // 에러 상태 추가
  const [errors, setErrors] = useState({
    loginId: '',
    password: ''
  });

  const login = useLogin();

  const validateForm = () => {
    const newErrors = {
      loginId: '',
      password: ''
    };

    // 아이디 검증
    if (!loginData.loginId) {
      newErrors.loginId = '아이디를 입력해주세요';
    }

    // 비밀번호 검증
    if (!loginData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    }

    setErrors(newErrors);
    return !newErrors.loginId && !newErrors.password;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const response = await login.mutateAsync(loginData);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  return (
    <PageContainer>
      <TitleText>Sign In</TitleText>
      <Box>
        <InputWrapper>
          <TextInput
            inputSize="medium"
            type="text"
            name="loginId"
            placeholder="아이디"
            value={loginData.loginId}
            onChange={handleChange}
            fullWidth
            bordered
            error={errors.loginId}
            className="mb-4"
          />
        </InputWrapper>
        <InputWrapper>
          <TextInput
            inputSize="medium"
            type="password"
            name="password"
            placeholder="비밀번호"
            value={loginData.password}
            onChange={handleChange}
            fullWidth
            bordered
            error={errors.password}
            className="mb-4"
          />
        </InputWrapper>
      </Box>
      <Button 
        variant="primary"
        size="medium"
        onClick={handleLogin}
        className="mt-10 w-60"
      >
        로그인
      </Button>
      <HorizontalLine />
      <Text>
        <TextContent>아직 회원이 아니신가요?</TextContent>
        <TextLink to="/signup">회원가입</TextLink>
      </Text>
    </PageContainer>
  );
};

export default Login;