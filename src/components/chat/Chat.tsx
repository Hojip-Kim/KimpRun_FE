'use client';

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ChatMessage, ChatMessageRequest } from '@/types';
import { RootState } from '@/redux/store';
import { useGlobalAlert } from '@/providers/AlertProvider';
import {
  getBlockedGuests,
  getBlockedMembers,
  addBlockedGuest,
  addBlockedMember,
  removeBlockedGuest,
  removeBlockedMember,
  clearAllBlocked,
} from '@/utils/blockingCookie';

import './Chat.css';
import {
  deleteAnonChatByInherenceId,
  deleteAuthChatByInherenceId,
  getChatLogs,
  reportUser,
} from '@/components/chat/client/dataFetch';
import { IMessage } from '@stomp/stompjs';
import { useStompClientSingleton } from '@/hooks/useStompClientSingleton';
import {
  ChatContainer,
  ChatWrapper,
  MessageContainer,
  MessageBubble,
  MessageHeader,
  UserName,
  UserDropdown,
  DropdownItem,
  DeleteButton,
  MessageTimeSide,
  MessageContent,
  ChatForm,
  ChatInput,
  SendButton,
  ConnectionStatus,
  ChatBox,
  ChatHeader,
  UnblockAllButton,
  ReportModal,
  ReportModalContent,
  ReportModalTitle,
  ReportTextArea,
  ReportModalButtons,
  ReportModalButton,
  ReportCharCount,
} from './style';
import { ChatSkeleton } from '@/components/skeleton/Skeleton';
import ProfileImage from '@/components/common/ProfileImage';
import { parseDate } from '@/utils/dateUtils';

