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
  LogoIcon,
  NavbarWrapper,
  NavMenu,
  NavMenuItem,
  NavMenuLink,
  SubMenu,
  SubMenuItem,
  TopInfoSection,
  TopSection,
  TradingViewOverviewContainer,
  UserContainer,
  UserName,
  UserRole,
  UserWrapperContainer,
} from './client/styled';
import { useRouter } from 'next/navigation';
import TradingViewOverview from '../tradingview/TradingViewOverview';
import { setDollar, setUserCount } from '@/redux/reducer/infoReducer';
import { FaUser, FaUserCircle, FaUserCog } from 'react-icons/fa';

interface ResponseUrl {
  response: string;
}

const Nav = () => {
  const [dollars, setDollars] = useState('');
  const [userSize, setUserSize] = useState(0);
  const [isModalActive, setIsModalActive] = useState<boolean>(false);
  const [modalSize, setModalSize] = useState({ width: 400, height: 300 });
  const router = useRouter();

  const reduxTether = useSelector((state: RootState) => state.info.tether);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const dollar = useSelector((state: RootState) => state.info.dollar);

  const user = useSelector((state: RootState) => state.auth.user);
  const userCount = useSelector((state: RootState) => state.info.user);
  const dispatch = useDispatch<AppDispatch>();

  const statusUrl = process.env.NEXT_PUBLIC_STATUS_URL;
  const logoutUrl = process.env.NEXT_PUBLIC_LOGOUT_URL;
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL;
  const dollarAPIUrl = process.env.NEXT_PUBLIC_DOLLAR_API_URL;

  const checkUserAuth = async () => {
    if (isAuthenticated) {
      await fetchUserInfo(statusUrl, dispatch);
    }
  };

  const requestDollar = async () => {
    const requestInit: RequestInit = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    const response = await fetch(dollarAPIUrl, requestInit);
    const parsedData = await response.json();

    setDollars(parsedData.dollar);
    dispatch(setDollar(parsedData.dollar));
  };

  useEffect(() => {
    requestDollar();
    checkUserAuth();
  }, [dispatch]);

  useEffect(() => {
    const infoWebsocket = new WebSocket(
      process.env.NEXT_PUBLIC_INFO_WEBSOCKET_URL
    );

    infoWebsocket.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setDollars(parsedData.dollar);
      setUserSize(parsedData.userCount);
      dispatch(setUserCount(parsedData.userCount));
      dispatch(setDollar(parsedData.dollar));
    };

    infoWebsocket.onerror = (error) => {
      console.error('Info Websocket Error:', error);
      infoWebsocket.close();
    };

    return () => {
      infoWebsocket.close();
    };
  }, []);

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
          <TopInfoSection>
            <InfoItem>
              <Logo
                onClick={() => router.push(process.env.NEXT_PUBLIC_MAIN_PAGE)}
              >
                <LogoIcon src="/logo.png" alt="Dollar" />
              </Logo>
              <Icon src="/dollar.png" alt="Dollar" />
              환율: {dollar}원
            </InfoItem>
            <InfoItem>
              <Icon src="/tether.png" alt="Tether" />
              테더: {reduxTether}
            </InfoItem>
            <InfoItem>유저 수: {userCount}</InfoItem>
          </TopInfoSection>
          <BottomSection>
            <NavMenu>
              <NavMenuItem
                onClick={() => router.push(process.env.NEXT_PUBLIC_MAIN_PAGE)}
              >
                메인페이지
              </NavMenuItem>
              <NavMenuItem>
                <NavMenuLink
                  onClick={() =>
                    router.push(process.env.NEXT_PUBLIC_COMMUNITY_PAGE)
                  }
                >
                  커뮤니티
                </NavMenuLink>
                <SubMenu>
                  <SubMenuItem
                    onClick={() =>
                      router.push(
                        `${process.env.NEXT_PUBLIC_COMMUNITY_PAGE}/expert`
                      )
                    }
                  >
                    전문가 게시판
                  </SubMenuItem>
                  <SubMenuItem
                    onClick={() =>
                      router.push(
                        `${process.env.NEXT_PUBLIC_COMMUNITY_PAGE}/coin`
                      )
                    }
                  >
                    코인 게시판
                  </SubMenuItem>
                </SubMenu>
              </NavMenuItem>
              <NavMenuItem
                onClick={() =>
                  router.push(process.env.NEXT_PUBLIC_STATISTICS_PAGE)
                }
              >
                통계
              </NavMenuItem>
              <NavMenuItem
                onClick={() => router.push(process.env.NEXT_PUBLIC_NEWS_PAGE)}
              >
                뉴스
              </NavMenuItem>
            </NavMenu>
          </BottomSection>
        </InfoContainer>
        <TradingViewOverviewContainer>
          <TradingViewOverview />
        </TradingViewOverviewContainer>
        <UserWrapperContainer>
          <UserContainer>
            <UserRole role={user?.role}>
              {isAuthenticated ? (
                user?.role === 'OPERATOR' ? (
                  <FaUserCog size={24} title="관리자" />
                ) : (
                  <FaUser size={24} title="일반 사용자" />
                )
              ) : (
                <FaUserCircle size={24} title="비로그인 사용자" />
              )}
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
