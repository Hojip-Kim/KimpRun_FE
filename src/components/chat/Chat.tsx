'use client';

import React, { useEffect, useRef, useState } from 'react';
import './Chat.css';
import { useSelector } from 'react-redux';
import { ChatMessage } from '@/types';
import { RootState } from '@/redux/store';
import { fetchPreviousMessages } from './server/fetchPreviousMessages';
import { Icon } from '../nav/client/styled';

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [page, setPage] = useState<number>(0);
  const [chatId, setChatId] = useState<string>('');

  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const websocketUrl = process.env.NEXT_PUBLIC_CHAT_WEBSOCKET_URL;

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
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
      console.log(message);

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

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const tempId = user.name;

    setChatId(tempId);

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

    return () => websocket.close();
  }, [user]);

  useEffect(() => {
    if (page > 0) {
      scrollToBottom();
    }
  }, [messages, page]);

  return (
    <div>
      <div className="chat-container">
        <div className="chat-box" ref={chatBoxRef}>
          <div
            className="fetch-button"
            onClick={() => {
              fetchPreviousMessage();
            }}
          >
            이전 메세지 불러오기
          </div>
          {messages.map((data, index) => (
            <div
              key={index}
              style={{
                color: data.authenticated === 'true' ? 'black' : 'white',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {data.authenticated === 'true' && (
                <Icon
                  src="/bitcoin.png"
                  alt="medal"
                  style={{ marginRight: '5px' }}
                />
              )}
              {data.chatID} : {data.content}
            </div>
          ))}
          <div ref={messageEndRef}></div>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <div className="chat-typing-box">
          <input
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
          <button type="submit" style={{ color: 'black' }}>
            전송
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
