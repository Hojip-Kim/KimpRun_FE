'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { palette } from '@/styles/palette';
import { CoinRankingResponse } from '@/types/coinRanking';
import { useCoinRanking } from '../hooks/useCoinRanking';
import CoinRankingTable from './CoinRankingTable';
import Pagination from '@/components/common/Pagination';
import CoinRankingSkeleton from './CoinRankingSkeleton';
import CoinSearch from './CoinSearch';
import { searchCoinBySymbolClient } from '../services/coinRankingService';
import { useRouter } from 'next/navigation';

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

const SearchSection = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

const SearchInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  @media (max-width: 768px) {
    order: 2;
  }
`;

const SearchTitle = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${palette.textPrimary};

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SearchSubtitle = styled.div`
  font-size: 0.875rem;
  color: ${palette.textSecondary};

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    order: 1;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }
`;

const ViewAllButton = styled.button`
  padding: 0.875rem 1.5rem;
  background: ${palette.card};
  color: ${palette.textPrimary};
  border: 2px solid ${palette.border};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: ${palette.accent};
    background: ${palette.accentRing};
    color: ${palette.accent};
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1.25rem;
    font-size: 0.85rem;
    width: 100%;
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
  searchSymbol?: string;
}

export default function CoinRankingClientPage({
  initialData,
  initialError,
  initialPage,
  initialSize,
  searchSymbol,
}: CoinRankingClientPageProps) {
  const router = useRouter();
  // 커스텀 훅 사용
  const {
    data: coinData,
    loading,
    error,
  } = useCoinRanking(initialData, initialError);

  // 클라이언트 사이드 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize] = useState(initialSize);
  
  // 검색 상태
  const [isSearchMode, setIsSearchMode] = useState(!!searchSymbol);
  const [currentSearchSymbol, setCurrentSearchSymbol] = useState(searchSymbol || '');
  const [searchData, setSearchData] = useState<CoinRankingResponse | null>(
    // 서버에서 검색 데이터를 가져온 경우 초기값으로 설정
    searchSymbol && initialData && !initialError ? initialData : null
  );
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(
    // 서버에서 검색 모드로 에러가 발생한 경우만 초기값으로 설정
    searchSymbol && initialError ? initialError : null
  );

  // 검색 핸들러
  const handleSearch = async (symbol: string) => {
    // 새로운 검색 시 페이지 완전 새로고침으로 서버에서 데이터 로드
    window.location.href = `/information/coin-ranking?symbol=${symbol}&page=1&size=${pageSize}`;
  };

  // 전체 목록으로 돌아가기
  const handleViewAll = () => {
    // 검색 상태 초기화
    setIsSearchMode(false);
    setCurrentSearchSymbol('');
    setSearchData(null);
    setSearchError(null);
    setCurrentPage(1);
    
    // 캐시 문제 해결을 위해 완전한 페이지 새로고침
    window.location.href = `/information/coin-ranking?page=1&size=${pageSize}`;
  };

  // 페이지 변경 핸들러 (URL 기반 SSR)
  const handlePageChange = (page: number) => {
    if (isSearchMode) {
      // 검색 모드에서는 클라이언트 사이드 페이지네이션
      handleSearchPageChange(page);
      return;
    }

    // 유효한 페이지 범위 확인
    const maxPages = coinData?.totalPages || 1;
    if (page < 1 || page > maxPages) {
      console.warn(`잘못된 페이지 번호: ${page} (유효 범위: 1-${maxPages})`);
      return;
    }

    // URL 변경을 통한 SSR 페이지 이동
    window.location.href = `/information/coin-ranking?page=${page}&size=${pageSize}`;
  };

  // 검색 결과 페이지네이션
  const handleSearchPageChange = async (page: number) => {
    if (!currentSearchSymbol) return;

    try {
      setSearchLoading(true);
      const response = await searchCoinBySymbolClient(currentSearchSymbol, page, pageSize);
      setSearchData(response);
      setCurrentPage(page);
      
      // URL 업데이트
      router.push(`/information/coin-ranking?symbol=${currentSearchSymbol}&page=${page}&size=${pageSize}`);
    } catch (error) {
      console.error('검색 페이지 변경 중 오류:', error);
      setSearchError(error instanceof Error ? error.message : '페이지 변경 중 오류가 발생했습니다.');
    } finally {
      setSearchLoading(false);
    }
  };

  // 데이터 새로고침
  const handleRefresh = () => {
    window.location.reload();
  };

  // 현재 표시할 데이터 결정
  const currentDisplayData = isSearchMode ? searchData : coinData;
  const currentLoading = isSearchMode ? searchLoading : loading;
  const currentError = isSearchMode ? searchError : error;

  // 통계 데이터 계산
  const stats = currentDisplayData
    ? {
        totalCoins: currentDisplayData.totalElements.toLocaleString(),
        currentPage: currentPage,
        totalPages: currentDisplayData.totalPages.toLocaleString(),
        pageSize: currentDisplayData.size.toLocaleString(),
      }
    : null;

  // 최신 업데이트 날짜 계산 (첫 번째 코인의 lastUpdated 사용)
  const getLatestUpdateDate = () => {
    if (coinData?.content?.[0]?.lastUpdated) {
      try {
        const date = new Date(coinData.content[0].lastUpdated);
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
          <Title>{isSearchMode ? `코인 검색: ${currentSearchSymbol}` : '코인 순위'}</Title>
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
          {isSearchMode 
            ? `"${currentSearchSymbol}" 검색 결과입니다. 각 코인을 클릭하면 상세 정보를 볼 수 있습니다.`
            : '실시간 암호화폐 시가총액 순위를 확인하세요. 각 코인을 클릭하면 상세 정보를 볼 수 있습니다.'
          }
        </Subtitle>
      </Header>

      {/* 검색 섹션 */}
      <SearchSection>
        <SearchInfo>
          {isSearchMode && (
            <>
              <SearchTitle>검색 결과</SearchTitle>
              <SearchSubtitle>
                검색된 결과: {stats?.totalCoins || 0}개
              </SearchSubtitle>
            </>
          )}
        </SearchInfo>
        <SearchContainer>
          <CoinSearch 
            onSearch={handleSearch}
            initialValue={currentSearchSymbol}
          />
          {isSearchMode && (
            <ViewAllButton onClick={handleViewAll}>
              전체 목록 보기
            </ViewAllButton>
          )}
        </SearchContainer>
      </SearchSection>

      {currentLoading && !currentDisplayData && <CoinRankingSkeleton />}

      {currentError && !currentLoading && (
        <ErrorContainer>
          <h3>오류 발생</h3>
          <p>{currentError}</p>
          <RefreshButton 
            onClick={isSearchMode ? () => handleSearch(currentSearchSymbol) : handleRefresh} 
            disabled={currentLoading}
          >
            {currentLoading ? '다시 시도 중...' : '다시 시도'}
          </RefreshButton>
        </ErrorContainer>
      )}

      {currentDisplayData && !currentLoading && !currentError && (
        <>
          {currentDisplayData.content.length > 0 ? (
            <>
              <CoinRankingTable coins={currentDisplayData.content} loading={false} />

              <Pagination
                currentPage={currentPage}
                totalPages={currentDisplayData.totalPages}
                totalElements={currentDisplayData.totalElements}
                onPageChange={handlePageChange}
                showInfo={true}
              />
            </>
          ) : (
            <ErrorContainer>
              <h3>{isSearchMode ? '검색 결과가 없습니다' : '데이터가 없습니다'}</h3>
              <p>
                {isSearchMode 
                  ? `"${currentSearchSymbol}" 심볼과 일치하는 코인을 찾을 수 없습니다.`
                  : '해당 페이지에 표시할 코인 데이터가 없습니다.'
                }
              </p>
              <RefreshButton
                onClick={isSearchMode ? handleViewAll : () =>
                  (window.location.href = `/information/coin-ranking?page=1&size=${pageSize}`)
                }
                disabled={currentLoading}
              >
                {isSearchMode ? '전체 목록 보기' : '첫 페이지로 이동'}
              </RefreshButton>
            </ErrorContainer>
          )}
        </>
      )}
    </Container>
  );
}
