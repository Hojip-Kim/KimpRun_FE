'use client';

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useExchangeRanking } from '../hooks/useExchangeRanking';
import { useExchangeRankingNavigation } from '../hooks/useExchangeRankingNavigation';
import ExchangeRankingTable from './ExchangeRankingTable';
import Pagination from '@/components/common/Pagination';
import ExchangeRankingSkeleton from './ExchangeRankingSkeleton';
import {
  ExchangeRankingItem,
  ExchangeRankingError,
} from '@/types/exchangeRanking';
import { palette } from '@/styles/palette';
import { parseDate } from '@/utils/dateUtils';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
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

const Description = styled.p`
  color: ${palette.textSecondary};
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: ${palette.textMuted};
  font-size: 1rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 2rem;
  background: ${palette.card};
  border-radius: 12px;
  border: 1px solid ${palette.border};
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
`;

const ErrorDescription = styled.div`
  color: ${palette.textSecondary};
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${palette.accent};
  color: #000;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
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
  transition: all 0.2s ease;

  &:hover {
    border-color: ${palette.accent};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const StatLabel = styled.div`
  color: ${palette.textSecondary};
  font-size: 0.75rem;
  margin-bottom: 0.375rem;
  font-weight: 500;
`;

const StatValue = styled.div`
  color: ${palette.textPrimary};
  font-size: 1.125rem;
  font-weight: 600;
`;

interface ExchangeRankingClientPageProps {
  initialData: ExchangeRankingItem[];
  initialError: ExchangeRankingError | null;
  initialPage: number;
  initialSize: number;
  initialTotalPages: number;
  initialTotalElements: number;
}

export default function ExchangeRankingClientPage({
  initialData,
  initialError,
  initialPage,
  initialSize,
  initialTotalPages,
  initialTotalElements,
}: ExchangeRankingClientPageProps) {
  const navigation = useExchangeRankingNavigation();
  const exchangeRanking = useExchangeRanking({
    page: initialPage,
    size: initialSize,
  });

  // URL 변경 시 데이터 다시 가져오기
  useEffect(() => {
    if (
      navigation.currentPage !== exchangeRanking.currentPage ||
      navigation.currentSize !== exchangeRanking.pageSize
    ) {
      exchangeRanking.setPage(navigation.currentPage);
      if (navigation.currentSize !== exchangeRanking.pageSize) {
        exchangeRanking.setPageSize(navigation.currentSize);
      }
    }
  }, [navigation.currentPage, navigation.currentSize]);

  // 초기 데이터 설정
  useEffect(() => {
    if (
      initialData &&
      exchangeRanking.data.length === 0 &&
      !exchangeRanking.loading
    ) {
      // 초기 SSR 데이터를 사용하기 위해 상태를 직접 설정하지 않고,
      // 필요 시 refresh를 통해 최신 데이터를 가져옴
    }
  }, [initialData, exchangeRanking.data.length, exchangeRanking.loading]);

  const handlePageChange = (page: number) => {
    navigation.navigateToPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    navigation.navigateToPageAndSize(1, size);
  };

  // 에러 상태 처리
  if (exchangeRanking.error && !exchangeRanking.loading) {
    return (
      <Container>
        <Header>
          <Title>거래소 랭킹</Title>
          <Description>
            전 세계 주요 암호화폐 거래소들의 거래량과 정보를 확인하세요.
          </Description>
        </Header>
        <ErrorContainer>
          <ErrorMessage>데이터를 불러오는 중 오류가 발생했습니다</ErrorMessage>
          <ErrorDescription>{exchangeRanking.error.message}</ErrorDescription>
          <RetryButton onClick={exchangeRanking.refresh}>다시 시도</RetryButton>
        </ErrorContainer>
      </Container>
    );
  }

  // 데이터 결정 (클라이언트 데이터가 있으면 클라이언트 데이터 사용, 없으면 초기 데이터 사용)
  const displayData =
    exchangeRanking.data.length > 0 ? exchangeRanking.data : initialData || [];

  // 로딩 상태 처리 (코인 랭킹과 동일한 로직)
  if (exchangeRanking.loading && displayData.length === 0) {
    return <ExchangeRankingSkeleton />;
  }
  const displayTotalPages =
    exchangeRanking.totalPages > 0
      ? exchangeRanking.totalPages
      : initialTotalPages;
  const displayTotalElements =
    exchangeRanking.totalElements > 0
      ? exchangeRanking.totalElements
      : initialTotalElements;
  const displayCurrentPage = navigation.currentPage;
  const displayPageSize = navigation.currentSize;

  // 최신 업데이트 날짜 계산 (첫 번째 거래소의 updatedAt 사용)
  const getLatestUpdateDate = () => {
    if (displayData?.[0]?.updatedAt) {
      try {
        const date = parseDate(displayData[0].updatedAt);
        if (!date) return null;

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
          <Title>거래소 랭킹</Title>
          {getLatestUpdateDate() && (
            <UpdatedDate>갱신일: {getLatestUpdateDate()}</UpdatedDate>
          )}
        </HeaderTop>
        <Description>
          전 세계 주요 암호화폐 거래소들의 거래량과 정보를 확인하세요.
        </Description>
      </Header>

      {/* 거래소 테이블 */}
      <ExchangeRankingTable
        exchanges={displayData}
        loading={exchangeRanking.loading && displayData.length > 0}
        currentPage={displayCurrentPage - 1} // rank 계산용 0-based index
        pageSize={displayPageSize}
      />

      {/* 페이지네이션 */}
      {displayTotalPages > 1 && (
        <Pagination
          currentPage={displayCurrentPage}
          totalPages={displayTotalPages}
          totalElements={displayTotalElements}
          pageSize={displayPageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          showPageSize={true}
          showInfo={true}
        />
      )}
    </Container>
  );
}
