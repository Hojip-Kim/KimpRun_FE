'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { palette } from '@/styles/palette';

const ScrollFabContainer = styled.div`
  position: fixed;
  left: 1rem; /* viewport 기준 */
  bottom: 6rem; /* viewport 기준 - 하단 네비게이션 위 */
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transform: scale(0.95); /* 레이아웃과 일치하는 크기 */
  transform-origin: bottom left;

  @media (min-width: 769px) {
    display: none; /* 데스크톱에서는 숨김 */
  }
`;

const FabButton = styled.button<{ $visible: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: ${palette.accent};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) =>
    $visible ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)'};
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
  backdrop-filter: blur(10px);

  &:hover {
    background: ${palette.accent};
    transform: ${({ $visible }) =>
      $visible
        ? 'scale(1.05) translateY(-2px)'
        : 'scale(0.8) translateY(20px)'};
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: ${({ $visible }) =>
      $visible ? 'scale(0.95) translateY(0)' : 'scale(0.8) translateY(20px)'};
    transition-duration: 0.1s;
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateY(-1px);
  }
`;

const ScrollFab: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollBottom = scrollHeight - scrollTop - clientHeight;

      // 맨 위로 가기 버튼: 200px 이상 스크롤했을 때 표시
      setShowScrollTop(scrollTop > 200);

      // 맨 아래로 가기 버튼: 아래쪽에 200px 이상 남았을 때 표시
      setShowScrollBottom(scrollBottom > 200);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 상태 설정

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <ScrollFabContainer>
      <FabButton
        $visible={showScrollTop}
        onClick={scrollToTop}
        aria-label="맨 위로 이동"
        title="맨 위로"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
        </svg>
      </FabButton>
      <FabButton
        $visible={showScrollBottom}
        onClick={scrollToBottom}
        aria-label="맨 아래로 이동"
        title="맨 아래로"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
        </svg>
      </FabButton>
    </ScrollFabContainer>
  );
};

export default ScrollFab;
