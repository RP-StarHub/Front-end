import React, { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import StarHubIconNavbar from "../../../assets/icons/StarHubIconNavbar.png";
import { useLogout } from '../../../hooks/api/useUser';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../store';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const logoutMutation = useLogout();
  const queryClient = useQueryClient();

  useEffect(() => {
    // user 상태 변경 감지용 effect
  }, [user]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      logout();
      queryClient.clear();
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패: ', error);
      toast.error('로그아웃에 실패했습니다. 잠시 뒤 다시 시도해주세요.');
    }
  };

  return (
    <div className='bg-sub'>
      <div className="mx-auto px-52 py-2 flex justify-between items-center">
        <div className='flex items-center'>
          <Link to="/">
            <img
              src={StarHubIconNavbar}
              alt={'Logo'}
              className='cursor-pointer h-[70px] w-auto mr-5'
            />
          </Link>
          <Link to="/meeting/create/basic">
            <span className='text-white font-scdream4 cursor-pointer mx-4 text-label'>
              모집하기
            </span>
          </Link>
        </div>
        <div className='flex items-center'>
          {user ? (
            <>
              <span className='text-white font-scdream4 cursor-pointer mx-4 text-label'>
                {user.nickname} 님
              </span>
              <span
                className='text-white font-scdream4 cursor-pointer mx-4 text-label'
                onClick={handleLogout}
              >
                로그아웃
              </span>
            </>
          ) : (
            <Link to="/login">
              <span className='text-white font-scdream4 cursor-pointer mx-4 text-label'>
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