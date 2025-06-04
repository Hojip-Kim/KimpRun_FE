'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import './Chat.css';
import { useSelector } from 'react-redux';
import { ChatMessage } from '@/types';
import { RootState } from '@/redux/store';
import { Icon } from '../nav/client/styled';
import styled from 'styled-components';
import { getChatLogs } from '@/server/serverDataLoader';
import { clientEnv } from '@/utils/env';

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
              socket.send(JSON.stringify({ type: 'ping' }));
            } catch (e) {
              console.error('하트비트 전송 오류:', e);
            }
          }
        }, 30000);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (
            data &&
            typeof data === 'object' &&
            'type' in data &&
            data.type === 'ping'
          ) {
            return;
          }

          const parsedData: ChatMessage = data;
          if (parsedData) {
            setMessages((prev) => [...prev, parsedData]);
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
              isSelf={data.chatID === (user?.name || '게스트')}
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

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  color: #e0e0e0;
  height: 100%;
  overflow-y: auto;
  background-color: #131722;
  border-radius: 8px;
  font-size: 0.7rem;
  border: 2px solid rgba(123, 123, 123, 0.4);
  padding: 5px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ChatBox = styled.div``;

const FetchButton = styled.div`
  cursor: pointer;
  color: #4a90e2;
  margin-top: 10px;
  margin-bottom: 20px;
  &:hover {
    text-decoration: underline;
  }
`;

const MessageContainer = styled.div<{ authenticated: string; isSelf: boolean }>`
  color: ${(props) => (props.authenticated === 'true' ? '#4a90e2' : '#e0e0e0')};
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  width: 100%;
  justify-content: ${(props) => (props.isSelf ? 'flex-end' : 'flex-start')};

  & > div {
    display: flex;
    align-items: center;
    flex-direction: ${(props) => (props.isSelf ? 'row' : 'row-reverse')};
    max-width: 80%;
  }
`;

const MessageContent = styled.span`
  background-color: #2c2c2c;
  padding: 5px 10px;
  border-radius: 10px;
`;

const ChatForm = styled.form`
  display: flex;
  margin-top: 10px;
`;

const ChatInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #2c2c2c;
  color: #e0e0e0;
`;

const SendButton = styled.button`
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  background-color: #4a90e2;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #3a7bc8;
  }
`;

// 새로운 연결 상태 표시 컴포넌트
const ConnectionStatus = styled.div<{ status: string }>`
  padding: 5px;
  text-align: center;
  font-size: 0.7rem;
  color: ${(props) => (props.status === 'connected' ? '#4caf50' : '#f44336')};
  background-color: ${(props) =>
    props.status === 'connected'
      ? 'rgba(76, 175, 80, 0.1)'
      : 'rgba(244, 67, 54, 0.1)'};
  border-radius: 4px;
  margin-bottom: 5px;
`;
