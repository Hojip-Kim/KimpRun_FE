'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { ChatMessage } from '@/types';
import { RootState } from '@/redux/store';
import { Icon } from '../nav/client/styled';
import './Chat.css';
import { getChatLogs } from '@/server/serverDataLoader';
import { clientEnv } from '@/utils/env';
import {
  ChatContainer,
  ChatWrapper,
  FetchButton,
  MessageContainer,
  MessageContent,
  ChatForm,
  ChatInput,
  SendButton,
  ConnectionStatus,
  ChatBox,
} from './style';

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [page, setPage] = useState<number>(0);
  const [chatId, setChatId] = useState<string>('');
  const [connectionStatus, setConnectionStatus] =
    useState<string>('연결 중...');

  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);

  const websocketUrl = clientEnv.CHAT_WEBSOCKET_URL;

  const fetchPreviousMessage = async () => {
    try {
      if (chatBoxRef.current) {
        const scrollContainer = chatBoxRef.current;
        const prevScrollHeight = scrollContainer.scrollHeight;
        const prevScrollTop = scrollContainer.scrollTop;

        const parsedData = await getChatLogs(page, 30);
        if (parsedData) {
          setMessages((prev) => [...parsedData, ...prev]);
          setPage((prev) => prev + 1);

          setTimeout(() => {
            if (scrollContainer) {
              const newScrollHeight = scrollContainer.scrollHeight;
              scrollContainer.scrollTop =
                newScrollHeight - prevScrollHeight + prevScrollTop;
            }
          }, 0);
        }
      }
    } catch (error) {
      console.error('이전 메시지 로딩 오류:', error);
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
                  chatID: chatId,
                  content: '',
                  authenticated: user?.role === 'GUEST' ? 'false' : 'true',
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

          if (data.ping === true) {
            return;
          }

          if (data) {
            setMessages((prev) => [...prev, data]);
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

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const currentReadyState = websocketRef.current?.readyState;

    if (currentReadyState !== WebSocket.OPEN) {
      setConnectionStatus('재연결 시도 중...');
      connectWebSocket();
      setTimeout(() => handleSendMessage(), 1500);
      return;
    }

    const message: ChatMessage = {
      ping: false,
      chatID: chatId || '게스트',
      content: input,
      authenticated: user?.role === 'GUEST' ? 'false' : 'true',
    };

    try {
      websocketRef.current.send(JSON.stringify(message));
      console.log('메시지 전송 성공:', message);
      setInput('');
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
    setChatId(user?.name || '게스트');

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

  return (
    <ChatWrapper>
      <ConnectionStatus
        status={connectionStatus === '연결됨' ? 'connected' : 'disconnected'}
      >
        {connectionStatus}
      </ConnectionStatus>
      <ChatContainer>
        <ChatBox ref={chatBoxRef}>
          <FetchButton onClick={fetchPreviousMessage}>
            이전 메세지 불러오기
          </FetchButton>
          {messages.map((data, index) => (
            <MessageContainer
              key={index}
              authenticated={data.authenticated}
              $isSelf={data.chatID === (user?.name || '게스트')}
            >
              <div>
                <MessageContent>
                  {data.chatID === (user?.name || '게스트')
                    ? ''
                    : data.chatID + ':'}{' '}
                  {data.content}
                </MessageContent>
                {data.authenticated === 'true' &&
                  data.chatID !== (user?.name || '게스트') && (
                    <Icon
                      src="/bitcoin.png"
                      alt="medal"
                      style={{ margin: '0 5px' }}
                    />
                  )}
              </div>
            </MessageContainer>
          ))}
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
          placeholder="채팅 메시지를 입력하세요."
        />
        <SendButton type="submit">전송</SendButton>
      </ChatForm>
    </ChatWrapper>
  );
};

export default Chat;
