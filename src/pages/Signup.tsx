import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '../store';
import { useCheckUsername, useLogin, useRegister } from '../hooks/api/useUser';
import ProfileSetupFlow from '../components/profile/ProfileSetupFlow';
import toast, { Toaster } from 'react-hot-toast';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Button from '../components/common/ui/Button';
import TextInput from '../components/common/ui/TextInput';
import InputWithIcon from '../components/common/ui/InputWithIcon';
import { getTokensFromResponse } from '../services/api/axios';
import { useSignupForm } from '../hooks/common/useSignupForm';

const Signup = () => {
  const navigate = useNavigate();
  const register = useRegister();
  const login = useLogin();
  const checkUsername = useCheckUsername();
  const { setUser } = useAuthStore();
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const {
    formData,
    errors,
    setErrors,
    setIsUsernameChecked,
    handleChange,
    validateForm,
  } = useSignupForm();

  const handleCheckUsername = async () => {
    if (!formData.username) {
      setErrors(prev => ({
        ...prev,
        username: '아이디는 필수 입력 사항입니다.'
      }));
      return;
    }

    try {
      const response = await checkUsername.mutateAsync({
        username: formData.username
      });

      const { available } = response.data.data;

      if (available) {
        toast.success('사용 가능한 아이디입니다.');
        setIsUsernameChecked(true);
      } else {
        toast.error('이미 사용 중인 아이디입니다.');
        setIsUsernameChecked(false);
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error('올바른 아이디 형식이 아닙니다.');
      } else {
        toast.error('중복 확인 중 오류가 발생했습니다.');
      }
      setIsUsernameChecked(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // 먼저 회원가입
      const response = await register.mutateAsync({
        username: formData.username,
        password: formData.password,
      });

      // 회원가입 성공 시, 로그인으로 토큰 받아옴
      // 이후 프로필 설정 모달 띄움
      if (response.data.status === 201) {
        const loginResponse = await login.mutateAsync({
          username: formData.username,
          password: formData.password
        });

        const { data: loginData } = loginResponse.data;
        const accessToken = getTokensFromResponse(loginResponse);

        // 로그인 정보 저장 
        setUser(
          {
            username: loginData.username,
            nickname: null,
            isProfileComplete: false
          },
          accessToken
        );

        setShowProfileSetup(true);
        toast.success('회원가입이 완료되었습니다!', {
          duration: 3000,
          position: 'top-center',
          style: {
            width: 1000,
            fontSize: '16px'
          },
          icon: '🤚',
        });
      }
    } catch (error: any) {
      console.error('회원가입 에러:', error);
      if (error.response?.status === 400) {
        toast.error('잘못된 요청입니다. 입력한 정보를 다시 확인해주세요.', {
          duration: 3000,
          position: 'top-center',
          style: {
            width: 1000,
            fontSize: '16px'
          }
        });
      } else {
        toast.error('회원가입 중 오류가 발생하였습니다. 잠시 뒤 다시 시도해주세요.', {
          duration: 3000,
          position: 'top-center',
          style: {
            width: 1000,
            fontSize: '16px'
          }
        });
      }
    }
  };

  return (
    <>
      <div className='flex justify-center items-center flex-col w-full bg-background p-16 '>
        <p className='mb-12 text-6xl font-gmarket-bold text-sub'>
          Sign Up
        </p>
        <div className='flex'>
          <p className='text-regular text-bold mr-4'>
            이미 StarHub 회원이신가요?
          </p>
          <Link className='text-regular font-scdream6 text-bold'
            to="/login">
            로그인
          </Link>
        </div>

        <div className='flex flex-col justify-center items-center w-[800px] py-12'>
          <form onSubmit={handleSubmit} className='w-full'>
            <div className='mb-8'>
              <p className='text-label font-scdream6 text-bold mb-4'>
                아이디
              </p>
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <InputWithIcon icon={PersonIcon}>
                    <TextInput
                      type="text"
                      name="username"
                      placeholder="아이디를 입력해주세요"
                      value={formData.username}
                      fullWidth
                      onChange={handleChange}
                      error={errors.username}
                      className="pl-12"
                    />
                  </InputWithIcon>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="shrink-0"
                  onClick={handleCheckUsername}
                >
                  중복확인
                </Button>
              </div>
            </div>

            <div className='mb-8'>
              <p className='text-label font-scdream6 text-bold mb-4'>
                비밀번호
              </p>
              <InputWithIcon icon={LockIcon}>
                <TextInput
                  type="password"
                  name="password"
                  placeholder='비밀번호를 입력해주세요.'
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  bordered
                  error={errors.password}
                  className='pl-12'
                />
              </InputWithIcon>
            </div>

            <div className='mb-8'>
              <p className='text-label font-scdream6 text-bold mb-4'>
                비밀번호 확인
              </p>
              <InputWithIcon icon={LockIcon}>
                <TextInput
                  type="password"
                  name="confirmPassword"
                  placeholder='비밀번호 확인을 입력해주세요.'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  fullWidth
                  bordered
                  error={errors.confirmPassword}
                  className='pl-12'
                />
              </InputWithIcon>
            </div>

            <Button
              type="submit"
              variant='secondary'
              fullWidth
              className='mt-12'
            >
              Sign Up
            </Button>
          </form>
        </div>
      </div>

      {showProfileSetup && (
        <ProfileSetupFlow
          onComplete={() => {
            setShowProfileSetup(false);
            navigate('/');
          }}
        />
      )}

      <Toaster />
    </>
  );
};

export default Signup;
