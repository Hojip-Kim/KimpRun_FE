'use client';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter, usePathname } from 'next/navigation';
import { useGlobalAlert } from '@/providers/AlertProvider';
import Link from 'next/link';
import styled from 'styled-components';
import { palette } from '@/styles/palette';

const AdminLayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${palette.bgPage};
`;

const Sidebar = styled.aside`
  width: 250px;
  background: ${palette.card};
  border-right: 1px solid ${palette.border};
  padding: 2rem 0;
  position: fixed;
  height: 100vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    position: relative;
    height: auto;
  }
`;

const SidebarTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${palette.accent};
  margin: 0 1.5rem 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${palette.border};
`;

const NavSection = styled.div`
  margin-bottom: 2rem;
`;

const NavSectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${palette.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 1.5rem 0.75rem;
  padding: 0;
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  display: block;
  padding: 0.75rem 1.5rem;
  color: ${(props) => (props.$active ? palette.accent : palette.textSecondary)};
  text-decoration: none;
  font-weight: ${(props) => (props.$active ? '600' : '500')};
  background: ${(props) => (props.$active ? palette.accentRing : 'transparent')};
  border-left: 3px solid ${(props) => (props.$active ? palette.accent : 'transparent')};
  transition: all 0.2s ease;

  &:hover {
    background: ${palette.accentRing};
    color: ${palette.accent};
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 250px;
  padding: 2rem;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

const AdminLayoutClient: React.FC<AdminLayoutClientProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { showWarning } = useGlobalAlert();
  const user = useSelector((state: RootState) => state.auth.user);

  // Check user authorization
  useEffect(() => {
    const userRole = user?.role;
    if (userRole !== 'ROLE_OPERATOR' && userRole !== 'ROLE_MANAGER') {
      showWarning('관리자 권한이 필요합니다');
      router.push('/');
    }
  }, [user, router, showWarning]);

  return (
    <AdminLayoutContainer>
      <Sidebar>
        <SidebarTitle>⚙️ 관리자</SidebarTitle>

        <NavSection>
          <NavSectionTitle>일반</NavSectionTitle>
          <NavLink href="/admin/categories" $active={pathname === '/admin/categories'}>
            📁 카테고리 관리
          </NavLink>
        </NavSection>

        <NavSection>
          <NavSectionTitle>커뮤니티</NavSectionTitle>
          <NavLink href="/admin/community/boards" $active={pathname === '/admin/community/boards'}>
            📝 게시물 관리
          </NavLink>
          <NavLink href="/admin/community/comments" $active={pathname === '/admin/community/comments'}>
            💬 댓글 관리
          </NavLink>
          <NavLink href="/admin/community/experts" $active={pathname === '/admin/community/experts'}>
            ⭐ 전문가 관리
          </NavLink>
        </NavSection>

        <NavSection>
          <NavSectionTitle>사용자</NavSectionTitle>
          <NavLink href="/admin/users/auth" $active={pathname === '/admin/users/auth'}>
            🔐 인증 관리
          </NavLink>
          <NavLink href="/admin/users/roles" $active={pathname === '/admin/users/roles'}>
            👤 권한 관리
          </NavLink>
          <NavLink href="/admin/users/declarations" $active={pathname === '/admin/users/declarations'}>
            🚨 신고 관리
          </NavLink>
        </NavSection>
      </Sidebar>

      <MainContent>{children}</MainContent>
    </AdminLayoutContainer>
  );
};

export default AdminLayoutClient;
