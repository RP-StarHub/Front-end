import React, { useState } from 'react';
import { Link } from "react-router-dom";
import StarHubIconNavbar from "../../../assets/icons/StarHubIconNavbar.png";
import { User } from '../../../types';
import { useLogout } from '../../../hooks/api/useUser';
import { useQueryClient } from '@tanstack/react-query';

const Navbar = () => {
  const [userInfo, setUserInfo] = useState<User | null>(
    JSON.parse(localStorage.getItem('userInfo') || 'null')
  );
  const logout = useLogout();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      if (userInfo?.userId) {
        await logout.mutateAsync(userInfo.userId);
        localStorage.removeItem('userInfo');
        setUserInfo(null);

        queryClient.clear();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        alert('로그아웃에 실패했습니다.');
      }
    }
  };

  return (
    <div className='bg-sub'>
      {/**
       * 나브바 크기 조절 속성 임시 비활성화 
       * TODO: 메인페이지의 경우 크게, 다른 페이지의 경우 작게 나타나도록 수정
       * className="max-w-screen-2xl
       */}
      <div className="mx-auto px-52 py-2 flex justify-between items-center">
        <div className='flex items-center'>
          <Link to="/">
            <img 
              src={StarHubIconNavbar} 
              alt={'Logo'} 
              // style={{ width: 'auto', height: '50px', marginRight: '10px', marginTop: '5px' }} 
              className='cursor-pointer h-[70px] w-auto mr-5'
            />
          </Link>
          <Link to="/study/recruit">
            <span className='text-white font-scdream6 cursor-pointer mx-4 text-label'>
              모집하기
            </span>
          </Link>
        </div>
        <div className='flex items-center'>
          {userInfo !== null ? (
            <>
              <span className='text-white font-scdream6 cursor-pointer mx-4 text-label'>
                {userInfo.name} 님
              </span>
              <span 
                className='text-white font-scdream6 cursor-pointer mx-4 text-label'
                onClick={handleLogout}
              >
                로그아웃
              </span>
            </>
          ) : (
            <Link to="/login">
              <span
                className='text-white font-scdream6 cursor-pointer mx-4 text-label'
              >
                로그인
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;