const Chat = () => {
  const router = useRouter();
  const { showConfirm, showSuccess, showError } = useGlobalAlert();

  // 시간 포맷 함수 - 오늘 메시지는 시/분만, 이전 날짜는 전체 날짜/시간 표시
  const formatMessageTime = (dateInput: string | Date | number[]) => {
    const messageDate = parseDate(dateInput);
    if (!messageDate) return '-';

    const today = new Date();

    // 오늘 자정
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    if (messageDate >= todayStart) {
      // 오늘 작성된 메시지: 시/분만 표시
      return messageDate.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      // 이전 날짜 메시지: 연/월/일 시/분까지 표시
      return messageDate.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>('');
  const [reportTarget, setReportTarget] = useState<ChatMessage | null>(null);

  const scrollToBottom = useCallback(() => {
    const sc = scrollRef.current;
    if (!sc) {
      console.warn('⚠️ scrollRef.current가 null입니다');
      return;
    }

    // column-reverse에서는 scrollTop = 0이 맨 아래(최신 메시지)
    sc.scrollTop = 0;
  }, []);

  // 메시지 상태 변경 감지를 위한 useEffect
  useEffect(() => {
    // 새 메시지가 추가될 때마다 스크롤 위치 확인 후 하단으로 이동 (무한스크롤 중이 아닐 때만)
    if (
      messages.length > 0 &&
      firstScrollDoneRef.current &&
      !isAdjustingRef.current
    ) {
      const sc = scrollRef.current;
      if (sc) {
        // column-reverse에서 scrollTop이 0에 가까우면 맨 아래(최신 메시지 영역)
        // scrollTop이 음수이므로 절댓값이 50 이하인지 확인
        const nearBottom = Math.abs(sc.scrollTop) <= 50;

        if (nearBottom) {
          requestAnimationFrame(() => scrollToBottom());
        }
      }
    }
  }, [messages, scrollToBottom]);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [input, setInput] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const pageSize = 30;

  // 싱글톤 STOMP 클라이언트 사용
  const {
    isConnected,
    isConnecting,
    connectionError,
    subscribe,
    unsubscribe,
    publish,
  } = useStompClientSingleton({
    autoConnect: true,
  });

  // 도배 방지 상태
  const [messageTimestamps, setMessageTimestamps] = useState<number[]>([]);
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);
  const [warningMessage, setWarningMessage] = useState<string>('');
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  // IME 입력 상태 추적 (한글 입력 중복 방지)
  const [isComposing, setIsComposing] = useState<boolean>(false);

  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isAdjustingRef = useRef<boolean>(false);
  const firstScrollDoneRef = useRef<boolean>(false);
  const initializedRef = useRef<boolean>(false);
  const topFetchLockRef = useRef<boolean>(false);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const uuid = useSelector((state: RootState) => state.auth.uuid);

  const [blockedMembers, setBlockedMembers] = useState<string[]>([]);
  const [blockedGuests, setBlockedGuests] = useState<string[]>([]);

  useEffect(() => {
    setBlockedMembers(getBlockedMembers());
    setBlockedGuests(getBlockedGuests());
  }, []);

  useEffect(() => {
    if (cooldownUntil <= 0) {
      setRemainingSeconds(0);
      return;
    }

    // 초기 남은 시간 설정
    const initialRemaining = Math.ceil((cooldownUntil - Date.now()) / 1000);
    setRemainingSeconds(initialRemaining);

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.ceil((cooldownUntil - now) / 1000);

      if (remaining <= 0) {
        setCooldownUntil(0);
        setRemainingSeconds(0);
        setWarningMessage('');
      } else {
        setRemainingSeconds(remaining);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [cooldownUntil]);

  // 사용자 정보가 없으면 게스트 사용자로 설정
  const currentUser = user || {
    name: '게스트',
    email: null,
    role: 'GUEST' as const,
    memberId: null,
  };

  // 내 메시지인지 판별하는 함수
  const isMyMessage = (message: ChatMessage): boolean => {
    if (isAuthenticated && currentUser.memberId) {
      // 로그인한 사용자: memberId로 판별
      return (
        message.memberId === currentUser.memberId &&
        message.authenticated === true
      );
    } else {
      // 비로그인 사용자: UUID로 판별
      return message.uuid === uuid && message.authenticated === false;
    }
  };

  // 특정 사용자가 차단되어 있는지 확인하는 함수
  const isUserBlocked = (message: ChatMessage): boolean => {
    if (message.authenticated && message.memberId) {
      return blockedMembers.includes(message.memberId.toString());
    }
    return blockedGuests.includes(message.uuid);
  };

  // 모든 메시지를 표시하되 차단된 사용자 메시지는 표시 방식을 다르게 함
  const processedMessages = useMemo(() => {
    return messages.map((message) => {
      const isBlocked = isUserBlocked(message);
      return {
        ...message,
        isBlockedUser: isBlocked,
      };
    });
  }, [messages, blockedMembers, blockedGuests]);

  // 드롭다운 핸들러 함수들
  const handleUserNameClick = (
    messageId: string,
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    if (openDropdown === messageId) {
      setOpenDropdown(null);
      setDropdownPosition(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      const dropdownHeight = 120;
      const dropdownWidth = 100;

      let top = rect.bottom + window.scrollY;
      let left = rect.left + window.scrollX;

      // 뷰포트 경계 체크 및 조정
      if (top + dropdownHeight > window.innerHeight + window.scrollY) {
        top = rect.top + window.scrollY - dropdownHeight;
      }

      if (left + dropdownWidth > window.innerWidth) {
        left = window.innerWidth - dropdownWidth - 10;
      }

      if (left < 10) {
        left = 10;
      }

      setDropdownPosition({ top, left });
      setOpenDropdown(messageId);
    }
  };

  const handleProfileClick = (memberId?: number) => {
    if (memberId) {
      window.open(`/profile/${memberId}`, '_blank');
    }
  };

  const handleDeleteMessage = async (inherenceId: string) => {
    if (isAuthenticated) {
      const result = await deleteAuthChatByInherenceId(inherenceId);
      if (result === true) {
        setMessages((prev) =>
          prev.filter((message) => message.inherenceId !== inherenceId)
        );
      } else {
      }
    } else {
      const result = await deleteAnonChatByInherenceId(inherenceId);
      if (result === true) {
        setMessages((prev) =>
          prev.filter((message) => message.inherenceId !== inherenceId)
        );
      } else {
      }
    }
  };

  const handleProfile = (message: ChatMessage) => {
    // 로그인한 사용자만 프로필이 있음
    if (message.authenticated && message.memberId) {
      router.push(`/profile/${message.memberId}`);
    } else {
      showConfirm('게스트 사용자는 프로필이 없습니다.', () => {}, {
        title: '프로필 접근 불가',
        type: 'info',
        confirmText: '확인',
      });
    }
    setOpenDropdown(null);
    setDropdownPosition(null);
  };

  const handleReport = (message: ChatMessage) => {
    setReportTarget(message);
    setShowReportModal(true);
    setOpenDropdown(null);
    setDropdownPosition(null);
  };

  const handleReportSubmit = async () => {
    if (!reportTarget) return;

    // fromMember 결정: 현재 사용자가 로그인했으면 memberId, 아니면 uuid
    const fromMember = isAuthenticated
      ? currentUser.memberId?.toString() || uuid
      : uuid;

    // toMember 결정: 신고 대상이 authenticated면 memberId, 아니면 uuid
    const toMember =
      reportTarget.authenticated && reportTarget.memberId
        ? reportTarget.memberId.toString()
        : reportTarget.uuid;

    try {
      const result = await reportUser(
        fromMember,
        toMember,
        reportReason.trim()
      );

      if (result.success) {
        showSuccess(result.message);
        setShowReportModal(false);
        setReportReason('');
        setReportTarget(null);
      } else {
        showError(result.message);
      }
    } catch (error) {
      console.error('신고 처리 오류:', error);
      showError('신고 처리 중 오류가 발생했습니다.');
    }
  };

  const handleReportCancel = () => {
    setShowReportModal(false);
    setReportReason('');
    setReportTarget(null);
  };

  const handleBlock = (message: ChatMessage) => {
    if (
      message.authenticated &&
      message.memberId !== undefined &&
      message.memberId !== null
    ) {
      // 로그인한 사용자는 memberId로 차단
      addBlockedMember(message.memberId.toString());
      setBlockedMembers(getBlockedMembers());
    } else {
      // 게스트 사용자는 uuid로 차단
      addBlockedGuest(message.uuid);
      setBlockedGuests(getBlockedGuests());
    }
    setOpenDropdown(null);
  };

  // 차단 해제 함수
  const handleUnblock = (message: ChatMessage) => {
    showConfirm(
      `${message.nickname}님의 차단을 해제하시겠습니까?`,
      () => {
        if (
          message.authenticated &&
          message.memberId !== undefined &&
          message.memberId !== null
        ) {
          // 로그인한 사용자 차단 해제
          removeBlockedMember(message.memberId.toString());
          setBlockedMembers(getBlockedMembers());
        } else {
          // 게스트 사용자 차단 해제
          removeBlockedGuest(message.uuid);
          setBlockedGuests(getBlockedGuests());
        }
      },
      {
        title: '차단 해제',
        type: 'warning',
        confirmText: '해제',
        cancelText: '취소',
      }
    );
    setOpenDropdown(null);
  };

  // 전체 차단 해제 기능
  const handleClearAllBlocks = () => {
    const totalBlocked =
      (blockedMembers?.length || 0) + (blockedGuests?.length || 0);

    showConfirm(
      `총 ${totalBlocked}명의 차단된 사용자를 모두 해제하시겠습니까?`,
      () => {
        clearAllBlocked();
        setBlockedMembers([]);
        setBlockedGuests([]);
      },
      {
        title: '전체 차단 해제',
        type: 'warning',
        confirmText: '모두 해제',
        cancelText: '취소',
      }
    );
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const isDropdownClick =
        target.closest('[data-dropdown]') ||
        target.closest('[data-dropdown-trigger]');

      if (openDropdown && !isDropdownClick) {
        setOpenDropdown(null);
        setDropdownPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // 이전 메시지 로드 함수
  const fetchPreviousMessage = useCallback(async () => {
    try {
      if (scrollRef.current) {
        const scrollContainer = scrollRef.current;
        const prevScrollTop = scrollContainer.scrollTop;

        // 중복 로드를 방지하기 위해 먼저 로딩 플래그 설정
        setIsLoadingMore(true);
        isAdjustingRef.current = true;

        const newMessages = await getChatLogs(page, pageSize);

        if (newMessages.length === 0) {
          setHasMore(false);
          return;
        }

        // column-reverse: 과거 메시지는 배열 뒤쪽에 추가 (화면에서는 위쪽에 표시됨)
        setMessages((prev) => [...prev, ...newMessages.reverse()]);

        // 다음 페이지 존재 여부 업데이트 (응답이 페이지 크기보다 작으면 더 없음)
        if (newMessages.length < pageSize) {
          setHasMore(false);
        }

        // 스크롤 위치 조정 (사용자가 제안한 방식: 아래에서부터의 거리 유지)
        // DOM 업데이트가 완전히 완료된 후 스크롤 조정
        setTimeout(() => {
          // column-reverse에서 맨 아래(최신)가 scrollTop = 0
          // 사용자가 현재 맨 아래에서 얼마나 올라가 있는지 계산
          const distanceFromBottom = Math.abs(prevScrollTop);

          // 새 데이터 로드 후에도 같은 거리만큼 위에 위치시키기
          const newScrollTop = -distanceFromBottom;

          scrollContainer.scrollTop = newScrollTop;

          isAdjustingRef.current = false;
        }, 0);
      }

      setPage((prev) => {
        const newPage = prev + 1;
        return newPage;
      });
    } catch (error) {
      console.error('이전 메시지 로드 오류:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, pageSize]);

  // 채팅 메시지 처리 함수
  const handleChatMessage = useCallback(
    (message: IMessage) => {
      try {
        const data: ChatMessage = JSON.parse(message.body);

        if (data.ping === true) {
          return;
        }

        if (data) {
          // 백엔드에서 chatID로 오는 데이터를 chatId로 변환
          const normalizedData = {
            ...data,
            chatId: data.chatId,
            registedAt: data.registedAt || new Date().toISOString(), // 날짜 필드 보장
            memberId: data.memberId,
          };

          const sc = scrollRef.current;
          // column-reverse에서 scrollTop이 0에 가까우면 맨 아래(최신 메시지 영역)
          let nearBottom = true;
          if (sc) {
            // scrollTop이 음수이므로 절댓값이 50 이하인지 확인
            nearBottom = Math.abs(sc.scrollTop) <= 50;
          }

          setMessages((prev) => {
            const newMessages = [normalizedData, ...prev];

            // 메시지 추가 후 스크롤 처리 (무한스크롤 로딩 중이 아닐 때만)
            if (!isAdjustingRef.current) {
              requestAnimationFrame(() => {
                if (nearBottom) {
                  scrollToBottom();
                }
              });
            }

            return newMessages;
          });
        }
      } catch (error) {
        console.error('❌ 채팅 메시지 파싱 오류:', error);
        console.error('원본 메시지:', message.body);
      }
    },
    [scrollToBottom]
  );

  // STOMP 구독 설정
  useEffect(() => {
    if (isConnected) {
      subscribe('/topic/chat', handleChatMessage);

      // 30초마다 ping 메시지 전송하여 연결 유지
      pingIntervalRef.current = setInterval(() => {
        if (isConnected) {
          try {
            publish('/app/chat', {
              ping: true,
              chatId: currentUser.name,
              content: '',
              authenticated: currentUser.role === 'GUEST' ? false : true,
            });
          } catch (e) {
            console.error('❌ 하트비트 전송 오류:', e);
          }
        }
      }, 30000);

      return () => {
        unsubscribe('/topic/chat');
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
        }
      };
    }
  }, [
    isConnected,
    subscribe,
    unsubscribe,
    publish,
    handleChatMessage,
    currentUser.name,
  ]);

  // 도배 방지 검사 함수
  const checkSpamPrevention = (): { allowed: boolean; message: string } => {
    const now = Date.now();
    const trimmedInput = input.trim();

    // 쿨다운 중인지 확인
    if (now < cooldownUntil) {
      const remainingSeconds = Math.ceil((cooldownUntil - now) / 1000);
      return {
        allowed: false,
        message: `${remainingSeconds}초 후에 다시 시도해주세요.`,
      };
    }

    // 빈 메시지 체크
    if (!trimmedInput) {
      return { allowed: false, message: '메시지를 입력해주세요.' };
    }

    // 3초 동안 5회 이상 전송 방지
    const threeSecondsAgo = now - 3000;
    const recentMessages = messageTimestamps.filter(
      (timestamp) => timestamp > threeSecondsAgo
    );

    if (recentMessages.length >= 5) {
      setCooldownUntil(now + 5000); // 5초 쿨다운
      return {
        allowed: false,
        message:
          '메시지를 너무 빠르게 보내고 있습니다. 5초 후에 다시 시도해주세요.',
      };
    }

    return { allowed: true, message: '' };
  };

  const handleSendMessage = () => {
    // 도배 방지 검사
    const spamCheck = checkSpamPrevention();
    if (!spamCheck.allowed) {
      setWarningMessage(spamCheck.message);
      setTimeout(() => setWarningMessage(''), 3000);
      return;
    }

    if (!isConnected) {
      setWarningMessage('연결되지 않음. 잠시 후 다시 시도해주세요.');
      setTimeout(() => setWarningMessage(''), 3000);
      return;
    }

    const message: ChatMessageRequest = {
      ping: false,
      chatId: currentUser.name,
      content: input,
      authenticated: currentUser.role === 'GUEST' ? false : true,
      memberId: currentUser.memberId || null,
    };

    try {
      const now = Date.now();

      publish('/app/chat', message);

      // 도배 방지 상태 업데이트 - 현재 시간 추가하고 3초 이전 기록 자동 정리
      setMessageTimestamps((prev) => {
        const updated = [...prev, now];
        return updated.filter((timestamp) => timestamp > now - 3000);
      });

      setInput('');
      setWarningMessage('');

      // 메시지 전송 후 스크롤을 맨 아래로 이동
      requestAnimationFrame(() => scrollToBottom());
      setTimeout(() => requestAnimationFrame(() => scrollToBottom()), 100);
    } catch (error) {
      console.error('❌ 메시지 전송 오류:', error);
      setWarningMessage('메시지 전송에 실패했습니다.');
      setTimeout(() => setWarningMessage(''), 3000);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // IME 입력 중일 때는 Enter 키 처리를 하지 않음 (한글 입력 중복 방지)
    if (event.key === 'Enter' && !event.shiftKey && !isComposing) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // IME 컴포지션 이벤트 핸들러들 (한글 입력 중복 방지)
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  // 데이터 새로고침 함수
  const refreshChatData = useCallback(async () => {
    try {
      setInitialLoading(true);
      isAdjustingRef.current = true;

      // 메시지 초기화
      setMessages([]);
      setPage(0);
      setHasMore(true);

      const initialMessages = await getChatLogs(0, pageSize);

      setMessages(initialMessages.reverse());
      setPage(1);
      setInitialLoading(false);

      if (initialMessages.length < pageSize) {
        setHasMore(false);
      }

      // 초기 로드 후 스크롤을 맨 아래로
      if (!isAdjustingRef.current) {
        setTimeout(() => {
          scrollToBottom();
          firstScrollDoneRef.current = true;
        }, 50);
      }
    } catch (error) {
      console.error('채팅 데이터 새로고침 오류:', error);
      setInitialLoading(false);
    }
  }, [pageSize, scrollToBottom]);

  // 차단 목록 상태 변경 감지하여 자동 데이터 새로고침
  useEffect(() => {
    if (initializedRef.current && firstScrollDoneRef.current) {
      // 약간의 지연을 두어 UI 업데이트 후 데이터 로드
      setTimeout(() => {
        refreshChatData();
      }, 100);
    }
  }, [blockedGuests, blockedMembers, refreshChatData]);

  // 초기 메시지 로드
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const loadInitialMessages = async () => {
      try {
        const initialMessages = await getChatLogs(0, pageSize);

        // column-reverse에서는 최신 메시지가 배열 앞쪽에 있어야 화면 아래쪽에 나타남
        setMessages(initialMessages.reverse());
        setPage(1);
        setInitialLoading(false);

        // hasMore 상태 설정
        if (initialMessages.length < pageSize) {
          setHasMore(false);
        }

        // 초기 로드 후 스크롤을 맨 아래로 (무한스크롤 로딩 중이 아닐 때만)
        if (!isAdjustingRef.current) {
          setTimeout(() => {
            scrollToBottom();
            firstScrollDoneRef.current = true;
          }, 50);
        }
      } catch (error) {
        console.error('초기 메시지 로드 오류:', error);
        setInitialLoading(false);
      }
    };

    loadInitialMessages();
  }, [pageSize, scrollToBottom]);

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    if (
      !scrollRef.current ||
      isAdjustingRef.current ||
      !hasMore ||
      isLoadingMore
    ) {
      return;
    }

    const container = scrollRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;

    // column-reverse에서 맨 위(과거 메시지)에 도달했을 때 이전 메시지 로드
    // column-reverse에서는 스크롤을 위로 올릴 때 scrollTop이 음수가 됨
    const threshold = 100;
    const maxScrollableDistance = scrollHeight - clientHeight;
    // column-reverse에서 맨 위에 가까워졌는지 확인 (scrollTop이 음수이므로 절댓값 사용)
    const distanceFromTop = Math.abs(scrollTop);
    const isNearTop = distanceFromTop >= maxScrollableDistance - threshold;

    // 연속 트리거 방지: 임계치에서 충분히 벗어나기 전까지 재트리거 금지
    if (topFetchLockRef.current) {
      if (distanceFromTop < maxScrollableDistance - threshold * 2) {
        topFetchLockRef.current = false;
      } else {
        return;
      }
    }

    if (isNearTop) {
      topFetchLockRef.current = true;
      fetchPreviousMessage();
    }
  };

  // 연결 상태에 따른 상태 메시지
  const getConnectionStatus = () => {
    if (connectionError) {
      return `연결 오류: ${connectionError}`;
    }
    if (isConnecting) {
      return '연결 중...';
    }
    if (isConnected) {
      return '연결됨';
    }
    return '연결 종료됨';
  };

  const getConnectionStatusType = () => {
    if (connectionError) {
      return 'error';
    }
    if (isConnecting) {
      return 'connecting';
    }
    if (isConnected) {
      return 'connected';
    }
    return 'disconnected';
  };

  if (initialLoading) {
    return <ChatSkeleton />;
  }

  return (
    <ChatContainer>
      <ChatWrapper>
        <ChatHeader>
          {((blockedMembers && blockedMembers.length > 0) ||
            (blockedGuests && blockedGuests.length > 0)) && (
            <UnblockAllButton
              onClick={handleClearAllBlocks}
              title={`차단된 사용자 ${
                (blockedMembers?.length || 0) + (blockedGuests?.length || 0)
              }명`}
            >
              차단해제
            </UnblockAllButton>
          )}
        </ChatHeader>

        <ChatBox ref={scrollRef} onScroll={handleScroll}>
          {isLoadingMore && (
            <div
              style={{ padding: '10px', textAlign: 'center', color: '#666' }}
            >
              이전 메시지 로딩 중...
            </div>
          )}

          {processedMessages.map((message, index) => (
            <MessageContainer
              key={`${message.chatId}-${index}`}
              $authenticated={message.authenticated}
              $isSelf={isMyMessage(message)}
            >
              {message.isDeleted ? (
                <div>삭제된 메시지입니다.</div>
              ) : (message as any).isBlockedUser ? (
                <div
                  style={{
                    opacity: 0.5,
                    backgroundColor: '#f0f0f0',
                    padding: '8px',
                    borderRadius: '8px',
                    margin: '4px 0',
                    fontSize: '12px',
                    color: '#666',
                  }}
                >
                  <div style={{ marginBottom: '4px' }}>
                    🚫 차단된 사용자의 메시지 (클릭하여 보기)
                  </div>
                  <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      const element = document.getElementById(
                        `blocked-message-${message.chatId}-${index}`
                      );
                      if (element) {
                        element.style.display =
                          element.style.display === 'none' ? 'block' : 'none';
                      }
                    }}
                  >
                    <div
                      id={`blocked-message-${message.chatId}-${index}`}
                      style={{ display: 'none' }}
                    >
                      <strong>{message.nickname}:</strong> {message.content}
                    </div>
                    <div style={{ fontSize: '10px', color: '#999' }}>
                      {formatMessageTime(message.registedAt)}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <MessageBubble
                    $authenticated={message.authenticated}
                    $isSelf={isMyMessage(message)}
                  >
                    {/* 내가 작성한 메시지가 아닐 때만 헤더(이름+시간) 표시 */}
                    {!isMyMessage(message) && (
                      <MessageHeader $isSelf={false}>
                        <ProfileImage
                          src={message.profileImageUrl}
                          alt={message.nickname}
                          size={24}
                          onClick={() => handleProfileClick(message.memberId)}
                        />
                        <UserName
                          $authenticated={message.authenticated}
                          $isSelf={false}
                          data-dropdown-trigger="true"
                          onClick={(e) =>
                            handleUserNameClick(`${message.chatId}-${index}`, e)
                          }
                        >
                          {message.nickname}
                          {/* 사용자 이름 드롭다운 */}
                          <UserDropdown
                            $show={
                              openDropdown === `${message.chatId}-${index}`
                            }
                            data-dropdown="true"
                            style={
                              openDropdown === `${message.chatId}-${index}` &&
                              dropdownPosition
                                ? {
                                    top: `${dropdownPosition.top}px`,
                                    left: `${dropdownPosition.left}px`,
                                  }
                                : {}
                            }
                          >
                            {message.authenticated ? (
                              // 인증된 사용자용 메뉴
                              <>
                                <DropdownItem
                                  className="profile"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleProfile(message);
                                  }}
                                >
                                  프로필
                                </DropdownItem>
                                <DropdownItem
                                  className="report"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReport(message);
                                  }}
                                >
                                  신고
                                </DropdownItem>
                                {isUserBlocked(message) ? (
                                  <DropdownItem
                                    className="unblock"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUnblock(message);
                                    }}
                                  >
                                    차단해제
                                  </DropdownItem>
                                ) : (
                                  <DropdownItem
                                    className="block"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleBlock(message);
                                    }}
                                  >
                                    차단
                                  </DropdownItem>
                                )}
                              </>
                            ) : (
                              // 비인증 사용자용 메뉴
                              <>
                                {isUserBlocked(message) ? (
                                  <DropdownItem
                                    className="unblock"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUnblock(message);
                                    }}
                                  >
                                    차단해제
                                  </DropdownItem>
                                ) : (
                                  <DropdownItem
                                    className="block"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleBlock(message);
                                    }}
                                  >
                                    차단
                                  </DropdownItem>
                                )}
                                <DropdownItem
                                  className="report"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReport(message);
                                  }}
                                >
                                  신고
                                </DropdownItem>
                              </>
                            )}
                          </UserDropdown>
                        </UserName>
                      </MessageHeader>
                    )}
                    <MessageContent $isSelf={isMyMessage(message)}>
                      {message.content}
                    </MessageContent>
                  </MessageBubble>
                  {/* 모든 메시지에 말풍선 옆 시간 표시 */}
                  <MessageTimeSide $isSelf={isMyMessage(message)}>
                    {formatMessageTime(message.registedAt)}
                  </MessageTimeSide>
                  {/* 내 메시지에만 삭제 버튼 표시 */}
                  {isMyMessage(message) && (
                    <DeleteButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMessage(message.inherenceId);
                      }}
                      title="메시지 삭제"
                    >
                      ✕
                    </DeleteButton>
                  )}
                </>
              )}
            </MessageContainer>
          ))}

          <div ref={messageEndRef} />
        </ChatBox>

        <ChatForm>
          {warningMessage && (
            <div
              style={{ color: 'red', fontSize: '12px', marginBottom: '5px' }}
            >
              {warningMessage}
              {remainingSeconds > 0 && ` (${remainingSeconds}초 남음)`}
            </div>
          )}
          <ChatInput
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder={
              !isConnected 
                ? "연결이 불안정합니다. 잠시 기다려주세요..." 
                : "메시지를 입력하세요..."
            }
            disabled={!isConnected || cooldownUntil > Date.now()}
          />
          <SendButton
            onClick={handleSendMessage}
            disabled={
              !isConnected || cooldownUntil > Date.now() || !input.trim()
            }
          >
            전송
          </SendButton>
        </ChatForm>
      </ChatWrapper>

      {/* 신고 모달 */}
      <ReportModal $show={showReportModal}>
        <ReportModalContent>
          <ReportModalTitle>
            {reportTarget?.nickname}님을 신고하시겠습니까?
          </ReportModalTitle>

          <ReportTextArea
            placeholder="신고 사유를 입력해주세요 (150자 이내, 공백 가능)"
            value={reportReason}
            onChange={(e) => {
              if (e.target.value.length <= 150) {
                setReportReason(e.target.value);
              }
            }}
            maxLength={150}
          />

          <ReportCharCount>{reportReason.length}/150</ReportCharCount>

          <ReportModalButtons>
            <ReportModalButton
              $variant="secondary"
              onClick={handleReportCancel}
            >
              취소
            </ReportModalButton>
            <ReportModalButton
              $variant="primary"
              onClick={handleReportSubmit}
              disabled={reportReason.trim().length === 0}
            >
              신고하기
            </ReportModalButton>
          </ReportModalButtons>
        </ReportModalContent>
      </ReportModal>
    </ChatContainer>
  );
};

export default Chat;
