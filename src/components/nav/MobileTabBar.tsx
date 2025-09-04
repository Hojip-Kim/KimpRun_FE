'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styled from 'styled-components';
import { palette } from '@/styles/palette';
import { clientEnv } from '@/utils/env';
import { FiHome, MdOutlineForum, LuBarChart3, IoNewspaperOutline } from '@/components/icons';

const Bar = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60px;
  background: ${palette.card};
  border-top: 1px solid ${palette.border};
  box-shadow: ${palette.shadow};
  display: none;
  z-index: 1100;
  transform: scale(0.95);
  transform-origin: bottom center;
  width: 105.26%; // scale(0.95)의 역보정
  margin-left: -2.63%; // 중앙 정렬

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Tabs = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 8px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
`;

const Tab = styled.li<{ $active?: boolean }>`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: ${(p) => (p.$active ? palette.accent : palette.textPrimary)};
  font-size: 11px;
`;

const Button = styled.button`
  appearance: none;
  background: transparent;
  border: 0;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 100%;
`;

const MobileTabBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname() || '';

  const tabs = [
    {
      label: '메인',
      path: clientEnv.MAIN_PAGE ?? '/',
      icon: <FiHome size={18} />,
    },
    {
      label: '커뮤니티',
      path: clientEnv.COMMUNITY_PAGE ?? '/community',
      icon: <MdOutlineForum size={19} />,
    },
    {
      label: '정보',
      path: clientEnv.INFORMATION_PAGE ?? '/information',
      icon: <LuBarChart3 size={18} />,
    },
    {
      label: '뉴스',
      path: clientEnv.NEWS_PAGE ?? '/news',
      icon: <IoNewspaperOutline size={18} />,
    },
  ];

  const isActive = (path: string) => {
    try {
      if (!path) return false;
      // consider startsWith for nested routes under each section
      return pathname === path || pathname.startsWith(path);
    } catch {
      return false;
    }
  };

  return (
    <Bar aria-label="모바일 하단 탭바">
      <Tabs>
        {tabs.map((t) => (
          <Tab key={t.label} $active={isActive(t.path)}>
            <Button onClick={() => router.push(t.path)} aria-label={t.label}>
              {t.icon}
              <span>{t.label}</span>
            </Button>
          </Tab>
        ))}
      </Tabs>
    </Bar>
  );
};

export default MobileTabBar;
