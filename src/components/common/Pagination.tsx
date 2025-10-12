'use client';

import React from 'react';
import styled from 'styled-components';
import { palette } from '@/styles/palette';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalElements?: number;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  showPageSize?: boolean; // 페이지 크기 선택 표시 여부
  showInfo?: boolean; // 페이지 정보 표시 여부
}

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem 0;
  flex-wrap: wrap;
`;

const PageButton = styled.button<{
  $isActive?: boolean;
  $isDisabled?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0.5rem;
  border: 1px solid ${palette.border};
  border-radius: 8px;
  background: ${({ $isActive }) => ($isActive ? palette.accent : palette.card)};
  color: ${({ $isActive }) => ($isActive ? '#000' : palette.textPrimary)};
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '500')};
  font-size: 0.9rem;
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  opacity: ${({ $isDisabled }) => ($isDisabled ? '0.4' : '1')};

  &:hover:not(:disabled) {
    background: ${({ $isActive }) =>
      $isActive ? palette.accent : palette.bgContainer};
    border-color: ${palette.accent};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  @media (max-width: 480px) {
    min-width: 36px;
    height: 36px;
    font-size: 0.8rem;
  }
`;

const NavigationButton = styled(PageButton)`
  min-width: 48px;
  font-weight: 600;

  @media (max-width: 480px) {
    min-width: 40px;
  }
`;

const Ellipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  color: ${palette.textMuted};
  font-weight: 600;

  @media (max-width: 480px) {
    min-width: 36px;
    height: 36px;
  }
`;

const PageInfo = styled.div`
  display: none;
  align-items: center;
  gap: 0.5rem;
  margin: 0 1rem;
  color: ${palette.textSecondary};
  font-size: 0.9rem;

  @media (max-width: 480px) {
    display: flex;
    order: -1;
    width: 100%;
    justify-content: center;
    margin: 0 0 1rem 0;
  }
`;

const PageSizeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${palette.textSecondary};
  font-size: 0.9rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    order: 1;
    margin-top: 1rem;
  }
`;

const PageSizeSelect = styled.select`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${palette.border};
  border-radius: 4px;
  background: ${palette.card};
  color: ${palette.textPrimary};
  font-size: 0.9rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${palette.accent};
  }
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${palette.textSecondary};
  font-size: 0.85rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    order: -1;
    margin-bottom: 1rem;
  }
`;

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalElements,
  pageSize,
  onPageSizeChange,
  showPageSize = false,
  showInfo = false,
}) => {
  // 모바일 여부 확인
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 페이지 그룹 크기 (모바일: 5개, 데스크톱: 10개)
  const groupSize = isMobile ? 5 : 10;

  // 페이지 번호 그룹 계산
  const pageGroup = Math.floor((currentPage - 1) / groupSize);
  const startPage = pageGroup * groupSize + 1;
  const endPage = Math.min(startPage + groupSize - 1, totalPages);

  // 표시할 페이지 번호들 생성
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(size);
    }
  };

  // 페이지가 1개 이하인 경우 - 정보 표시가 요청된 경우에만 표시
  if (totalPages <= 1 && !showInfo) {
    return null;
  }

  return (
    <PaginationContainer>
      {/* 페이지 정보 표시 */}
      {showInfo && totalElements && pageSize && (
        <InfoContainer>
          총 {totalElements.toLocaleString()}개 중{' '}
          {((currentPage - 1) * pageSize + 1).toLocaleString()} -{' '}
          {Math.min(currentPage * pageSize, totalElements).toLocaleString()}개
          표시
        </InfoContainer>
      )}

      <PageInfo>
        {currentPage} / {totalPages} 페이지
      </PageInfo>

      {totalPages > 1 && !isMobile && (
        <>
          {/* 첫 페이지로 */}
          <NavigationButton
            onClick={() => handlePageChange(1)}
            $isDisabled={currentPage === 1}
            disabled={currentPage === 1}
            title="첫 페이지"
          >
            ««
          </NavigationButton>

          {/* 이전 페이지 그룹 */}
          <NavigationButton
            onClick={() => handlePageChange(Math.max(1, startPage - 1))}
            $isDisabled={startPage <= 1}
            disabled={startPage <= 1}
            title={`이전 ${groupSize}페이지`}
          >
            «
          </NavigationButton>
        </>
      )}

      {totalPages > 1 && (
        <>
          {/* 이전 페이지 */}
          <NavigationButton
            onClick={() => handlePageChange(currentPage - 1)}
            $isDisabled={currentPage === 1}
            disabled={currentPage === 1}
            title="이전 페이지"
          >
            ‹
          </NavigationButton>

          {/* 첫 페이지와 현재 그룹 사이에 간격이 있으면 ... 표시 */}
          {!isMobile && startPage > 1 && (
            <>
              <PageButton
                onClick={() => handlePageChange(1)}
                $isActive={currentPage === 1}
              >
                1
              </PageButton>
              {startPage > 2 && <Ellipsis>...</Ellipsis>}
            </>
          )}

          {/* 현재 그룹의 페이지 번호들 */}
          {pageNumbers.map((pageNumber) => (
            <PageButton
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              $isActive={currentPage === pageNumber}
            >
              {pageNumber}
            </PageButton>
          ))}

          {/* 현재 그룹과 마지막 페이지 사이에 간격이 있으면 ... 표시 */}
          {!isMobile && endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <Ellipsis>...</Ellipsis>}
              <PageButton
                onClick={() => handlePageChange(totalPages)}
                $isActive={currentPage === totalPages}
              >
                {totalPages}
              </PageButton>
            </>
          )}

          {/* 다음 페이지 */}
          <NavigationButton
            onClick={() => handlePageChange(currentPage + 1)}
            $isDisabled={currentPage === totalPages}
            disabled={currentPage === totalPages}
            title="다음 페이지"
          >
            ›
          </NavigationButton>

          {!isMobile && (
            <>
              {/* 다음 페이지 그룹 */}
              <NavigationButton
                onClick={() =>
                  handlePageChange(Math.min(totalPages, endPage + 1))
                }
                $isDisabled={endPage >= totalPages}
                disabled={endPage >= totalPages}
                title={`다음 ${groupSize}페이지`}
              >
                »
              </NavigationButton>

              {/* 마지막 페이지로 */}
              <NavigationButton
                onClick={() => handlePageChange(totalPages)}
                $isDisabled={currentPage === totalPages}
                disabled={currentPage === totalPages}
                title="마지막 페이지"
              >
                »»
              </NavigationButton>
            </>
          )}
        </>
      )}
    </PaginationContainer>
  );
};

export default Pagination;
