'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { useGlobalAlert } from '@/providers/AlertProvider';
import { Category, AdminTab, ADMIN_TABS } from '../types';
import BatchManagement from './BatchManagement';
import CategoryManagement from './CategoryManagement';
import Dashboard from './Dashboard';
import ChatManagement from './ChatManagement';
import UserManagement from './UserManagement';
import BoardManagement from './BoardManagement';
import {
  AdminContainer,
  AdminHeader,
  AdminTitle,
  AdminSubtitle,
  TabNav,
  TabButton,
  Card,
} from './style';

interface AdminPageProps {
  initialCategories: Category[];
}

const AdminPageClient = ({ initialCategories }: AdminPageProps) => {
  const router = useRouter();
  const { showWarning } = useGlobalAlert();
  const user = useSelector((state: RootState) => state.auth.user);

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Check user authorization
  useEffect(() => {
    const userRole = user?.role;
    if (userRole !== 'ROLE_OPERATOR' && userRole !== 'ROLE_MANAGER') {
      showWarning('관리자 권한이 필요합니다');
      router.push('/');
    }
  }, [user, router, showWarning]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;

      case 'batch':
        return <BatchManagement />;

      case 'chat':
        return <ChatManagement />;

      case 'auth':
        return <UserManagement />;

      case 'community':
        return <BoardManagement />;

      case 'category':
        return (
          <CategoryManagement
            initialCategories={categories}
          />
        );

      default:
        return null;
    }
  };

  // Get current tab info
  const currentTabInfo = ADMIN_TABS.find((tab) => tab.id === activeTab);

  return (
    <AdminContainer>
      <AdminHeader>
        <AdminTitle>⚙️ 관리자 페이지</AdminTitle>
        <AdminSubtitle>
          {currentTabInfo
            ? `${currentTabInfo.icon} ${currentTabInfo.description}`
            : '시스템 관리'}
        </AdminSubtitle>
      </AdminHeader>

      <TabNav>
        {ADMIN_TABS.map((tab) => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </TabButton>
        ))}
      </TabNav>

      {renderTabContent()}
    </AdminContainer>
  );
};

export default AdminPageClient;
