'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import Modal from '@/components/modal/modal';
import LoginForm from '@/components/login/loginForm';
import { logout, setUser } from '@/redux/reducer/authReducer';
import ProfileForm from '../profile/ProfileForm';
import NewNoticeModal from '../notice/client/NewNoticeModal';
import { Notice } from '../notice/type';
import { NoticeModalContainer } from '../notice/client/style';
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
import {
  setDollar,
  setTether,
  setUserCount,
} from '@/redux/reducer/infoReducer';
import { FaUser, FaUserCircle, FaUserCog } from 'react-icons/fa';
import { clientEnv } from '@/utils/env';
import { MarketWebsocketData } from './type';
import { clientRequest } from '@/server/fetch';
import {
  checkUserAuth,
  requestDollar,
  requestTether,
} from './client/dataFetch';
import {
  setIsNewNoticeGenerated,
  setNotice,
} from '@/redux/reducer/noticeReducer';

interface ResponseUrl {
  response: string;
}

const Nav = () => {
  const [isModalActive, setIsModalActive] = useState<boolean>(false);
  const [modalSize, setModalSize] = useState({ width: 400, height: 300 });

  // 여러 모달을 관리하기 위한 상태
  const [noticeModals, setNoticeModals] = useState<
    {
      id: string;
      notice: Notice;
      isVisible: boolean;
    }[]
  >([]);

  const router = useRouter();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const dollar = useSelector((state: RootState) => state.info.dollar);
  const tether = useSelector((state: RootState) => state.info.tether);

  const user = useSelector((state: RootState) => state.auth.user);
  const userCount = useSelector((state: RootState) => state.info.user);

  const isNewNoticeGenerated = useSelector(
    (state: RootState) => state.notice.isNewNoticeGenerated
  );
  const newNoticeData = useSelector((state: RootState) => state.notice.notice);

  const dispatch = useDispatch<AppDispatch>();

  const setReduxDollar = async () => {
    const response = await requestDollar();
    dispatch(setDollar(response));
  };

  const setReduxTether = async () => {
    const response = await requestTether();
    dispatch(setTether(response));
  };

  const setReduxUserAuth = async () => {
    const response = await checkUserAuth(isAuthenticated);
    dispatch(
      setUser({
        name: response?.nickname,
        email: response?.email,
        role: response?.role,
      })
    );
  };

  useEffect(() => {
    setReduxDollar();
    setReduxTether();
    setReduxUserAuth();
  }, [dispatch]);

  useEffect(() => {
    const infoWebsocket = new WebSocket(clientEnv.INFO_WEBSOCKET_URL);

    infoWebsocket.onopen = (event) => {
      console.log('🔌 웹소켓 연결 성공:', event);
    };

    infoWebsocket.onmessage = (event) => {
      try {
        const streamData = JSON.parse(event.data) as MarketWebsocketData;

        if (streamData.type === 'market') {
          const { userData, marketData } = streamData.data;
          dispatch(setUserCount(userData.userCount));
          dispatch(setDollar(marketData.dollar));
          dispatch(setTether(marketData.tether));
        } else if (streamData.type === 'notice') {
          console.log('📢 웹소켓 notice 데이터:', streamData.data);

          // 데이터가 배열이 아닌 경우 배열로 변환
          const noticeArray = Array.isArray(streamData.data)
            ? streamData.data
            : [streamData.data];

          dispatch(setNotice(noticeArray));
          dispatch(setIsNewNoticeGenerated(true));
        } else {
          console.log('❓ 알 수 없는 메시지 타입:', streamData);
        }
      } catch (error) {
        console.error('❌ JSON 파싱 오류:', error);
        console.error('원본 데이터:', event.data);
      }
    };

    infoWebsocket.onerror = (error) => {
      console.error('❌ 웹소켓 오류:', error);
      console.error('웹소켓 상태:', infoWebsocket.readyState);
    };

    infoWebsocket.onclose = (event) => {
      console.log('🔌 웹소켓 연결 종료:', event.code, event.reason);
    };

    return () => {
      infoWebsocket.close();
    };
  }, [dispatch]);

  useEffect(() => {
    if (isNewNoticeGenerated && newNoticeData.length > 0) {
      const newModals = newNoticeData.map((notice, index) => ({
        id: `${notice.id}-${Date.now()}-${index}`,
        notice: notice,
        isVisible: false,
      }));

      setNoticeModals((prevModals) => [...prevModals, ...newModals]);

      setTimeout(() => {
        setNoticeModals((prevModals) =>
          prevModals.map((modal) =>
            newModals.some((newModal) => newModal.id === modal.id)
              ? { ...modal, isVisible: true }
              : modal
          )
        );
      }, 50);

      setTimeout(() => {
        dispatch(setIsNewNoticeGenerated(false));
      }, 2000);
    }
  }, [isNewNoticeGenerated, newNoticeData, dispatch]);

  const handleNoticeModalClose = (id: string) => {
    setNoticeModals((prevModals) =>
      prevModals.filter((modal) => modal.id !== id)
    );
  };

  const handleLoginClick = () => {
    setModalSize({ width: 400, height: 300 });
    setIsModalActive(true);
  };

  const handleLogout = async () => {
    try {
      const response = await clientRequest.post(
        clientEnv.LOGOUT_URL,
        {},
        {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.success) {
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
      const response = await clientRequest.get<ResponseUrl>(
        clientEnv.ADMIN_URL,
        {
          credentials: 'include',
        }
      );

      if (response.success && response.status === 200) {
        if (response.data.response) {
          window.location.href = response.data.response;
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
              <Logo onClick={() => router.push(clientEnv.MAIN_PAGE)}>
                <LogoIcon src="/logo.png" alt="Dollar" />
              </Logo>
              <Icon src="/dollar.png" alt="Dollar" />
              환율: {dollar}원
            </InfoItem>
            <InfoItem>
              <Icon src="/tether.png" alt="Tether" />
              테더: {tether}원
            </InfoItem>
            <InfoItem>유저 수: {userCount}</InfoItem>
          </TopInfoSection>
          <BottomSection>
            <NavMenu>
              <NavMenuItem onClick={() => router.push(clientEnv.MAIN_PAGE)}>
                메인페이지
              </NavMenuItem>
              <NavMenuItem>
                <NavMenuLink
                  onClick={() => router.push(clientEnv.COMMUNITY_PAGE)}
                >
                  커뮤니티
                </NavMenuLink>
                <SubMenu>
                  <SubMenuItem
                    onClick={() =>
                      router.push(`${clientEnv.COMMUNITY_PAGE}/expert`)
                    }
                  >
                    전문가 게시판
                  </SubMenuItem>
                  <SubMenuItem
                    onClick={() =>
                      router.push(`${clientEnv.COMMUNITY_PAGE}/coin`)
                    }
                  >
                    코인 게시판
                  </SubMenuItem>
                </SubMenu>
              </NavMenuItem>
              <NavMenuItem
                onClick={() => router.push(clientEnv.STATISTICS_PAGE)}
              >
                통계
              </NavMenuItem>
              <NavMenuItem onClick={() => router.push(clientEnv.NEWS_PAGE)}>
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

      {noticeModals.length > 0 && (
        <NoticeModalContainer>
          {noticeModals.map((modal, index) => (
            <NewNoticeModal
              key={modal.id}
              notice={modal.notice}
              isVisible={modal.isVisible}
              onClose={() => handleNoticeModalClose(modal.id)}
              modalIndex={index}
              autoCloseTime={12} // 12초로 설정
            />
          ))}
        </NoticeModalContainer>
      )}
    </NavbarWrapper>
  );
};

export default Nav;
