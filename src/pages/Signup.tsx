import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '../store';
import { useRegister } from '../hooks/api/useUser';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Button from '../components/common/ui/Button';
import TextInput from '../components/common/ui/TextInput';

const Signup = () => {
  const navigate = useNavigate();
  const register = useRegister();
  const setUser = useAuthStore((state) => state.setUser);
  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    loginId: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'age' ? parseInt(value) : value,
    });
    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      loginId: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.loginId) {
      newErrors.loginId = '아이디는 필수 입력 사항입니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호는 필수 입력 사항입니다.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호를 재입력해 입력 사항을 확인해주세요.'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다. 내용을 확인해주세요.'
    }

    setErrors(newErrors);
    return !newErrors.loginId && !newErrors.password && !newErrors.confirmPassword
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!validateForm()) return;

    const form = new FormData();
    form.append('info', JSON.stringify(formData));

    try {
      const response = await register.mutateAsync(form);
      const userData = response.data.data;
      setUser(userData);
      navigate('/');
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
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
            <div className="flex gap-2">
              <div className='relative w-full'>
                <PersonIcon className='absolute left-4 top-1/2 transform -translate-y-1/2 text-sub' />
                <TextInput
                  type="text"
                  name="loginId"
                  placeholder="아이디를 입력해주세요"
                  value={formData.loginId}
                  fullWidth
                  onChange={handleChange}
                  error={errors.loginId}
                  className="flex-1 pl-12"
                />
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
            <div className='relative w-full'>
              <LockIcon className='absolute left-4 top-1/2 transform -translate-y-1/2 text-sub' />
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
            </div>
          </div>
          <div className='mb-8'>
            <p className='text-label font-scdream6 text-bold mb-4'>
              비밀번호 확인
            </p>
            <div className='relative w-full'>
              <LockIcon className='absolute left-4 top-1/2 transform -translate-y-1/2 text-sub' />
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
            </div>
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
  );
};

export default Signup;
