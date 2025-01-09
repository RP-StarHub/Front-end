import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import { Link } from "react-router-dom";
import StarHubIconNavbar from "../assets/icons/StarHubIconNavbar.png";
import axios from 'axios';
import { User } from '../types';

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
  // console.log(userInfo.name)

  const handleLogout = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/user/logout?loginId=${userInfo?.userId}`);
      // 로그인 정보를 localStorage에서 삭제
      localStorage.removeItem('userInfo');
      setUserInfo(null);
    } catch (error) {
      console.error('Logout failed:', error);
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