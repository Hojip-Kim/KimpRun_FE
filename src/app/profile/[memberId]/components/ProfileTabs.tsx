import React from 'react';
import { ProfileTab } from '@/types/profile';
import { TabContainer, TabList, TabButton } from '../styles';

interface ProfileTabsProps {
  currentTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  isLoading: boolean;
  isOwnProfile: boolean;
}

export default function ProfileTabs({
  currentTab,
  onTabChange,
  isLoading,
  isOwnProfile,
}: ProfileTabsProps) {
  const tabs: { key: ProfileTab; label: string }[] = [
    { key: 'posts', label: '게시물' },
    ...(isOwnProfile ? [{ key: 'comments' as ProfileTab, label: '댓글' }] : []),
    { key: 'followers', label: '팔로워' },
    { key: 'following', label: '팔로잉' },
  ];

  return (
    <TabContainer>
      <TabList>
        {tabs.map((tab) => (
          <TabButton
            key={tab.key}
            $active={currentTab === tab.key}
            onClick={() => onTabChange(tab.key)}
            disabled={isLoading}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabList>
    </TabContainer>
  );
}
