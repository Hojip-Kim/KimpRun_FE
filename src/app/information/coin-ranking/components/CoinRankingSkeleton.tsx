'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { palette } from '@/styles/palette';

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    ${palette.card} 25%,
    ${palette.bgContainer} 50%,
    ${palette.card} 75%
  );
  background-size: 400% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  border-radius: 6px;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.5rem;
  }
`;

const StatCard = styled.div`
  background: ${palette.card};
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid ${palette.border};
  text-align: center;

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

const StatLabel = styled(SkeletonBase)`
  height: 12px;
  width: 60%;
  margin: 0 auto 0.375rem auto;
`;

const StatValue = styled(SkeletonBase)`
  height: 18px;
  width: 80%;
  margin: 0 auto;
`;

const TableContainer = styled.div`
  background: ${palette.card};
  border-radius: 12px;
  border: 1px solid ${palette.border};
  box-shadow: ${palette.shadow};
  overflow: hidden;
  margin-bottom: 2rem;
`;

const TableHeader = styled.div`
  background: ${palette.bgContainer};
  border-bottom: 1px solid ${palette.border};
  padding: 0.75rem 0.5rem;
  display: grid;
  grid-template-columns: 50px 160px 100px 110px 120px 85px;
  gap: 0.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 35px 110px 85px 90px 100px;
    padding: 0.5rem 0.375rem;
  }
`;

const HeaderSkeleton = styled(SkeletonBase)`
  height: 16px;
  width: 100%;
`;

const TableBody = styled.div`
  background: ${palette.card};
`;

const TableRow = styled.div`
  padding: 0.5rem 0.375rem;
  border-bottom: 1px solid ${palette.border};
  display: grid;
  grid-template-columns: 50px 160px 100px 110px 120px 85px;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 35px 110px 85px 90px 100px;
    padding: 0.375rem 0.25rem;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const RankSkeleton = styled(SkeletonBase)`
  height: 16px;
  width: 30px;
`;

const CoinSkeleton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoSkeleton = styled(SkeletonBase)`
  width: 28px;
  height: 28px;
  border-radius: 50%;

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;

const CoinInfoSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`;

const CoinNameSkeleton = styled(SkeletonBase)`
  height: 16px;
  width: 80%;
`;

const CoinSymbolSkeleton = styled(SkeletonBase)`
  height: 12px;
  width: 40%;
`;

const PriceSkeleton = styled(SkeletonBase)`
  height: 16px;
  width: 100%;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem 0;
  flex-wrap: wrap;
`;

const PageButtonSkeleton = styled(SkeletonBase)`
  width: 40px;
  height: 40px;
  border-radius: 8px;

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
  }
`;

/**
 * 코인 순위 페이지 로딩 스켈레톤
 */
export default function CoinRankingSkeleton() {
  return (
    <Container>
      {/* 통계 카드 스켈레톤 */}
      <StatsContainer>
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCard key={index}>
            <StatLabel />
            <StatValue />
          </StatCard>
        ))}
      </StatsContainer>

      {/* 테이블 스켈레톤 */}
      <TableContainer>
        <TableHeader>
          <HeaderSkeleton />
          <HeaderSkeleton />
          <HeaderSkeleton />
          <HeaderSkeleton />
          <HeaderSkeleton />
          <div style={{ display: 'none' }}>
            <HeaderSkeleton />
          </div>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 15 }).map((_, index) => (
            <TableRow key={index}>
              <RankSkeleton />
              <CoinSkeleton>
                <LogoSkeleton />
                <CoinInfoSkeleton>
                  <CoinNameSkeleton />
                  <CoinSymbolSkeleton />
                </CoinInfoSkeleton>
              </CoinSkeleton>
              <PriceSkeleton />
              <PriceSkeleton />
              <PriceSkeleton />
              <div style={{ display: 'none' }}>
                <PriceSkeleton />
              </div>
            </TableRow>
          ))}
        </TableBody>
      </TableContainer>

      {/* 페이지네이션 스켈레톤 */}
      <PaginationContainer>
        {Array.from({ length: 9 }).map((_, index) => (
          <PageButtonSkeleton key={index} />
        ))}
      </PaginationContainer>
    </Container>
  );
}
