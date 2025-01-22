import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { LoginUserRequest } from '../types/api/user';
import { useLogin } from '../hooks/api/useUser';
import { useAuthStore } from '../store';
import ProfileSetupFlow from '../components/profile/ProfileSetupFlow';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Button from '../components/common/ui/Button';
import TextInput from '../components/common/ui/TextInput';
import InputWithIcon from '../components/common/ui/InputWithIcon';
import { getTokensFromResponse } from '../services/api/axios';

const Login = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const [loginData, setLoginData] = useState<LoginUserRequest>({
    username: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({
    username: '',
    password: ''
  });
  
  const login = useLogin();
  
  const validateForm = () => {
    const newErrors = {
      username: '',
      password: ''
    };
    
    if (!loginData.username) {
      newErrors.username = '아이디를 입력해주세요';
    }
    
    if (!loginData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    }
    
    setErrors(newErrors);
    return !newErrors.username && !newErrors.password;
  };
  
  const handleLogin = async () => {
    if (!validateForm()) return;
    
    try {
      const response = await login.mutateAsync(loginData);
      const { data } = response.data;
      const tokens = getTokensFromResponse(response);

      setUser(
        {
          username: data.username,
          nickname: data.nickname,
          isProfileComplete: data.isProfileComplete
        },
        tokens.accessToken
      )

      if (!data.isProfileComplete) {
        setShowProfileSetup(true);
        return;
      } else {
        navigate('/');
      }
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
      
      <div className='flex flex-col justify-center items-center w-[500px]'>
        <InputWithIcon icon={PersonIcon}>
          <TextInput
            inputSize="medium"
            type="text"
            name="username"
            placeholder="아이디"
            value={loginData.username}
            onChange={handleChange}
            fullWidth
            bordered
            error={errors.username}
            className="pl-12"
          />
        </InputWithIcon>
        
        <div className='mb-8' />
        
        <InputWithIcon icon={LockIcon}>
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
            className="pl-12"
          />
        </InputWithIcon>
        
        <Button
          variant="primary"
          size="medium"
          onClick={handleLogin}
          className="mt-10 w-full"
        >
          로그인
        </Button>
      </div>
      
      <div className='w-1/3 h-px bg-sub mt-16 mb-10' />
      
      <div className='flex'>
        <p className='text-regular text-bold mr-4'>
          StarHub와 함께 빛나는 별이 되고 싶다면
        </p>
        <Link className='text-regular font-scdream6 text-bold' to="/signup">
          회원가입
        </Link>
      </div>

      {showProfileSetup && (
        <ProfileSetupFlow
          onComplete={() => {
            setShowProfileSetup(false);
            navigate('/');
          }}
        />
      )}
    </div>
  );
};

export default Login;