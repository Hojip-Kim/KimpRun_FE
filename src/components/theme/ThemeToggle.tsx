'use client';

import React from 'react';
import styled from 'styled-components';

import { useTheme } from '@/hooks/useTheme';

const ToggleButton = styled.button<{ $isDark: boolean }>`
  position: relative;
  width: 52px;
  height: 26px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${(props) =>
    props.$isDark
      ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
      : 'linear-gradient(135deg, #87ceeb 0%, #4682b4 100%)'};
  box-shadow: ${(props) =>
    props.$isDark
      ? 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)'
      : 'inset 0 2px 4px rgba(255, 255, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 44px;
    height: 22px;
    border-radius: 16px;
    padding: 2px;
  }

  &:hover {
    transform: translateY(-1px) scale(1.02);
    box-shadow: ${(props) =>
      props.$isDark
        ? 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.4)'
        : 'inset 0 2px 4px rgba(255, 255, 255, 0.2), 0 4px 16px rgba(0, 0, 0, 0.2)'};
  }

  &:active {
    transform: translateY(0) scale(0.98);
    transition: all 0.1s ease;
  }

  /* Background animation on theme change */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px;
    background: ${(props) =>
      props.$isDark
        ? 'linear-gradient(135deg, #87ceeb 0%, #4682b4 100%)'
        : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'};
    opacity: 0;
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  }

  &:hover::before {
    opacity: 0.1;
  }
`;

const ToggleCircle = styled.div<{ $isDark: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${(props) =>
    props.$isDark
      ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)'};
  box-shadow: ${(props) =>
    props.$isDark
      ? '0 2px 6px rgba(255, 215, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
      : '0 2px 6px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.8)'};
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: ${(props) =>
    props.$isDark
      ? 'translateX(0) rotate(0deg)'
      : 'translateX(26px) rotate(180deg)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
    font-size: 9px;
    transform: ${(props) =>
      props.$isDark
        ? 'translateX(0) rotate(0deg)'
        : 'translateX(22px) rotate(180deg)'};
  }

  /* Icon animation */
  &::before {
    content: '${(props) => (props.$isDark ? '🌙' : '☀️')}';
    position: absolute;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: ${(props) =>
      props.$isDark ? 'scale(1) rotate(0deg)' : 'scale(1) rotate(-180deg)'};
    opacity: 1;
  }

  /* Add glowing effect */
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: ${(props) =>
      props.$isDark
        ? 'radial-gradient(circle, rgba(255, 215, 0, 0.3), transparent 70%)'
        : 'radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent 70%)'};
    opacity: ${(props) => (props.$isDark ? 1 : 0)};
    transition: opacity 0.4s ease;
    z-index: -1;
  }
`;

const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme: handleToggle } = useTheme();
  const isDark = mode === 'dark';

  return (
    <ToggleButton
      $isDark={isDark}
      onClick={handleToggle}
      title={`${isDark ? '라이트' : '다크'} 모드로 전환`}
    >
      <ToggleCircle $isDark={isDark} />
    </ToggleButton>
  );
};

export default ThemeToggle;
