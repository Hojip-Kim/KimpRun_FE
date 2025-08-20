'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { ChatMessage, ChatMessageRequest } from '@/types';
import { RootState } from '@/redux/store';
import { Icon } from '../nav/client/styled';
import './Chat.css';
import { getChatLogs } from '@/components/chat/client/dataFetch';
import { clientEnv } from '@/utils/env';
import {
  ChatContainer,
  ChatWrapper,
  MessageContainer,
  MessageBubble,
  MessageHeader,
  UserName,
  MessageTime,
  MessageTimeSide,
  MessageContent,
  ChatForm,
  ChatInput,
  SendButton,
  ConnectionStatus,
  ChatBox,
} from './style';

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [input, setInput] = useState<string>('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [page, setPage] = useState<number>(0);
  const [connectionStatus, setConnectionStatus] =
    useState<string>('연결 중...');
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const pageSize = 30;

  // 도배 방지 상태
  const [messageTimestamps, setMessageTimestamps] = useState<number[]>([]);
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);
  const [warningMessage, setWarningMessage] = useState<string>('');
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  // 쿨다운 상태를 실시간으로 업데이트하기 위한 useEffect
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
    }, 100); // 100ms마다 체크하되, 표시는 초 단위로

    return () => clearInterval(interval);
  }, [cooldownUntil]);

  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isAdjustingRef = useRef<boolean>(false);
  const firstScrollDoneRef = useRef<boolean>(false);

  const scrollToBottom = useCallback(() => {
    const sc = scrollRef.current;
    if (!sc) return;
    sc.scrollTop = sc.scrollHeight;
  }, []);

  const user = useSelector((state: RootState) => state.auth.user);
  const uuid = useSelector((state: RootState) => state.auth.uuid);

  // 사용자 정보가 없으면 채팅을 렌더링하지 않음
  if (!user) {
    return (
      <ChatWrapper>
        <ConnectionStatus status="disconnected">
          사용자 정보를 로딩 중...
        </ConnectionStatus>
      </ChatWrapper>
    );
  }

  const websocketUrl = clientEnv.CHAT_WEBSOCKET_URL;

  const fetchPreviousMessage = async () => {
    try {
      if (scrollRef.current) {
        const scrollContainer = scrollRef.current;
        const prevScrollHeight = scrollContainer.scrollHeight;
        const prevScrollTop = scrollContainer.scrollTop;
        const isFirstLoad = page === 0;

        setIsLoadingMore(true);
        isAdjustingRef.current = true;
        const parsedData: ChatMessage[] = await getChatLogs(page, pageSize);

        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setMessages((prev) => [...parsedData, ...prev]);
          setPage((prev) => prev + 1);

          requestAnimationFrame(() => {
            if (scrollContainer) {
              if (isFirstLoad) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
                firstScrollDoneRef.current = true;
              } else {
                const newScrollHeight = scrollContainer.scrollHeight;
                const addedHeight = newScrollHeight - prevScrollHeight;
                const nextTop = prevScrollTop + addedHeight;
                scrollContainer.scrollTop = Math.max(nextTop, 1);
              }
            }
            isAdjustingRef.current = false;
            setIsLoadingMore(false);
          });
        } else {
          setHasMore(false);
          isAdjustingRef.current = false;
          setIsLoadingMore(false);
        }
        // 첫 로드 완료 표시
        setInitialLoading(false);
      }
    } catch (error) {
      console.error('이전 메시지 로딩 오류:', error);
      setInitialLoading(false);
      isAdjustingRef.current = false;
      setIsLoadingMore(false);
    }
  };

  // 웹소켓 연결 함수
  const connectWebSocket = useCallback(() => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      return websocketRef.current;
    }

    // 기존 웹소켓 정리
    if (websocketRef.current) {
      websocketRef.current.close();
    }

    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }
    setConnectionStatus('연결 중...');

    try {
      const socket = new WebSocket(websocketUrl);
      websocketRef.current = socket;

      socket.onopen = () => {
        setConnectionStatus('연결됨');
        setWs(socket);

        // 30초마다 ping 메시지 전송하여 연결 유지
        pingIntervalRef.current = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            try {
              socket.send(
                JSON.stringify({
                  ping: true,
                  chatId: user.name,
                  content: '',
                  authenticated: user?.role === 'GUEST' ? false : true,
                })
              );
            } catch (e) {
              console.error('하트비트 전송 오류:', e);
            }
          }
        }, 30000);
      };

      socket.onmessage = (event) => {
        try {
          const data: ChatMessage = JSON.parse(event.data);
          console.log('data', data);

          if (data.ping === true) {
            return;
          }

          if (data) {
            const sc = scrollRef.current;
            const nearBottom = sc
              ? sc.scrollHeight - sc.scrollTop - sc.clientHeight < 80
              : false;
            setMessages((prev) => [...prev, data]);
            if (nearBottom) {
              requestAnimationFrame(() => scrollToBottom());
            }
          }
        } catch (error) {
          console.error('메시지 파싱 오류:', error);
        }
      };

      socket.onerror = (error) => {
        console.error('채팅 웹소켓 오류:', error);
        setConnectionStatus('연결 오류');

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }

        reconnectTimeoutRef.current = setTimeout(() => {
          if (socket) socket.close();
          connectWebSocket();
        }, 3000);
      };

      socket.onclose = (event) => {
        setConnectionStatus('연결 종료됨');
        setWs(null);

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }

        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      };

      return socket;
    } catch (error) {
      console.error('웹소켓 생성 오류:', error);
      setConnectionStatus('연결 실패');
      return null;
    }
  }, [websocketUrl]);

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

    const currentReadyState = websocketRef.current?.readyState;

    if (currentReadyState !== WebSocket.OPEN) {
      setConnectionStatus('재연결 시도 중...');
      connectWebSocket();
      setTimeout(() => handleSendMessage(), 1500);
      return;
    }

    const message: ChatMessageRequest = {
      ping: false,
      chatID: user.name,
      content: input,
      authenticated: user?.role === 'GUEST' ? false : true,
    };

    try {
      const now = Date.now();
      websocketRef.current.send(JSON.stringify(message));

      // 도배 방지 상태 업데이트 - 현재 시간 추가하고 3초 이전 기록 자동 정리
      setMessageTimestamps((prev) => {
        const updated = [...prev, now];
        return updated.filter((timestamp) => timestamp > now - 3000);
      });

      setInput('');
      setWarningMessage('');

      requestAnimationFrame(() => scrollToBottom());
      setTimeout(() => requestAnimationFrame(() => scrollToBottom()), 0);
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      setConnectionStatus('메시지 전송 오류');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const checkConnection = setInterval(() => {
      if (websocketRef.current) {
        if (websocketRef.current.readyState !== WebSocket.OPEN) {
          connectWebSocket();
        }
      }
    }, 60000);

    return () => clearInterval(checkConnection);
  }, [connectWebSocket]);

  useEffect(() => {
    const handleOnline = () => {
      if (
        !websocketRef.current ||
        websocketRef.current.readyState !== WebSocket.OPEN
      ) {
        connectWebSocket();
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [connectWebSocket]);

  useEffect(() => {
    fetchPreviousMessage();

    if (
      !websocketRef.current ||
      websocketRef.current.readyState !== WebSocket.OPEN
    ) {
      const socket = connectWebSocket();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }

      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [user]);

  useEffect(() => {
    if (!initialLoading && messages.length > 0 && !firstScrollDoneRef.current) {
      scrollToBottom();
      firstScrollDoneRef.current = true;
    }
  }, [initialLoading, messages.length, scrollToBottom]);

  const handleScroll = useCallback(() => {
    const sc = scrollRef.current;
    if (!sc || isLoadingMore || !hasMore || isAdjustingRef.current) return;
    const threshold = 60;
    if (sc.scrollTop <= threshold) {
      fetchPreviousMessage();
    }
  }, [isLoadingMore, hasMore]);

  return (
    <ChatWrapper>
      <ConnectionStatus
        status={connectionStatus === '연결됨' ? 'connected' : 'disconnected'}
      >
        {connectionStatus}
      </ConnectionStatus>
      <ChatContainer ref={scrollRef} onScroll={handleScroll}>
        <ChatBox ref={chatBoxRef}>
          {initialLoading && messages.length === 0 ? (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: i % 2 ? 'flex-end' : 'flex-start',
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      height: 24,
                      width: i % 2 ? '60%' : '70%',
                      borderRadius: 12,
                      background:
                        'linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 37%, rgba(255,255,255,0.06) 63%)',
                      backgroundSize: '400% 100%',
                      animation: 'chatShimmer 1.3s ease-in-out infinite',
                    }}
                  />
                </div>
              ))}
              <style jsx>{`
                @keyframes chatShimmer {
                  0% {
                    background-position: -200% 0;
                  }
                  100% {
                    background-position: 200% 0;
                  }
                }
              `}</style>
            </>
          ) : (
            messages.map((data, index) => {
              if (!data) return null;
              const isSelf = data.uuid === uuid;

              const messageTime = new Date(data.registedAt).toLocaleTimeString(
                'ko-KR',
                {
                  month: 'short',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                }
              );

              return (
                <MessageContainer
                  key={index}
                  authenticated={data.authenticated}
                  $isSelf={isSelf}
                >
                  {!isSelf && (
                    <MessageBubble
                      authenticated={data.authenticated}
                      $isSelf={isSelf}
                    >
                      <MessageHeader $isSelf={isSelf}>
                        <UserName
                          authenticated={data.authenticated}
                          $isSelf={isSelf}
                        >
                          {data.chatId}
                        </UserName>
                        {data.authenticated && (
                          <Icon
                            src="/bitcoin.png"
                            alt="medal"
                            style={{ width: '12px', height: '12px' }}
                          />
                        )}
                      </MessageHeader>
                      <MessageContent $isSelf={isSelf}>
                        {data.content}
                      </MessageContent>
                    </MessageBubble>
                  )}
                  {!isSelf && (
                    <MessageTimeSide $isSelf={false}>
                      {messageTime}
                    </MessageTimeSide>
                  )}

                  {isSelf && (
                    <MessageTimeSide $isSelf>{messageTime}</MessageTimeSide>
                  )}
                  {isSelf && (
                    <MessageBubble
                      authenticated={data.authenticated}
                      $isSelf={isSelf}
                    >
                      <MessageContent $isSelf={isSelf}>
                        {data.content}
                      </MessageContent>
                    </MessageBubble>
                  )}
                </MessageContainer>
              );
            })
          )}
          <div ref={messageEndRef}></div>
        </ChatBox>
      </ChatContainer>

      <ChatForm
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <ChatInput
          type="text"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          onKeyDown={(e) =>
            e.key === 'Enter' && e.nativeEvent.isComposing === false
              ? handleKeyPress(e)
              : null
          }
          placeholder={warningMessage || '채팅 메시지를 입력하세요.'}
          $warning={!!warningMessage}
          disabled={remainingSeconds > 0}
        />
        <SendButton
          type="submit"
          disabled={remainingSeconds > 0 || !input.trim()}
        >
          {remainingSeconds > 0 ? `${remainingSeconds}s` : '전송'}
        </SendButton>
      </ChatForm>
    </ChatWrapper>
  );
};

export default Chat;
