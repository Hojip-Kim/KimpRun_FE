'use client';

import React from 'react';
import styled from 'styled-components';
import { palette } from '@/styles/palette';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: ${palette.bgPage};
`;

const MainContent = styled.main`
  flex: 1;
`;

interface InformationLayoutProps {
  children: React.ReactNode;
}

const InformationLayout: React.FC<InformationLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
};

export default InformationLayout;
