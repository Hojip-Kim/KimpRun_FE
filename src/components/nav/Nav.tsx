'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { IMessage } from '@stomp/stompjs';
import { useStompClientSingleton } from '@/hooks/useStompClientSingleton';
import {
  logout,
  setGuestUser,
  setUser,
  updateGuestNickname as updateGuestNicknameAction,
  setUuid,
} from '@/redux/reducer/authReducer';
import dynamic from 'next/dynamic';

const Modal = dynamic(() => import('@/components/modal/modal'), { ssr: false });
const LoginForm = dynamic(() => import('@/components/login/loginForm'), {
  ssr: false,
});
const ProfileForm = dynamic(() => import('../profile/ProfileForm'), {
  ssr: false,
});
const NicknameModal = dynamic(() => import('../profile/NicknameModal'), {
  ssr: false,
});
const NewNoticeModal = dynamic(
  () => import('../notice/client/NewNoticeModal'),
  { ssr: false }
);
import ThemeToggle from '../theme/ThemeToggle';
import { Notice } from '../notice/type';
import { NoticeModalContainer } from '../notice/client/style';
import CoinSearchNav from '../common/CoinSearchNav';
import {
  ActionButton,
  ActionButtons,
  BottomSection,
  CloseButton,
  DesktopThemeToggle,
  Icon,
  InfoBar,
  InfoContainer,
  InfoItem,
  LeftSection,
  Logo,
  LogoIcon,
  NavbarWrapper,
  NavMenu,
  NavMenuItem,
  NavMenuLink,
  RightSection,
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
import { FaUser, FaUserCircle, FaUserCog } from '@/components/icons';
import { clientEnv } from '@/utils/env';

import { clientRequest } from '@/server/fetch';
import { updateGuestNickname } from '@/api/guest';
import { useGlobalAlert } from '@/providers/AlertProvider';
import {
  MarketInfoWebsocketDto,
  NoticeDto,
  InfoResponseDto,
} from '@/types/websocket';
import {
  checkUserAuth,
  requestDollar,
  requestTether,
} from './client/dataFetch';
import {
  setIsNewNoticeGenerated,
  setNotice,
} from '@/redux/reducer/noticeReducer';
import { Member, UserInfo } from '../market-selector/type';

interface ResponseUrl {
  response: string;
}

const Nav = () => {
  const [isModalActive, setIsModalActive] = useState<boolean>(false);
  const [modalSize, setModalSize] = useState({ width: 400, height: 300 });
  const [isNicknameModalOpen, setIsNicknameModalOpen] =
    useState<boolean>(false);

  // Nav에서도 STOMP를 사용하여 시장 정보와 공지사항을 실시간으로 받음

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
  const uuid = useSelector((state: RootState) => state.auth.uuid);
  const { showSuccess, showError } = useGlobalAlert();

  // 사용자 정보 변경 감지
  useEffect(() => {}, [user]);

  const isNewNoticeGenerated = useSelector(
    (state: RootState) => state.notice.isNewNoticeGenerated
  );
  const newNoticeData = useSelector((state: RootState) => state.notice.notice);

  const dispatch = useDispatch<AppDispatch>();

  // 싱글톤 STOMP 클라이언트 사용
  const { isConnected, isConnecting, connectionError, subscribe, unsubscribe } =
    useStompClientSingleton({
      autoConnect: true,
    });

  const setReduxDollar = async () => {
    const response = await requestDollar();
    dispatch(setDollar(response));
  };

  const setReduxTether = async () => {
    const response = await requestTether();
    dispatch(setTether(response));
  };

  const setReduxUserAuth = async () => {
    const response: UserInfo | null = await checkUserAuth();
    if (response !== null && response.member !== undefined) {
      const member: Member = response.member;
      dispatch(
        setUser({
          name: member.name,
          email: member.email,
          role: member.role,
          memberId: member.memberId,
        })
      );
      dispatch(setUuid(response.uuid));
    } else if (response !== null && response.member === undefined) {
      dispatch(setGuestUser());
      dispatch(setUuid(response.uuid));
    } else {
      dispatch(logout());
    }
  };

  useEffect(() => {
    setReduxDollar();
    setReduxTether();
    setReduxUserAuth();
  }, [dispatch]);

  // 웹소켓 시장 정보 메시지 처리 (/topic/marketInfo)
  const handleMarketInfoMessage = React.useCallback(
    (message: IMessage) => {
      try {
        const wsData: MarketInfoWebsocketDto<InfoResponseDto> = JSON.parse(
          message.body
        );

        if (wsData.type === 'market' && wsData.data) {
          const { userData, marketData } = wsData.data;

          if (userData?.userCount !== undefined) {
            dispatch(setUserCount(userData.userCount));
          }

          if (marketData) {
            if (marketData.dollar !== undefined) {
              dispatch(setDollar(marketData.dollar));
            }
            if (marketData.tether !== undefined) {
              dispatch(setTether(marketData.tether));
            }
          }
        }
      } catch (error) {
        console.error('❌ 시장 정보 웹소켓 메시지 파싱 오류:', error);
      }
    },
    [dispatch]
  );

  // 웹소켓 공지사항 메시지 처리 (/topic/marketInfo/notice)
  const handleNoticeMessage = React.useCallback(
    (message: IMessage) => {
      try {
        const wsData: MarketInfoWebsocketDto<NoticeDto> = JSON.parse(
          message.body
        );

        if (wsData.type === 'notice' && wsData.data) {
          const noticeData = wsData.data;

          // 기존 공지사항 Redux 액션 사용
          dispatch(setNotice([noticeData]));
          dispatch(setIsNewNoticeGenerated(true));
        }
      } catch (error) {
        console.error('❌ 공지사항 웹소켓 메시지 파싱 오류:', error);
      }
    },
    [dispatch]
  );

  // STOMP 구독 설정
  useEffect(() => {
    if (isConnected) {
      // 시장 정보 구독 (환율, 테더, 유저수)
      subscribe('/topic/marketInfo', handleMarketInfoMessage);

      // 공지사항 구독
      subscribe('/topic/marketInfo/notice', handleNoticeMessage);

      return () => {
        unsubscribe('/topic/marketInfo');
        unsubscribe('/topic/marketInfo/notice');
      };
    }
  }, [
    isConnected,
    subscribe,
    unsubscribe,
    handleMarketInfoMessage,
    handleNoticeMessage,
  ]);

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
    // 현재 페이지 URL을 저장
    const currentUrl = window.location.href;
    sessionStorage.setItem('loginRedirectUrl', currentUrl);
    router.push('/login');
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
        showSuccess('로그아웃 성공');
        dispatch(logout());

        // 세션 스토리지 정리
        sessionStorage.clear();

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        showError('로그아웃 실패');
      }
    } catch (error) {
      console.error('로그아웃 오류', error);
      showError('로그아웃 중 오류 발생');
    }
  };

  const handleProfileClick = () => {
    if (user?.memberId) {
      router.push(`/profile/${user.memberId}`);
    }
  };

  const handleAdminClick = () => {
    router.push('/admin');
  };

  const handleNickname = () => {
    setIsNicknameModalOpen(true);
  };

  return (
    <NavbarWrapper>
      <TopSection>
        {/* 좌측: 로고 + 환율정보 */}
        <LeftSection>
          <Logo onClick={() => router.push(clientEnv.MAIN_PAGE)}>
            <LogoIcon src="/logo.png" alt="KimpRun" />
          </Logo>
          <InfoContainer>
            <InfoItem>
              <Icon src="/dollar.png" alt="Dollar" />
              환율: {dollar}원
            </InfoItem>
            <InfoItem>
              <Icon src="/tether.png" alt="Tether" />
              테더: {tether}원
            </InfoItem>
            <InfoItem>유저 수: {userCount}</InfoItem>
          </InfoContainer>
        </LeftSection>

        {/* 중앙: TradingView 위젯 */}
        <TradingViewOverviewContainer>
          <TradingViewOverview />
        </TradingViewOverviewContainer>

        {/* 우측: 사용자 액션 */}
        <UserWrapperContainer>
          <UserContainer>
            <UserRole role={user?.role}>
              {isAuthenticated ? (
                user?.role === 'ROLE_OPERATOR' || user?.role === 'ROLE_MANAGER' ? (
                  <FaUserCog size={20} title="관리자" />
                ) : (
                  <FaUser size={20} title="일반 사용자" />
                )
              ) : (
                <FaUserCircle size={20} title="비로그인 사용자" />
              )}
            </UserRole>
            <UserName>{user?.name || '게스트'}</UserName>
          </UserContainer>
          <ActionButtons>
            <DesktopThemeToggle>
              <ThemeToggle />
            </DesktopThemeToggle>
            {isAuthenticated && (user?.role === 'ROLE_OPERATOR' || user?.role === 'ROLE_MANAGER') && (
              <ActionButton onClick={handleAdminClick}>관리자</ActionButton>
            )}
            {isAuthenticated && (
              <ActionButton onClick={handleProfileClick}>프로필</ActionButton>
            )}
            {!isAuthenticated && (
              <ActionButton onClick={handleNickname}>닉네임</ActionButton>
            )}
            <ActionButton
              onClick={isAuthenticated ? handleLogout : handleLoginClick}
            >
              {isAuthenticated ? '로그아웃' : '로그인'}
            </ActionButton>
          </ActionButtons>
        </UserWrapperContainer>
      </TopSection>

      {/* 하단: 네비게이션 메뉴 */}
      <BottomSection>
        <NavMenu>
          <NavMenuItem onClick={() => router.push(clientEnv.MAIN_PAGE)}>
            메인페이지
          </NavMenuItem>
          <NavMenuItem
            onClick={() => {
              router.push(
                `${clientEnv.COMMUNITY_PAGE}/coin/1?page=1&size=15`
              );
            }}
          >
            커뮤니티
            <SubMenu>
              <SubMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`${clientEnv.COMMUNITY_PAGE}/expert`);
                }}
              >
                전문가 게시판
              </SubMenuItem>
              <SubMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(
                    `${clientEnv.COMMUNITY_PAGE}/coin/1?page=1&size=15`
                  );
                }}
              >
                코인 게시판
              </SubMenuItem>
            </SubMenu>
          </NavMenuItem>
          <NavMenuItem
            onClick={() =>
              router.push(
                `${clientEnv.INFORMATION_PAGE}/coin-ranking?page=1&size=100`
              )
            }
          >
            정보
            <SubMenu>
              <SubMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(
                    `${clientEnv.INFORMATION_PAGE}/coin-ranking?page=1&size=100`
                  );
                }}
              >
                코인 순위
              </SubMenuItem>
              <SubMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(
                    `${clientEnv.INFORMATION_PAGE}/exchange-ranking?page=1&size=100`
                  );
                }}
              >
                거래소 순위
              </SubMenuItem>
              <SubMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`${clientEnv.INFORMATION_PAGE}/crypto-heatmap`);
                }}
              >
                코인 히트맵
              </SubMenuItem>
              <SubMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`${clientEnv.INFORMATION_PAGE}/chart-map`);
                }}
              >
                차트 맵
              </SubMenuItem>
            </SubMenu>
          </NavMenuItem>
          <NavMenuItem onClick={() => router.push(clientEnv.NEWS_PAGE)}>
            뉴스
          </NavMenuItem>
        </NavMenu>
        
        {/* 코인 검색 */}
        <CoinSearchNav />
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

      {isNicknameModalOpen && (
        <Modal
          width={420}
          height={260}
          element={
            <NicknameModal
              initialName={user?.name ?? ''}
              onCancel={() => setIsNicknameModalOpen(false)}
              onSave={async (newName) => {
                if (isAuthenticated) {
                  // 로그인 사용자는 기존 로직 사용 (추후 프로필 API로 변경 필요)
                  dispatch(setUser({ ...user, name: newName }));
                  setIsNicknameModalOpen(false);
                } else {
                  // 비로그인 사용자는 게스트 API 사용
                  try {
                    const result = await updateGuestNickname(uuid, newName);
                    if (result) {
                      dispatch(updateGuestNicknameAction(result.name));
                      showSuccess('닉네임이 변경되었습니다.');
                      setIsNicknameModalOpen(false);
                    } else {
                      showError('닉네임 변경에 실패했습니다.');
                    }
                  } catch (error) {
                    console.error('게스트 닉네임 변경 오류:', error);
                    showError('닉네임 변경 중 오류가 발생했습니다.');
                  }
                }
              }}
            />
          }
          setModal={setIsNicknameModalOpen}
        />
      )}
    </NavbarWrapper>
  );
};

export default Nav;
