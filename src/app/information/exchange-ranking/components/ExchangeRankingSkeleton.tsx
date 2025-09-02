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
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const TitleSkeleton = styled(SkeletonBase)`
  height: 36px;
  width: 200px;
  margin-bottom: 0.375rem;

  @media (max-width: 768px) {
    height: 30px;
    width: 160px;
  }
`;

const DescriptionSkeleton = styled(SkeletonBase)`
  height: 16px;
  width: 400px;

  @media (max-width: 768px) {
    width: 280px;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const StatLabelSkeleton = styled(SkeletonBase)`
  height: 12px;
  width: 60%;
  margin: 0 auto 0.375rem auto;
`;

const StatValueSkeleton = styled(SkeletonBase)`
  height: 18px;
  width: 80%;
  margin: 0 auto;
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid ${palette.border};
  background: ${palette.card};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Table = styled.div`
  width: 100%;
  min-width: 800px;
`;

const TableHeader = styled.div`
  background: ${palette.bgContainer};
  border-bottom: 1px solid ${palette.border};
  padding: 0.75rem 0.5rem;
  display: grid;
  grid-template-columns: 50px 160px 120px 100px 100px 80px 85px;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 35px 110px 80px 80px 70px;
    padding: 0.5rem 0.375rem;
  }
`;

const HeaderSkeleton = styled(SkeletonBase)`
  height: 14px;
  width: 70%;
`;

const TableBody = styled.div`
  background: ${palette.card};
`;

const TableRow = styled.div`
  padding: 0.5rem 0.375rem;
  border-bottom: 1px solid ${palette.border};
  display: grid;
  grid-template-columns: 50px 160px 120px 100px 100px 80px 85px;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 35px 110px 80px 80px 70px;
    padding: 0.375rem 0.25rem;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const RankSkeleton = styled(SkeletonBase)`
  height: 16px;
  width: 40px;
  margin: 0 auto;
`;

const ExchangeSkeleton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoSkeleton = styled(SkeletonBase)`
  width: 32px;
  height: 32px;
  border-radius: 50%;

  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
  }
`;

const ExchangeInfoSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
`;

const ExchangeNameSkeleton = styled(SkeletonBase)`
  height: 16px;
  width: 80%;
`;

const ExchangeSlugSkeleton = styled(SkeletonBase)`
  height: 12px;
  width: 50%;
`;

const DataSkeleton = styled(SkeletonBase)`
  height: 16px;
  width: 90%;
  margin-left: auto;
`;

const BadgeSkeleton = styled(SkeletonBase)`
  height: 24px;
  width: 60px;
  border-radius: 12px;
  margin: 0 auto;
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
 * 거래소 랭킹 페이지 로딩 스켈레톤
 */
export default function ExchangeRankingSkeleton() {
  return (
    <Container>
      {/* 헤더 스켈레톤 */}
      <Header>
        <TitleSkeleton />
        <DescriptionSkeleton />
      </Header>

      {/* 통계 카드 스켈레톤 */}
      <StatsContainer>
        {Array.from({ length: 3 }).map((_, index) => (
          <StatCard key={index}>
            <StatLabelSkeleton />
            <StatValueSkeleton />
          </StatCard>
        ))}
      </StatsContainer>

      {/* 테이블 스켈레톤 */}
      <TableContainer>
        <Table>
          <TableHeader>
            <HeaderSkeleton />
            <HeaderSkeleton />
            <HeaderSkeleton />
            <HeaderSkeleton />
            <HeaderSkeleton />
            <HeaderSkeleton />
            <HeaderSkeleton />
          </TableHeader>

          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <RankSkeleton />
                <ExchangeSkeleton>
                  <LogoSkeleton />
                  <ExchangeInfoSkeleton>
                    <ExchangeNameSkeleton />
                    <ExchangeSlugSkeleton />
                  </ExchangeInfoSkeleton>
                </ExchangeSkeleton>
                <DataSkeleton />
                <DataSkeleton />
                <DataSkeleton />
                <DataSkeleton />
                <BadgeSkeleton />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 페이지네이션 스켈레톤 */}
      <PaginationContainer>
        {Array.from({ length: 7 }).map((_, index) => (
          <PageButtonSkeleton key={index} />
        ))}
      </PaginationContainer>
    </Container>
  );
}
