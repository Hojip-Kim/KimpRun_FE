import React from 'react';
import Link from 'next/link';
import {
  LayoutContainer,
  Header,
  HeaderContent,
  Logo,
  Nav,
  NavItem,
  MainContent,
} from './style';

interface CommunityLayoutProps {
  children: React.ReactNode;
}

const CommunityLayout: React.FC<CommunityLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
};

export default CommunityLayout;
