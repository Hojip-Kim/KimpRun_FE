import React from 'react';
import Link from 'next/link';
import { LayoutContainer, Header, HeaderContent, Logo, Nav, NavItem, MainContent } from './style';

interface CommunityLayoutProps {
  children: React.ReactNode;
}

const CommunityLayout: React.FC<CommunityLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header>
        <HeaderContent>
          <Logo>김프런 커뮤니티</Logo>
          <Nav>
            <NavItem>
              <Link href="/community/coin">코인</Link>
            </NavItem>
            <NavItem>
              <Link href="/community/stock">주식</Link>
            </NavItem>
            <NavItem>
              <Link href="/community/general">자유게시판</Link>
            </NavItem>
          </Nav>
        </HeaderContent>
      </Header>
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
};

export default CommunityLayout;
