'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { palette } from '@/styles/palette';
import Chat from './Chat';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';

const Fab = styled.button<{ $isMainPage: boolean }>`
  position: fixed;
  right: 16px; /* viewport 기준 */
  bottom: 16px; /* viewport 기준 */
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${palette.card};
  color: ${palette.textPrimary};
  border: 1px solid ${palette.border};
  box-shadow: ${palette.shadow};
  display: ${({ $isMainPage }) =>
    $isMainPage ? 'none' : 'flex'}; /* 메인페이지에서만 숨김 */
  align-items: center;
  justify-content: center;
  z-index: 1300;
  transition: all 0.2s ease;
  transform: scale(0.95); /* 레이아웃과 일치하는 크기 */
  transform-origin: center center;

  &:hover {
    transform: scale(1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.9);
  }

  @media (max-width: 768px) {
    display: none; /* 모바일에서는 숨김 */
  }
`;

const Backdrop = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(2px);
  z-index: 1299;
  display: ${(p) => (p.$open ? 'block' : 'none')};
`;

const Panel = styled.div<{ $open: boolean }>`
  position: fixed;
  right: 16px; /* viewport 기준 FAB과 동일 위치 */
  bottom: 80px; /* viewport 기준 FAB 위 */
  width: min(400px, calc(100vw - 32px));
  height: min(600px, calc(100vh - 120px));
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: ${(p) => (p.$open ? 'flex' : 'none')};
  flex-direction: column;
  overflow: hidden;
  z-index: 1301;
  transform: scale(0.95); /* 레이아웃과 일치하는 크기 */
  transform-origin: bottom right;

  @media (max-width: 768px) {
    display: none; /* 모바일에서는 완전히 숨김 */
  }
`;

const PanelHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${palette.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${palette.textPrimary};
  font-weight: 600;
`;

const CloseBtn = styled.button`
  border: 0;
  background: transparent;
  color: ${palette.textSecondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${palette.bgPage};
    color: ${palette.textPrimary};
  }
`;

const PanelBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 8px;
`;

const DesktopChatFab: React.FC = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  return (
    <>
      <Backdrop $open={open} onClick={() => setOpen(false)} />
      <Panel $open={open} role="dialog" aria-label="채팅">
        <PanelHeader>
          <span>채팅</span>
          <CloseBtn onClick={() => setOpen(false)}>닫기</CloseBtn>
        </PanelHeader>
        <PanelBody>{open && <Chat />}</PanelBody>
      </Panel>
      <Fab
        $isMainPage={isMainPage}
        aria-label="채팅 열기"
        onClick={() => setOpen(true)}
      >
        <IoChatbubbleEllipsesOutline size={24} />
      </Fab>
    </>
  );
};

export default DesktopChatFab;
