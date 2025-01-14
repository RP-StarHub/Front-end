import React, { useState } from 'react';
import styled from "styled-components";
import { Link } from "react-router-dom";
import StarHubIconNavbar from "../assets/icons/StarHubIconNavbar.png";
import { User } from '../types';
import { useLogout } from '../hooks/api/useUser';
import { useQueryClient } from '@tanstack/react-query';

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
  background-color: #7C8BBE;
  font-family: 'SCDream4';
`;

const TextLink = styled(Link)`
  text-decoration: none;
`

const NavItems = styled.div`
  display: flex;
  align-items: center;
`;

const NavItem = styled.div`
  margin: 0 10px;
  cursor: pointer;
  color: #fff;
`;

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
    <NavContainer>
      <NavItems>
        <TextLink to="/">
          <img src={StarHubIconNavbar} alt={'Logo'} style={{ width: 'auto', height: '50px', marginRight: '10px', marginTop: '5px'}} />
        </TextLink>
        <TextLink to="/studyrecruit">
          <NavItem>모집하기</NavItem>
        </TextLink>
      </NavItems>
      <NavItems>
        {userInfo!==null ? (
          <>
            <NavItem>{userInfo.name} 님</NavItem>
            <NavItem onClick={handleLogout}>로그아웃</NavItem>
          </>
        ) : (
          <TextLink to="/login">
            <NavItem>로그인</NavItem>
          </TextLink>
        )}
      </NavItems>
    </NavContainer>
  );
};

export default Navbar;