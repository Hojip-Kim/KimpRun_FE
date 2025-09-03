'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { palette } from '@/styles/palette';
import { useTheme } from '@/hooks/useTheme';
import { MdPalette, MdLightMode, MdDarkMode } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';

const Fab = styled.button`
  position: fixed;
  right: 16px; /* viewport 기준 */
  bottom: 144px; /* viewport 기준 - chat fab 위 */
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${palette.card};
  color: ${palette.textPrimary};
  border: 1px solid ${palette.border};
  box-shadow: ${palette.shadow};
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 1350;
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
    display: flex;
  }
`;

const Backdrop = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 1349;
  display: ${(p) => (p.$open ? 'block' : 'none')};
`;

const Panel = styled.div<{ $open: boolean }>`
  position: fixed;
  right: 16px; /* viewport 기준 FAB과 동일 위치 */
  bottom: 144px; /* viewport 기준 FAB과 동일 위치 */
  width: min(280px, calc(100vw - 32px));
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 12px;
  box-shadow: ${palette.shadow};
  display: ${(p) => (p.$open ? 'flex' : 'none')};
  flex-direction: column;
  overflow: hidden;
  z-index: 1351;
  transform: scale(0.95); /* 레이아웃과 일치하는 크기 */
  transform-origin: bottom right;
`;

const PanelHeader = styled.div`
  padding: 16px;
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
  color: ${palette.textPrimary};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${palette.input};
  }
`;

const PanelBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ThemeOption = styled.button<{ $active: boolean }>`
  padding: 12px 16px;
  border: 1px solid ${(p) => (p.$active ? palette.accent : palette.border)};
  border-radius: 8px;
  background: ${(p) => (p.$active ? `${palette.accent}20` : palette.card)};
  color: ${palette.textPrimary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${(p) => (p.$active ? `${palette.accent}30` : palette.input)};
  }
`;

const IconContainer = styled.div<{ $active: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => (p.$active ? palette.accent : palette.input)};
  color: ${(p) => (p.$active ? palette.bgPage : palette.textPrimary)};
`;

const MobileThemeFab: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { mode, toggleTheme } = useTheme();

  const handleThemeSelect = (selectedMode: 'light' | 'dark') => {
    if (mode !== selectedMode) {
      toggleTheme();
    }
    setOpen(false);
  };

  return (
    <>
      <Backdrop $open={open} onClick={() => setOpen(false)} />
      <Panel $open={open} role="dialog" aria-label="테마 선택">
        <PanelHeader>
          <span>테마 선택</span>
          <CloseBtn onClick={() => setOpen(false)} aria-label="닫기">
            <IoClose size={20} />
          </CloseBtn>
        </PanelHeader>
        <PanelBody>
          <ThemeOption
            $active={mode === 'light'}
            onClick={() => handleThemeSelect('light')}
          >
            <IconContainer $active={mode === 'light'}>
              <MdLightMode size={16} />
            </IconContainer>
            <span>라이트 모드</span>
          </ThemeOption>
          <ThemeOption
            $active={mode === 'dark'}
            onClick={() => handleThemeSelect('dark')}
          >
            <IconContainer $active={mode === 'dark'}>
              <MdDarkMode size={16} />
            </IconContainer>
            <span>다크 모드</span>
          </ThemeOption>
        </PanelBody>
      </Panel>
      <Fab aria-label="테마 설정 열기" onClick={() => setOpen(true)}>
        <MdPalette size={22} />
      </Fab>
    </>
  );
};

export default MobileThemeFab;
