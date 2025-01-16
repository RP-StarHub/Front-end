import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import StarIcon from "../assets/icons/StarIcon.png";
import { RegisterUserRequest } from '../types/api/user';
import { useRegister } from '../hooks/api/useUser';
import Button from '../components/common/ui/Button';
import TextInput from '../components/common/ui/TextInput';

const Signup = () => {
  const navigate = useNavigate();
  const register = useRegister();
  const [formData, setFormData] = useState<RegisterUserRequest>({
    loginId: "",
    password: "",
    name: "",
    age: 0,
    email: "",
    phoneNum: "",
    introduction: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'age' ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const form = new FormData();
    form.append('info', JSON.stringify(formData));

    try {
      const response = await register.mutateAsync(form);
      // 서버에서 받은 로그인 정보를 localStorage에 저장
      localStorage.setItem('userInfo', JSON.stringify(response.data.data));
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
      <div className='flex flex-col justify-center items-center bg-white rounded-2xl shadow-2xl shadow-gray-300 px-20 py-12 mt-16'>
        <form onSubmit={handleSubmit}>
          <div className='mb-8'>
            <p className='text-label font-scdream6 text-bold mb-4'>
              아이디
            </p>
            <TextInput
              type="text"
              name="loginId"
              placeholder='아이디를 입력해주세요.'
              value={formData.loginId}
              onChange={handleChange}
              fullWidth
              bordered
            />
          </div>
          <div className='mb-8'>
            <p className='text-label font-scdream6 text-bold mb-4'>
              비밀번호
            </p>
            <TextInput
              type="password"
              name="password"
              placeholder='비밀번호를 입력해주세요.'
              value={formData.password}
              onChange={handleChange}
              fullWidth
              bordered
            />
          </div>
          <div className='w-[30vw] h-px bg-sub mt-5 mb-5' />
          <div className='flex flex-row mt-2 mb-8 items-center'>
            <img
              src={StarIcon}
              alt={'Star Icon'}
              className='w-6 mr-2'
            />
            <p className='text-regular text-main font-scdream4'>
              스터디 연락을 위한 정보입니다.
            </p>
          </div>
          <div className='mb-8'>
            <p className='text-label font-scdream6 text-bold mb-4'>
              이름
            </p>
            <TextInput
              type="text"
              name="name"
              placeholder='이름을 입력해주세요.'
              value={formData.name}
              onChange={handleChange}
              fullWidth
              bordered
            />
          </div>
          <div className='mb-8'>
            <p className='text-label font-scdream6 text-bold mb-4'>
              나이
            </p>
            <TextInput
              type="text"
              name="age"
              placeholder='여러분들의 나이를 숫자로 입력해주세요.'
              value={formData.age}
              onChange={handleChange}
              fullWidth
              bordered
            />
          </div>
          <div className='mb-8'>
            <p className='text-label font-scdream6 text-bold mb-4'>
              이메일
            </p>
            <TextInput
              type="text"
              name="email"
              placeholder="이메일을 입력해주세요."
              value={formData.email}
              onChange={handleChange}
              fullWidth
              bordered
            />
          </div>
          <div className='mb-8'>
            <p className='text-label font-scdream6 text-bold mb-4'>
              전화번호
            </p>
            <TextInput
              type="text"
              name="phoneNum"
              placeholder="전화번호를 입력해주세요."
              value={formData.phoneNum}
              onChange={handleChange}
              fullWidth
              bordered
            />
          </div>
          <div className='mb-8'>
            <p className='text-label font-scdream6 text-bold mb-4'>
              한 줄 소개
            </p>
            <TextInput
              name="introduction"
              placeholder="여러분들을 간단히 소개해주세요."
              value={formData.introduction}
              onChange={handleChange}
              fullWidth
              bordered
            />
          </div>
          <Button
            type="submit"
            fullWidth
          >
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
