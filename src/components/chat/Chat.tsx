'use client';

import React, { useEffect, useRef, useState } from 'react';
import './Chat.css';
import { useSelector } from 'react-redux';
import { ChatMessage } from '@/types';
import { RootState } from '@/redux/store';
import { fetchPreviousMessages } from './server/fetchPreviousMessages';
import { Icon } from '../nav/client/styled';
import styled from 'styled-components';

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [page, setPage] = useState<number>(0);
  const [chatId, setChatId] = useState<string>('');

  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const websocketUrl = process.env.NEXT_PUBLIC_CHAT_WEBSOCKET_URL;

  const user = useSelector((state: RootState) => state.auth.user);

  const fetchPreviousMessage = async () => {
    try {
      if (chatBoxRef.current) {
        const scrollContainer = chatBoxRef.current;
        const prevScrollHeight = scrollContainer.scrollHeight;
        const prevScrollTop = scrollContainer.scrollTop;

        const parsedData = await fetchPreviousMessages(page, 30);
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
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = () => {
    if (input.trim() && ws?.readyState === WebSocket.OPEN) {
      const message: ChatMessage = {
        chatID: chatId,
        content: input,
        authenticated: user.role === 'GUEST' ? 'false' : 'true',
      };

      ws.send(JSON.stringify(message));
      setInput('');
    } else {
      console.error('메시지 전송 오류: 웹소켓이 연결되지 않았습니다.');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    setChatId(user?.name);

    fetchPreviousMessage();

    const websocket = new WebSocket(websocketUrl);

    websocket.onopen = () => {
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      const parsedData: ChatMessage = JSON.parse(event.data);
      if (parsedData) {
        setMessages((prev) => [...prev, parsedData]);
      }
    };

    websocket.onerror = (error) => {
      console.error('채팅 웹소켓 오류: ', error);
      websocket.close();
    };

    return () => {
      websocket.close();
    };
  }, [user]);

  return (
    <div>
      <ChatContainer>
        <ChatBox ref={chatBoxRef}>
          <FetchButton onClick={fetchPreviousMessage}>
            이전 메세지 불러오기
          </FetchButton>
          {messages.map((data, index) => (
            <MessageContainer
              key={index}
              authenticated={data.authenticated}
              isSelf={data.chatID === user?.name}
            >
              <div>
                <MessageContent>
                  {data.chatID === user?.name ? '' : data.chatID + ':'}{' '}
                  {data.content}
                </MessageContent>
                {data.authenticated === 'true' &&
                  data.chatID !== user?.name && (
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
    </div>
  );
};

export default Chat;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  color: #e0e0e0;
  max-height: 700px;
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
