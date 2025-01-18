import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { LoginUserRequest } from '../types/api/user';
import { useLogin } from '../hooks/api/useUser';
import Button from '../components/common/ui/Button';
import TextInput from '../components/common/ui/TextInput';

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState<LoginUserRequest>({
    loginId: '',
    password: '',
  });

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

    if (!loginData.loginId) {
      newErrors.loginId = '아이디를 입력해주세요';
    }

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
    <div className='flex p-12 justify-center items-center bg-background flex-col w-full'>
      <div className='mb-16 text-6xl font-gmarket-bold text-sub'>
        Sign In
      </div>
      <div className='flex flex-col justify-center items-center bg-white rounded-2xl shadow-2xl shadow-gray-300 px-20 py-14 mb-12 w-1/5 '>
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
        />
        <div className='mb-8'/>
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
        />
      </div>
      <Button
        variant="primary"
        size="medium"
        onClick={handleLogin}
        className="mt-10 w-96"
      >
        로그인
      </Button>
      <div className='w-1/2 h-px bg-sub mt-16 mb-5' />
      <div className='flex'>
        <p className='text-regular text-bold mr-4'>
          아직 회원이 아니신가요?
        </p>
        <Link className='text-regular font-scdream6 text-bold' to="/signup">
          회원가입
        </Link>
      </div>
    </div>
  );
};

export default Login;