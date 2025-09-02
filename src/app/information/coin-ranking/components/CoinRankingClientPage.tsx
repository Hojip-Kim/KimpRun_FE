'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { palette } from '@/styles/palette';
import { CoinRankingResponse } from '@/types/coinRanking';
import { useCoinRanking } from '../hooks/useCoinRanking';
import CoinRankingTable from './CoinRankingTable';
import Pagination from '@/components/common/Pagination';
import CoinRankingSkeleton from './CoinRankingSkeleton';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: ${palette.bgPage};
  color: ${palette.textPrimary};
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
    margin-bottom: 80px;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.375rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${palette.textPrimary};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;

  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

const UpdatedDate = styled.div`
  font-size: 0.75rem;
  color: ${palette.textMuted};
  background: ${palette.bgContainer};
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  border: 1px solid ${palette.border};
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 0.25rem 0.5rem;
  }
`;

const UnitGuide = styled.div`
  font-size: 0.7rem;
  color: ${palette.textSecondary};
  background: ${palette.card};
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid ${palette.border};
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: flex-end;

  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 0.375rem 0.5rem;
    justify-content: flex-start;
    gap: 0.5rem;
  }
`;

const UnitItem = styled.div`
  white-space: nowrap;
`;

const UnitSymbol = styled.span`
  color: ${palette.accent};
  font-weight: 600;
`;

const Subtitle = styled.p`
  color: ${palette.textSecondary};
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.8rem;
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
  transition: all 0.2s ease;

  &:hover {
    border-color: ${palette.accent};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${palette.textSecondary};
  margin-bottom: 0.375rem;
  font-weight: 500;
`;

const StatValue = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${palette.textPrimary};

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: ${palette.card};
  border-radius: 12px;
  border: 1px solid ${palette.border};
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${palette.border};
  border-top: 3px solid ${palette.accent};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorContainer = styled.div`
  background: ${palette.card};
  border: 1px solid #ef4444;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  color: #ef4444;
`;

const RefreshButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: ${palette.accent};
  color: #000;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface CoinRankingClientPageProps {
  initialData: CoinRankingResponse | null;
  initialError: string | null;
  initialPage: number;
  initialSize: number;
}

export default function CoinRankingClientPage({
  initialData,
  initialError,
  initialPage,
  initialSize,
}: CoinRankingClientPageProps) {
  // 커스텀 훅 사용
  const {
    data: coinData,
    loading,
    error,
  } = useCoinRanking(initialData, initialError);

  // 클라이언트 사이드 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize] = useState(initialSize);

  // 페이지 변경 핸들러 (URL 기반 SSR)
  const handlePageChange = (page: number) => {
    // 유효한 페이지 범위 확인
    const maxPages = coinData?.data.totalPages || 1;
    if (page < 1 || page > maxPages) {
      console.warn(`잘못된 페이지 번호: ${page} (유효 범위: 1-${maxPages})`);
      return;
    }

    // URL 변경을 통한 SSR 페이지 이동
    window.location.href = `/information/coin-ranking?page=${page}&size=${pageSize}`;
  };

  // 데이터 새로고침
  const handleRefresh = () => {
    window.location.reload();
  };

  // 통계 데이터 계산
  const stats = coinData
    ? {
        totalCoins: coinData.data.totalElements.toLocaleString(),
        currentPage: currentPage,
        totalPages: coinData.data.totalPages.toLocaleString(),
        pageSize: coinData.data.size.toLocaleString(),
      }
    : null;

  // 최신 업데이트 날짜 계산 (첫 번째 코인의 lastUpdated 사용)
  const getLatestUpdateDate = () => {
    if (coinData?.data?.content?.[0]?.lastUpdated) {
      try {
        const date = new Date(coinData.data.content[0].lastUpdated);
        return date.toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      } catch {
        return null;
      }
    }
    return null;
  };

  return (
    <Container>
      <Header>
        <HeaderTop>
          <Title>코인 순위</Title>
          <HeaderRight>
            {getLatestUpdateDate() && (
              <UpdatedDate>갱신일: {getLatestUpdateDate()}</UpdatedDate>
            )}
            <UnitGuide>
              <UnitItem>
                <UnitSymbol>K</UnitSymbol> = 천 (Thousand)
              </UnitItem>
              <UnitItem>
                <UnitSymbol>M</UnitSymbol> = 백만 (Million)
              </UnitItem>
              <UnitItem>
                <UnitSymbol>B</UnitSymbol> = 십억 (Billion)
              </UnitItem>
              <UnitItem>
                <UnitSymbol>T</UnitSymbol> = 조 (Trillion)
              </UnitItem>
              <UnitItem>
                <UnitSymbol>Qa</UnitSymbol> = 천조 (Quadrillion)
              </UnitItem>
              <UnitItem>
                <UnitSymbol>Qi</UnitSymbol> = 백경 (Quintillion)
              </UnitItem>
            </UnitGuide>
          </HeaderRight>
        </HeaderTop>
        <Subtitle>
          실시간 암호화폐 시가총액 순위를 확인하세요. 각 코인을 클릭하면 상세
          정보를 볼 수 있습니다.
        </Subtitle>
      </Header>

      {loading && !coinData && <CoinRankingSkeleton />}

      {error && !loading && (
        <ErrorContainer>
          <h3>오류 발생</h3>
          <p>{error}</p>
          <RefreshButton onClick={handleRefresh} disabled={loading}>
            {loading ? '다시 시도 중...' : '다시 시도'}
          </RefreshButton>
        </ErrorContainer>
      )}

      {coinData && !loading && !error && (
        <>
          {coinData.data.content.length > 0 ? (
            <>
              <CoinRankingTable coins={coinData.data.content} loading={false} />

              <Pagination
                currentPage={currentPage}
                totalPages={coinData.data.totalPages}
                totalElements={coinData.data.totalElements}
                onPageChange={handlePageChange}
                showInfo={true}
              />
            </>
          ) : (
            <ErrorContainer>
              <h3>데이터가 없습니다</h3>
              <p>해당 페이지에 표시할 코인 데이터가 없습니다.</p>
              <RefreshButton
                onClick={() =>
                  (window.location.href = `/information/coin-ranking?page=1&size=${pageSize}`)
                }
                disabled={loading}
              >
                첫 페이지로 이동
              </RefreshButton>
            </ErrorContainer>
          )}
        </>
      )}
    </Container>
  );
}
