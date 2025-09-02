'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styled from 'styled-components';
import { palette } from '@/styles/palette';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { HiOutlineUserGroup, HiOutlineCurrencyDollar } from 'react-icons/hi';

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
  max-height: ${(p) => (p.$isOpen ? '200px' : '0')};
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

interface CommunitySubNavProps {
  currentPath: string;
}

const communityTabs = [
  {
    id: 'coin',
    label: '코인 게시판',
    path: '/community/coin/1',
    icon: <HiOutlineCurrencyDollar />,
  },
  {
    id: 'expert',
    label: '전문가 게시판',
    path: '/community/expert',
    icon: <HiOutlineUserGroup />,
  },
];

const CommunitySubNav: React.FC<CommunitySubNavProps> = ({ currentPath }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const getCurrentTab = () => {
    if (currentPath.includes('/community/expert')) return 'expert';
    if (currentPath.includes('/community/coin')) return 'coin';
    return 'coin'; // 기본값
  };

  const currentTab = getCurrentTab();
  const currentTabData =
    communityTabs.find((tab) => tab.id === currentTab) || communityTabs[0];

  const handleTabClick = (path: string) => {
    router.push(path);
    setIsDropdownOpen(false);
  };

  return (
    <SubNavContainer>
      <SubNavContent>
        {/* 데스크톱 탭 */}
        <DesktopTabs>
          {communityTabs.map((tab) => (
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
            {communityTabs.map((tab) => (
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

export default CommunitySubNav;
