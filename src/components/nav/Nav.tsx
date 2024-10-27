'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import Modal from '@/components/modal/modal';
import LoginForm from '@/components/login/loginForm';
import { logout } from '@/redux/reducer/authReducer';
import { fetchUserInfo } from '@/components/auth/fetchUserInfo';
import ProfileForm from '../profile/ProfileForm';
import {
  ActionButton,
  ActionButtons,
  BottomSection,
  CloseButton,
  Icon,
  InfoContainer,
  InfoItem,
  Logo,
  NavbarWrapper,
  NavMenu,
  NavMenuItem,
  NavMenuLink,
  SubMenu,
  SubMenuItem,
  TopSection,
  UserContainer,
  UserName,
  UserRole,
  UserWrapperContainer,
} from './client/styled';
import { useRouter } from 'next/navigation';

interface ResponseUrl {
  response: string;
}

const Nav = () => {
  const [dollars, setDollars] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [isModalActive, setIsModalActive] = useState<boolean>(false);
  const [modalSize, setModalSize] = useState({ width: 400, height: 300 });
  const router = useRouter();

  const reduxTether = useSelector((state: RootState) => state.info.tether);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  const statusUrl = process.env.NEXT_PUBLIC_STATUS_URL;
  const logoutUrl = process.env.NEXT_PUBLIC_LOGOUT_URL;
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL;

  const checkUserAuth = async () => {
    if (isAuthenticated) {
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

  const handleAdminClick = async () => {
    try {
      const requestInit: RequestInit = {
        method: 'GET',
        credentials: 'include',
      };
      const response = await fetch(adminUrl, requestInit);
      if (response.ok) {
        const redirectUrl: ResponseUrl = await response.json();
        if (redirectUrl) {
          window.location.href = redirectUrl.response;
        } else {
          console.error('리다이렉션 URL을 찾을 수 없음.');
        }
      }
    } catch (error) {
      console.error('카테고리 페이지 접근 오류', error);
      alert('카테고리 페이지 접근 중 오류 발생');
    }
  };

  const handleNickname = () => {
    const guestName = localStorage.getItem('guestName');

    const nickname = prompt(guestName, guestName);
    if (nickname) {
      localStorage.setItem('guestName', nickname);
    }
    router.refresh();
  };

  return (
    <NavbarWrapper>
      <TopSection>
        <InfoContainer>
          <InfoItem>
            <Logo
              onClick={() =>
                (window.location.href = process.env.NEXT_PUBLIC_MAIN_PAGE)
              }
            >
              KIMP-RUN
            </Logo>
            <Icon src="/dollar.png" alt="Dollar" />
            환율: {dollars}
          </InfoItem>
          <InfoItem>
            <Icon src="/tether.png" alt="Tether" />
            테더: {reduxTether}
          </InfoItem>
          <InfoItem>유저 수: {userCount}</InfoItem>
        </InfoContainer>
        <UserWrapperContainer>
          <UserContainer>
            <UserRole role={user?.role}>
              {isAuthenticated ? user?.role : '로그인 되지 않은 사용자'}
            </UserRole>
            <UserName>{`안녕하세요. ${user?.name}님`}</UserName>
          </UserContainer>
          <ActionButtons>
            {isAuthenticated && user?.role === 'OPERATOR' && (
              <ActionButton onClick={handleAdminClick}>어드민</ActionButton>
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
        </UserWrapperContainer>
      </TopSection>
      <BottomSection>
        <NavMenu>
          <NavMenuItem>
            <NavMenuLink
              onClick={() =>
                (window.location.href = process.env.NEXT_PUBLIC_COMMUNITY_PAGE)
              }
            >
              커뮤니티
            </NavMenuLink>
            <SubMenu>
              <SubMenuItem
                onClick={() =>
                  (window.location.href = `${process.env.NEXT_PUBLIC_COMMUNITY_PAGE}/expert`)
                }
              >
                전문가 게시판
              </SubMenuItem>
              <SubMenuItem
                onClick={() =>
                  (window.location.href = `${process.env.NEXT_PUBLIC_COMMUNITY_PAGE}/coin`)
                }
              >
                코인 게시판
              </SubMenuItem>
            </SubMenu>
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
