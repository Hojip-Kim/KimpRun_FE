"use client";

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { palette } from '@/styles/palette';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const SkeletonBase = styled.div<{
  $height?: number;
  $width?: string;
  $radius?: number;
}>`
  display: block;
  height: ${(p) => (p.$height ? `${p.$height}px` : '12px')};
  width: ${(p) => p.$width || '100%'};
  border-radius: ${(p) => (p.$radius !== undefined ? `${p.$radius}px` : '8px')};
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.06) 25%,
    rgba(255, 255, 255, 0.12) 37%,
    rgba(255, 255, 255, 0.06) 63%
  );
  background-size: 400% 100%;
  animation: ${shimmer} 1.3s ease-in-out infinite;
`;

const Card = styled.div`
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 12px;
  box-shadow: ${palette.shadow};
`;

// Market selector skeleton
const SelectorContainer = styled(Card)`
  display: grid;
  grid-template-columns: repeat(2, minmax(200px, 1fr));
  gap: 16px;
  padding: 14px;
  margin-bottom: 12px;

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 10px;
  }
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    gap: 8px;
    padding: 8px;
  }
`;

const SelectorGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const MarketSelectorSkeleton: React.FC = () => (
  <SelectorContainer>
    {[0, 1].map((i) => (
      <SelectorGroup key={i}>
        <SkeletonBase $width="80px" $height={10} $radius={6} />
        <SkeletonBase $height={36} $radius={10} />
      </SelectorGroup>
    ))}
  </SelectorContainer>
);

// Search skeleton
const SearchWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 5px;
`;
const SearchTop = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
`;
const SearchBottom = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 6px;
  }
`;

export const SearchSkeleton: React.FC = () => (
  <SearchWrap>
    <SearchTop>
      <SkeletonBase $width="100px" $height={36} $radius={10} />
      <SkeletonBase $width="120px" $height={36} $radius={10} />
    </SearchTop>
    <SearchBottom>
      <SkeletonBase $width="100%" $height={36} $radius={10} />
      <SkeletonBase $width="120px" $height={36} $radius={10} />
    </SearchBottom>
  </SearchWrap>
);

// Table skeleton (aligned to TableWrapper/Row)
const TableShell = styled(Card)`
  width: 100%;
  border-radius: 12px;
  padding: 0;
  overflow: hidden;
  margin: 0 20px 0 0; /* match TableWrapper spacing */
`;
const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  padding: 6px 8px;
  border-bottom: 1px solid ${palette.border};
  @media (max-width: 768px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;
const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 10 }) => (
  <TableShell>
    <HeaderRow>
      {Array.from({ length: 7 }).map((_, i) => (
        <SkeletonBase key={i} $height={12} $radius={6} />
      ))}
    </HeaderRow>
    <Rows>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ padding: '0 8px', borderBottom: `1px solid ${palette.border}` }}>
          <SkeletonBase $height={32} $radius={6} />
        </div>
      ))}
    </Rows>
  </TableShell>
);

// Chart skeleton (mobile small area or desktop left card can reuse)
export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 200 }) => (
  <Card style={{ overflow: 'hidden', borderRadius: 10 }}>
    <SkeletonBase $height={height} $radius={10} />
  </Card>
);

export const PageSkeleton: React.FC = () => (
  <div>
    <MarketSelectorSkeleton />
    <div style={{ margin: '8px 0 12px' }}>
      <ChartSkeleton height={200} />
    </div>
    <SearchSkeleton />
    <TableSkeleton rows={12} />
  </div>
);

export default SkeletonBase;

// ===== Notice skeleton =====
const NoticeCard = styled(Card)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const NoticeHeader = styled.div`
  padding: 15px 20px;
  background: ${palette.input};
  border-bottom: 1px solid ${palette.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const NoticeList = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
export const NoticeSkeleton: React.FC<{ items?: number }> = ({ items = 6 }) => (
  <NoticeCard>
    <NoticeHeader>
      <SkeletonBase $width="100px" $height={16} $radius={6} />
      <SkeletonBase $width="140px" $height={36} $radius={10} />
    </NoticeHeader>
    <NoticeList>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <SkeletonBase $width="80px" $height={18} $radius={6} />
            <SkeletonBase $width="60px" $height={12} $radius={6} />
          </div>
          <SkeletonBase $width="100%" $height={14} $radius={8} />
          <SkeletonBase $width="72px" $height={12} $radius={6} />
        </div>
      ))}
    </NoticeList>
  </NoticeCard>
);

// ===== Chat skeleton =====
const ChatWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const ChatStatus = styled.div`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${palette.border};
  margin-bottom: 8px;
`;
const ChatArea = styled(Card)`
  padding: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const ChatFooter = styled.div`
  display: flex;
  margin-top: 10px;
  gap: 8px;
`;
export const ChatSkeleton: React.FC = () => (
  <ChatWrap>
    <ChatStatus>
      <SkeletonBase $width="140px" $height={14} $radius={6} />
    </ChatStatus>
    <ChatArea>
      <SkeletonBase $width="140px" $height={12} $radius={6} />
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{ display: 'flex', justifyContent: i % 2 ? 'flex-end' : 'flex-start' }}
        >
          <SkeletonBase $width={i % 2 ? '60%' : '70%'} $height={24} $radius={12} />
        </div>
      ))}
    </ChatArea>
    <ChatFooter>
      <SkeletonBase $width="100%" $height={40} $radius={12} />
      <SkeletonBase $width="80px" $height={40} $radius={12} />
    </ChatFooter>
  </ChatWrap>
);
