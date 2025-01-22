import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '../store';
import { useRegister } from '../hooks/api/useUser';
import ProfileSetupFlow from '../components/profile/ProfileSetupFlow';
import toast, { Toaster } from 'react-hot-toast';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Button from '../components/common/ui/Button';
import TextInput from '../components/common/ui/TextInput';
import InputWithIcon from '../components/common/ui/InputWithIcon';
import { RegisterUserRequest } from '../types/api/user';

const Signup = () => {
  const navigate = useNavigate();
  const register = useRegister();
  const setUser = useAuthStore((state) => state.setUser);

  const [formData, setFormData] = useState<
    RegisterUserRequest & { confirmPassword: string }
  >({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'age' ? parseInt(value) : value,
    });
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      username: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.username) {
      newErrors.username = '아이디는 필수 입력 사항입니다.';
    } else if (!canUsername(formData.username)) {
      newErrors.username = '아이디는 6-12자의 영문, 숫자, 기호( - _ )만 사용이 가능합니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호는 필수 입력 사항입니다.';
    } else if (!canPassword(formData.password)) {
      newErrors.password = '비밀번호는 반드시 8-20자 이내 숫자, 특수문자, 영문자 중 2가지 이상을 조합해야합니다.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호를 재입력해 입력 사항을 확인해주세요.'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다. 내용을 확인해주세요.'
    }

    setErrors(newErrors);
    return !newErrors.username && !newErrors.password && !newErrors.confirmPassword
  }

  // 아이디 검증: 6-12자의 영문으로 시작하고, 영문/숫자/-/_ 조합
  function canUsername(username: string) {
    const regExp = /^[a-zA-Z][a-zA-Z0-9-_]{5,11}$/;
    return regExp.test(username);
  }

  // 비밀번호 검증: 8-20자, 영문/숫자/특수문자 중 2가지 이상 조합
  function canPassword(password: string) {
    // 길이 체크
    if (password.length < 8 || password.length > 20) return false;

    let containsLetter = /[a-zA-Z]/.test(password);
    let containsNumber = /[0-9]/.test(password);
    let containsSpecial = /[!@#$%^&*]/.test(password);

    // 2가지 이상 조합 체크
    let combinationCount = 0;
    if (containsLetter) combinationCount++;
    if (containsNumber) combinationCount++;
    if (containsSpecial) combinationCount++;

    return combinationCount >= 2;
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await register.mutateAsync({
        username: formData.username,
        password: formData.password,
      });

      const { data } = response.data;
      setUser(
        {
          username: data.username,
          isProfileComplete: false,
          nickname: null,
        },
        {
          accessToken: '',
          refreshToken: '',
        }
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
    } catch (error) {
        toast.error('회원가입 중 오류가 발생하였습니다. 잠시 뒤 다시 시도해주세요.', {
          duration: 3000,
          position: 'top-center',
          style: {
            width: 1000,
            fontSize: '16px'
          }
        });
        console.error('회원가입 에러:', error);
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
