'use client';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import store, { AppDispatch, RootState } from '@/redux/store';
import Modal from '@/components/modal/modal';
import LoginForm from '@/components/login/loginForm';
import {
  logout,
  setIsAuthenticated,
  setUser,
} from '@/redux/reducer/authReducer';
import { fetchUserInfo } from '@/components/auth/fetchUserInfo';
import ProfileForm from '../profile/ProfileForm';

const Nav = () => {
  const [dollars, setDollars] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [isModalActive, setIsModalActive] = useState<boolean>(false);
  const [modalSize, setModalSize] = useState({ width: 400, height: 300 });

  const reduxTether = useSelector((state: RootState) => state.info.tether);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  const statusUrl = process.env.NEXT_PUBLIC_STATUS_URL;
  const logoutUrl = process.env.NEXT_PUBLIC_LOGOUT_URL;

  const checkUserAuth = async () => {
    if (!isAuthenticated) {
      await fetchUserInfo(statusUrl, dispatch);
    }
  };

  useEffect(() => {
    checkUserAuth();
  }, [dispatch]);

  const handleLoginClick = () => {
    setModalSize({ width: 400, height: 300 });
    setIsModalActive(true);
  };

  const handleLogout = async () => {
    const requestInit: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    };

    try {
      const response = await fetch(logoutUrl, requestInit);

      if (response.ok) {
        alert('로그아웃 성공');
        dispatch(logout());
      } else {
        alert('로그아웃 실패');
      }
    } catch (error) {
      console.error('로그아웃 오류', error);
      alert('로그아웃 중 오류 발생');
    }
  };

  const handleProfileClick = () => {
    setModalSize({ width: 400, height: 700 });
    setIsModalActive(true);
  };

  const handleCateogryClick = () => {
    setModalSize({ width: 400, height: 700 });
    setIsModalActive(true);
  };

  const handleNickname = () => {
    const guestName = localStorage.getItem('guestName');

    const nickname = prompt(guestName, guestName);
    if (nickname) {
      localStorage.setItem('guestName', nickname);
    }
    window.location.reload();
  };

  return (
    <NavbarWrapper>
      <TopSection>
        <InfoContainer>
          <InfoItem>
            <Icon src="/dollar.png" alt="Dollar" />
            환율: {dollars}
          </InfoItem>
          <InfoItem>
            <Icon src="/tether.png" alt="Tether" />
            테더: {reduxTether}
          </InfoItem>
          <InfoItem>유저 수: {userCount}</InfoItem>
        </InfoContainer>
        <UserContainer>
          <UserRole role={user?.role}>
            {isAuthenticated ? user?.role : '로그인 되지 않은 사용자'}
          </UserRole>
          <UserName>{`안녕하세요. ${user?.name}님`}</UserName>
          <ActionButtons>
            {isAuthenticated && user?.role === 'OPERATOR' && (
              <ActionButton onClick={handleCateogryClick}>
                카테고리 생성
              </ActionButton>
            )}
            {isAuthenticated && (
              <ActionButton onClick={handleProfileClick}>
                내 프로필
              </ActionButton>
            )}
            {!isAuthenticated && (
              <ActionButton onClick={handleNickname}>
                {'닉네임 변경'}
              </ActionButton>
            )}
            <ActionButton
              onClick={isAuthenticated ? handleLogout : handleLoginClick}
            >
              {isAuthenticated ? '로그아웃' : '로그인'}
            </ActionButton>
          </ActionButtons>
        </UserContainer>
      </TopSection>
      <BottomSection>
        <Logo
          onClick={() =>
            (window.location.href = process.env.NEXT_PUBLIC_MAIN_PAGE)
          }
        >
          KIMP-RUN
        </Logo>
        <NavMenu>
          <NavMenuItem
            onClick={() =>
              (window.location.href = process.env.NEXT_PUBLIC_COMMUNITY_PAGE)
            }
          >
            커뮤니티
          </NavMenuItem>
          <NavMenuItem
            onClick={() =>
              (window.location.href = process.env.NEXT_PUBLIC_STATISTICS_PAGE)
            }
          >
            통계
          </NavMenuItem>
          <NavMenuItem
            onClick={() =>
              (window.location.href = process.env.NEXT_PUBLIC_NEWS_PAGE)
            }
          >
            뉴스
          </NavMenuItem>
        </NavMenu>
      </BottomSection>

      {isModalActive && (
        <Modal
          width={modalSize.width}
          height={modalSize.height}
          element={
            isAuthenticated ? (
              <div>
                <ProfileForm
                  closeModal={() => setIsModalActive(false)}
                  setModalSize={setModalSize}
                />
                <CloseButton onClick={() => setIsModalActive(false)}>
                  닫기
                </CloseButton>
              </div>
            ) : (
              <LoginForm
                closeModal={() => setIsModalActive(false)}
                setModalSize={setModalSize}
              />
            )
          }
          setModal={setIsModalActive}
        />
      )}
    </NavbarWrapper>
  );
};

export default Nav;

// Styled Components
const NavbarWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 130px; // 네비게이션 바의 높이
  z-index: 1000;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  border-bottom: 1px solid #e0e0e0;
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
  font-size: 0.9rem;
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

const UserContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const UserRole = styled.div<{ role?: string }>`
  color: ${(props) =>
    props.role === 'OPERATOR' || props.role === 'MANAGER' ? 'red' : 'black'};
  font-weight: ${(props) =>
    props.role === 'OPERATOR' || props.role === 'MANAGER' ? 'bold' : 'normal'};
  margin-bottom: 5px;
`;

const UserName = styled.div`
  font-size: 0.9rem;
  margin-bottom: 5px;
`;

const ActionButtons = styled.div`
  display: flex;
`;

const ActionButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  padding: 5px 10px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.8rem;

  &:hover {
    background-color: #e0e0e0;
  }
`;
const BottomSection = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  height: 0px;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  margin-right: 30px;
  display: flex;
  align-items: center;
  height: 100%;
`;

const NavMenu = styled.ul`
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
  height: 100%;
  align-items: center;
`;

const NavMenuItem = styled.li`
  margin-right: 20px;
  cursor: pointer;
  font-size: 1rem;
  height: 100%; // 부모 높이에 맞춤
  display: flex;
  align-items: center; // 세로 중앙 정렬

  &:hover {
    color: #007bff;
  }
`;

const CloseButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  padding: 5px 10px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.8rem;

  &:hover {
    background-color: #e0e0e0;
  }
`;
