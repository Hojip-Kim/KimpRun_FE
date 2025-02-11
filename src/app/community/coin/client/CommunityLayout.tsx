import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

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

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e;
  color: #e0e0e0;
`;

const Header = styled.header`
  background-color: #2c2c2c;
  color: #e0e0e0;
  padding: 1rem 0;
  border-bottom: 1px solid #444;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  color: #ffd700;
`;

const Nav = styled.nav`
  display: flex;
`;

const NavItem = styled.div`
  margin-left: 1.5rem;

  a {
    color: #e0e0e0;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #ffd700;
    }
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem 1rem;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
`;
export default CommunityLayout;
