'use client';

import styled from 'styled-components';
import { palette } from '@/styles/palette';

export const NavbarWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 110px;
  z-index: 1000;
  background: var(--card);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  transform: scale(0.9);
  transform-origin: top center;
  width: 111.11%; // scale(0.9)의 역보정
  margin-left: -5.56%; // 중앙 정렬

  @media (max-width: 1350px) {
    transform: scale(0.85);
    width: 117.65%; // scale(0.85)의 역보정
    margin-left: -8.825%;
  }

  @media (max-width: 1200px) {
    transform: scale(0.8);
    width: 125%; // scale(0.8)의 역보정
    margin-left: -12.5%;
  }

  @media (max-width: 992px) {
    transform: scale(0.75);
    width: 133.33%; // scale(0.75)의 역보정
    margin-left: -16.665%;
  }

  @media (max-width: 768px) {
    height: 56px;
    transform: scale(0.95);
    width: 105.26%; // scale(0.95)의 역보정
    margin-left: -2.63%;
  }
`;

export const TopSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  padding: 0 24px;

  @media (max-width: 768px) {
    height: 56px;
    padding: 0 16px;
  }
`;

export const BottomSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 24px;
  border-top: 1px solid var(--border);

  @media (max-width: 768px) {
    display: none;
  }
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

export const InfoBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  height: 36px;
  background: var(--bg-container);
  border-bottom: 1px solid var(--border);
  font-size: 0.8rem;
  color: var(--text-muted);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 1200px) {
    gap: 16px;
  }

  @media (max-width: 768px) {
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  transition: color 0.3s ease;
  white-space: nowrap;

  @media (max-width: 1200px) {
    font-size: 0.8rem;
    gap: 4px;
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;
    gap: 3px;
  }

  @media (max-width: 480px) {
    font-size: 0.65rem;
    gap: 2px;
  }
`;
export const TopInfoSection = styled.div`
  display: flex;
  align-items: center;
`;

export const LogoIcon = styled.img`
  width: 36px;
  height: 36px;
  object-fit: contain;
  aspect-ratio: 1;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
  }
`;

export const Icon = styled.img`
  width: 15px;
  height: 15px;
  object-fit: contain;

  @media (max-width: 768px) {
    width: 12px;
    height: 12px;
  }

  @media (max-width: 480px) {
    width: 10px;
    height: 10px;
  }
`;

export const UserWrapperContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

export const UserContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    display: none; /* 모바일에서는 사용자 정보 숨김 */
  }
`;

export const UserRole = styled.span<{ role?: string }>`
  color: ${(props) =>
    props.role === 'OPERATOR' || props.role === 'MANAGER'
      ? 'var(--accent)'
      : 'var(--text-muted)'};
  font-weight: ${(props) =>
    props.role === 'OPERATOR' || props.role === 'MANAGER' ? 'bold' : 'normal'};
  transition: color 0.3s ease;
`;

export const UserName = styled.span`
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
  transition: color 0.3s ease;
`;

export const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    gap: 6px;
  }

  @media (max-width: 480px) {
    gap: 4px;
  }
`;

export const DesktopThemeToggle = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const ActionButton = styled.button`
  background: var(--input);
  border: 1px solid var(--border);
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-primary);
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    color: var(--accent);
    background-color: var(--bg-container);
    border-color: var(--accent);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 0.75rem;
  }

  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 0.7rem;
  }
`;

export const Logo = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const NavMenu = styled.ul`
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
  gap: 20px;
  align-items: center;
  height: 100%;

  @media (max-width: 992px) {
    gap: 16px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const CloseButton = styled.button`
  background: ${palette.input};
  border: 1px solid ${palette.border};
  padding: 5px 10px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 8px;
  font-size: 0.8rem;
  color: ${palette.textPrimary};

  &:hover {
    color: ${palette.accent};
    background-color: ${palette.input};
  }
`;

export const SubMenu = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--card);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  margin-top: 8px;
  z-index: 1001;
  min-width: 180px;
  border-radius: 12px;
  border: 1px solid var(--border);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  list-style: none;
  padding: 8px 0;
  margin: 0;
  backdrop-filter: blur(8px);

  &:hover {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

export const TradingViewOverviewContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: none;
  height: 70px;
  margin: 0 20px;
  overflow: visible;

  @media (max-width: 1200px) {
    margin: 0 16px;
  }

  @media (max-width: 992px) {
    display: none;
  }
`;

export const SubMenuItem = styled.li`
  padding: 12px 20px;
  cursor: pointer;
  white-space: nowrap;
  text-align: left;
  color: var(--text-primary);
  font-size: 0.85rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--bg-container);
    color: var(--accent);
    transform: translateX(4px);
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

export const NavMenuItem = styled.li`
  position: relative;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
  border-radius: 6px;
  transition: all 0.3s ease;
  white-space: nowrap;
  height: 100%;
  display: flex;
  align-items: center;

  &:hover {
    color: var(--accent);
    background: var(--bg-container);

    ${SubMenu} {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
  }

  @media (max-width: 992px) {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
`;

export const NavMenuLink = styled.span`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
`;
