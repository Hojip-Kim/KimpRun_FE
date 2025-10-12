'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styled from 'styled-components';
import { palette } from '@/styles/palette';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import {
  HiOutlineTrendingUp,
  HiOutlineOfficeBuilding,
  HiOutlineMap,
  HiOutlineChartBar,
} from 'react-icons/hi';

const SubNavContainer = styled.div`
  background: ${palette.card};
  border-bottom: 1px solid ${palette.border};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const SubNavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0 0.75rem;
  }
`;

// 데스크톱 탭
const DesktopTabs = styled.div`
  display: flex;

  @media (max-width: 768px) {
    display: none;
  }
`;

const DesktopTab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  color: ${(p) => (p.$active ? palette.accent : palette.textSecondary)};
  font-size: 0.95rem;
  font-weight: ${(p) => (p.$active ? '600' : '400')};
  cursor: pointer;
  border-bottom: 2px solid
    ${(p) => (p.$active ? palette.accent : 'transparent')};
  transition: all 0.2s ease;

  &:hover {
    color: ${palette.accent};
    background: ${palette.accentRing};
  }

  svg {
    font-size: 1.125rem;
  }
`;

// 모바일 드롭다운
const MobileDropdown = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const DropdownTrigger = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem;
  background: transparent;
  border: none;
  color: ${palette.textPrimary};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  svg {
    font-size: 1.25rem;
    transition: transform 0.2s ease;
    transform: ${(p) => (p.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${palette.card};
  border-bottom: 1px solid ${palette.border};
  box-shadow: ${palette.shadow};
  z-index: 1000;
  overflow: hidden;
  transition: all 0.2s ease;
  max-height: ${(p) => (p.$isOpen ? '300px' : '0')};
  opacity: ${(p) => (p.$isOpen ? '1' : '0')};
`;

const DropdownItem = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem 1.5rem;
  background: ${(p) => (p.$active ? palette.accentRing : 'transparent')};
  border: none;
  color: ${(p) => (p.$active ? palette.accent : palette.textPrimary)};
  font-size: 0.95rem;
  font-weight: ${(p) => (p.$active ? '600' : '400')};
  cursor: pointer;
  border-bottom: 1px solid ${palette.borderSoft};

  &:hover {
    background: ${palette.accentRing};
    color: ${palette.accent};
  }

  &:last-child {
    border-bottom: none;
  }

  svg {
    font-size: 1.125rem;
  }
`;

const CurrentTabText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    font-size: 1.125rem;
  }
`;

interface InformationSubNavProps {
  currentPath: string;
}

const informationTabs = [
  {
    id: 'coin-ranking',
    label: '코인 순위',
    path: '/information/coin-ranking?page=1&size=100',
    icon: <HiOutlineTrendingUp />,
  },
  {
    id: 'exchange-ranking',
    label: '거래소 순위',
    path: '/information/exchange-ranking?page=1&size=100',
    icon: <HiOutlineOfficeBuilding />,
  },
  {
    id: 'crypto-heatmap',
    label: '코인 히트맵',
    path: '/information/crypto-heatmap',
    icon: <HiOutlineMap />,
  },
  {
    id: 'chart-map',
    label: '차트 맵',
    path: '/information/chart-map',
    icon: <HiOutlineChartBar />,
  },
];

const InformationSubNav: React.FC<InformationSubNavProps> = ({
  currentPath,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const getCurrentTab = () => {
    if (currentPath.includes('/information/coin-ranking'))
      return 'coin-ranking';
    if (currentPath.includes('/information/exchange-ranking'))
      return 'exchange-ranking';
    if (currentPath.includes('/information/crypto-heatmap'))
      return 'crypto-heatmap';
    if (currentPath.includes('/information/chart-map')) return 'chart-map';
    return 'coin-ranking'; // 기본값
  };

  const currentTab = getCurrentTab();
  const currentTabData =
    informationTabs.find((tab) => tab.id === currentTab) || informationTabs[0];

  const handleTabClick = (path: string) => {
    router.push(path);
    setIsDropdownOpen(false);
  };

  return (
    <SubNavContainer>
      <SubNavContent>
        {/* 데스크톱 탭 */}
        <DesktopTabs>
          {informationTabs.map((tab) => (
            <DesktopTab
              key={tab.id}
              $active={currentTab === tab.id}
              onClick={() => handleTabClick(tab.path)}
            >
              {tab.icon}
              {tab.label}
            </DesktopTab>
          ))}
        </DesktopTabs>

        {/* 모바일 드롭다운 */}
        <MobileDropdown>
          <DropdownTrigger
            $isOpen={isDropdownOpen}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <CurrentTabText>
              {currentTabData.icon}
              {currentTabData.label}
            </CurrentTabText>
            <MdOutlineKeyboardArrowDown />
          </DropdownTrigger>

          <DropdownMenu $isOpen={isDropdownOpen}>
            {informationTabs.map((tab) => (
              <DropdownItem
                key={tab.id}
                $active={currentTab === tab.id}
                onClick={() => handleTabClick(tab.path)}
              >
                {tab.icon}
                {tab.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </MobileDropdown>
      </SubNavContent>
    </SubNavContainer>
  );
};

export default InformationSubNav;
