'use client';

import React, { useEffect, useRef, useState } from 'react';
import './Chat.css';
import serverFetch from '@/server/fetch/server';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

// const type Message = {

// }

interface ChatMessage {
  chatID: string;
  content: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [page, setPage] = useState<number>(0);

  const [isFetching, setIsFetching] = useState<boolean>(false);

  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const websocketUrl = process.env.NEXT_PUBLIC_CHAT_WEBSOCKET_URL;
  const getChatLogUrl = process.env.NEXT_PUBLIC_CHAT_LOG_URL;

  const requestInit: RequestInit = {
    method: 'GET',
    headers: { 'Content-type': 'application/json' },
  };

  const user = useSelector((state: RootState) => state.auth.user);

  const fetchPreviousMessage = async () => {
    try {
      if (chatBoxRef.current) {
        const prev = chatBoxRef.current.scrollHeight;
        const data = await serverFetch(
          `${getChatLogUrl}?page=${page}&size=30`,
          requestInit
        );

        if (data.ok) {
          const text: string = data.text;
          const parsedData: ChatMessage[] = JSON.parse(text);
          setMessages((prev) => [...parsedData, ...prev]);
          setPage((prev) => prev + 1);

          setTimeout(() => {
            if (chatBoxRef.current) {
              const newScrollHeight = chatBoxRef.current.scrollHeight;
              chatBoxRef.current.scrollTop =
                newScrollHeight - prev + chatBoxRef.current.scrollTop;
            }
          }, 500);
        } else {
          throw new Error('data fetching error occurred');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  type ChatMessage = {
    chatID: string;
    content: string;
  };

  const handleSendMessage = () => {
    if (input.trim() && ws?.readyState === WebSocket.OPEN) {
      const userNickname = user.name;
      const message: ChatMessage = { chatID: userNickname, content: input };

      ws.send(JSON.stringify(message));
      setInput('');
    } else {
      console.error('message send error');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleScroll = () => {};

  useEffect(() => {
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
      console.error('Chatting Websocket Error : ', error);
      websocket.close();
    };

    return () => websocket.close();
  }, []);

  useEffect(() => {
    if (page === 1) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, page]);

  return (
    <div>
      <div className="chat-container">
        <div className="chat-box" ref={chatBoxRef} onScroll={handleScroll}>
          <div
            className="fetch-button"
            onClick={() => {
              fetchPreviousMessage();
            }}
          >
            이전 메세지 불러오기
          </div>
          {messages.map((data, index) => (
            <div key={index}>
              {data.chatID} : {data.content}
            </div>
          ))}
          <div ref={messageEndRef}></div>
        </div>
      </div>
      <div className="chat-typing-box">
        <input
          type="text"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          onKeyDown={handleKeyDown}
          placeholder="채팅 메시지를 입력하세요."
        ></input>
        <button
          onClick={() => {
            handleSendMessage();
          }}
          style={{ color: 'white' }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
