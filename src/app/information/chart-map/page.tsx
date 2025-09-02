'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import InformationLayout from '../client/InformationLayout';
import InformationSubNav from '../client/InformationSubNav';
import ChartGrid from './components/ChartGrid';
import styled from 'styled-components';
import { palette } from '@/styles/palette';

const Container = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: ${palette.bgPage};
  color: ${palette.textPrimary};

  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
    margin-bottom: 80px;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${palette.accent};
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: ${palette.textSecondary};
  font-size: 0.95rem;
  margin: 0;
`;

const ChartSection = styled.div`
  background: ${palette.card};
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${palette.border};
  box-shadow: ${palette.shadow};

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export default function ChartMapPage() {
  const pathname = usePathname();

  return (
    <InformationLayout>
      <InformationSubNav currentPath={pathname} />
      <Container>
        <ChartSection>
          <ChartGrid />
        </ChartSection>
      </Container>
    </InformationLayout>
  );
}
