'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ExchangeRankingItem } from '@/types/exchangeRanking';
import { palette } from '@/styles/palette';
import { cardStyle } from '@/components/styled/common';
import { parseDate } from '@/utils/dateUtils';

// 스타일 컴포넌트들
const TableContainer = styled.div`
  ${cardStyle}
  overflow: hidden;
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  line-height: 1.3;
`;

const TableHeader = styled.thead`
  background: ${palette.bgContainer};
  border-bottom: 1px solid ${palette.border};
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem 0.5rem;
  text-align: left;
  font-weight: 600;
  color: ${palette.textPrimary};
  border-right: 1px solid ${palette.border};
  white-space: nowrap;
  font-size: 0.85rem;

  &:last-child {
    border-right: none;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.375rem;
    font-size: 0.75rem;
  }
`;

const RankHeaderCell = styled(TableHeaderCell)`
  width: 50px;
  text-align: center;

  @media (max-width: 768px) {
    width: 35px;
  }
`;

const ExchangeCell = styled(TableHeaderCell)`
  min-width: 160px;

  @media (max-width: 768px) {
    min-width: 110px;
  }
`;

const VolumeCell = styled(TableHeaderCell)`
  min-width: 120px;
  text-align: right;

  @media (max-width: 768px) {
    min-width: 80px;
    font-size: 0.7rem;
  }
`;

const LaunchedCell = styled(TableHeaderCell)`
  min-width: 100px;
  text-align: center;

  @media (max-width: 768px) {
    min-width: 80px;
  }
`;

const UpdatedCell = styled(TableHeaderCell)`
  min-width: 100px;
  text-align: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const FeeCell = styled(TableHeaderCell)`
  min-width: 80px;
  text-align: right;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SupportedCell = styled(TableHeaderCell)`
  min-width: 85px;
  text-align: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const TableRow = styled.tr<{ $isExpanded: boolean }>`
  border-bottom: 1px solid ${palette.border};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${palette.bgContainer};
  }

  ${({ $isExpanded }) =>
    $isExpanded &&
    `
    background-color: ${palette.bgContainer};
  `}
`;

const TableBody = styled.tbody`
  background: ${palette.card};
`;

const TableCell = styled.td`
  padding: 0.5rem 0.375rem;
  border-right: 1px solid ${palette.border};
  color: ${palette.textPrimary};
  font-size: 0.85rem;

  &:last-child {
    border-right: none;
  }

  @media (max-width: 768px) {
    padding: 0.375rem 0.25rem;
    font-size: 0.75rem;
  }
`;

const RankCell = styled(TableCell)`
  text-align: center;
  font-weight: 600;
  color: ${palette.textSecondary};
`;

const ExchangeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ExchangeLogo = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
  }
`;

const ExchangeNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const ExchangeName = styled.div`
  font-weight: 600;
  color: ${palette.textPrimary};
  font-size: 0.9rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ExchangeSlug = styled.div`
  font-size: 0.75rem;
  color: ${palette.textMuted};
`;

const VolumeTableCell = styled(TableCell)`
  text-align: right;
  font-weight: 600;
  font-family: 'Courier New', monospace;

  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
`;

const LaunchedTableCell = styled(TableCell)`
  text-align: center;
  font-size: 0.75rem;
  color: ${palette.textSecondary};
`;

const UpdatedTableCell = styled(TableCell)`
  text-align: center;
  font-size: 0.75rem;
  color: ${palette.textSecondary};

  @media (max-width: 768px) {
    display: none;
  }
`;

const FeeTableCell = styled(TableCell)`
  text-align: right;
  font-weight: 600;
  font-family: 'Courier New', monospace;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SupportedTableCell = styled(TableCell)`
  text-align: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SupportedBadge = styled.span<{ $isSupported: boolean }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${({ $isSupported }) => ($isSupported ? '#10B981' : '#EF4444')};
  color: white;
`;

const ExpandableRow = styled.tr<{ $isExpanded: boolean }>`
  ${({ $isExpanded }) => !$isExpanded && 'display: none;'}
`;

const ExpandableContent = styled.td`
  padding: 1.5rem;
  border: none;
  background: ${palette.bgPage};
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
    overflow-x: auto;
  }
`;

// 유틸리티 함수들
const formatVolume = (volumeUsd: number, dollarRate: number): string => {
  const volumeKrw = volumeUsd * dollarRate;

  if (volumeKrw >= 1e12) {
    return `${(volumeKrw / 1e12).toFixed(1)}조원`;
  } else if (volumeKrw >= 1e8) {
    return `${(volumeKrw / 1e8).toFixed(1)}억원`;
  } else if (volumeKrw >= 1e4) {
    return `${(volumeKrw / 1e4).toFixed(1)}만원`;
  } else {
    return `${volumeKrw.toLocaleString()}원`;
  }
};

const formatFee = (fee: number): string => {
  return fee === 0 ? '0%' : `${fee.toFixed(3)}%`;
};

const formatDate = (dateValue: string | number[]): string => {
  const date = parseDate(dateValue);
  if (!date) return '-';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}.${month}`;
};

const parseFiats = (fiatsString: string): string[] => {
  try {
    // "[EUR,  GBP,  BRL]" 형태의 문자열을 파싱
    const cleaned = fiatsString.replace(/^\[|\]$/g, '').trim();
    return cleaned
      .split(',')
      .map((fiat) => fiat.trim())
      .filter((fiat) => fiat.length > 0);
  } catch {
    return [];
  }
};

// 거래소 상세 정보 스타일 컴포넌트들
const DetailContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    font-size: 0.8rem;
  }
`;

const DetailSection = styled.div`
  @media (max-width: 768px) {
    &:last-child {
      order: -1;
    }
  }
`;

const DetailTitle = styled.h4`
  margin: 0 0 1rem 0;
  color: ${palette.accent};
  font-size: 1rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
  }
`;

const DetailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
`;

const DetailLabel = styled.span`
  color: ${palette.textSecondary};
  font-size: 0.875rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const DetailValue = styled.span`
  color: ${palette.textPrimary};
  font-weight: 600;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const FiatsContainer = styled.div`
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    margin-top: 1rem;
  }
`;

const FiatsTitle = styled.h5`
  margin: 0 0 0.75rem 0;
  color: ${palette.accent};
  font-size: 0.9rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }
`;

const FiatsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: 768px) {
    gap: 0.375rem;
  }
`;

const FiatTag = styled.span`
  display: inline-block;
  background: ${palette.input};
  color: ${palette.textPrimary};
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid ${palette.border};

  @media (max-width: 768px) {
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
  }
`;

const DescriptionContainer = styled.div`
  color: ${palette.textSecondary};
  line-height: 1.6;
  font-size: 0.8rem;
  max-height: 200px;
  overflow-y: auto;
  padding: 0.75rem;
  background: ${palette.input};
  border-radius: 6px;
  border: 1px solid ${palette.border};

  @media (max-width: 768px) {
    max-height: 150px;
    padding: 0.5rem;
    font-size: 0.75rem;
    line-height: 1.5;
  }
`;

const LinkButton = styled.a`
  color: ${palette.accent};
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

// 거래소 상세 정보 컴포넌트
const ExchangeDetailExpanded: React.FC<{ exchange: ExchangeRankingItem }> = ({
  exchange,
}) => {
  const fiats = parseFiats(exchange.fiats.join(''));

  return (
    <DetailContainer>
      {/* 기본 정보 */}
      <DetailSection>
        <DetailTitle>기본 정보</DetailTitle>
        <DetailList>
          <DetailItem>
            <DetailLabel>설립일</DetailLabel>
            <DetailValue>
              {parseDate(exchange.dateLaunched)?.toLocaleDateString('ko-KR') || '-'}
            </DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>업데이트</DetailLabel>
            <DetailValue>
              {parseDate(exchange.updatedAt)?.toLocaleDateString('ko-KR') || '-'}
            </DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>URL</DetailLabel>
            <DetailValue>
              <LinkButton
                href={exchange.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {new URL(exchange.url).hostname.replace('www.', '')}
              </LinkButton>
            </DetailValue>
          </DetailItem>
        </DetailList>

        {/* 지원 법정화폐 */}
        {fiats.length > 0 && (
          <FiatsContainer>
            <FiatsTitle>지원 법정화폐</FiatsTitle>
            <FiatsGrid>
              {fiats.map((fiat, index) => (
                <FiatTag key={index}>{fiat}</FiatTag>
              ))}
            </FiatsGrid>
          </FiatsContainer>
        )}
      </DetailSection>

      {/* 설명 */}
      <DetailSection>
        <DetailTitle>거래소 소개</DetailTitle>
        <DescriptionContainer
          dangerouslySetInnerHTML={{
            __html: exchange.description.replace(/\n/g, '<br/>'),
          }}
        />
      </DetailSection>
    </DetailContainer>
  );
};

// 테이블 행 컴포넌트
interface ExchangeRankingRowProps {
  exchange: ExchangeRankingItem;
  rank: number;
  isExpanded: boolean;
  onClick: () => void;
  dollarRate: number;
}

const ExchangeTableRow: React.FC<ExchangeRankingRowProps> = ({
  exchange,
  rank,
  isExpanded,
  onClick,
  dollarRate,
}) => {
  return (
    <>
      <TableRow $isExpanded={isExpanded} onClick={onClick}>
        <RankCell>#{rank}</RankCell>
        <TableCell>
          <ExchangeInfo>
            <ExchangeLogo
              src={exchange.logo}
              alt={`${exchange.name} logo`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.png';
              }}
            />
            <ExchangeNameContainer>
              <ExchangeName>{exchange.name}</ExchangeName>
              <ExchangeSlug>{exchange.slug}</ExchangeSlug>
            </ExchangeNameContainer>
          </ExchangeInfo>
        </TableCell>
        <VolumeTableCell>
          {formatVolume(exchange.spotVolumeUsd, dollarRate)}
        </VolumeTableCell>
        <LaunchedTableCell>
          {formatDate(exchange.dateLaunched)}
        </LaunchedTableCell>
        <UpdatedTableCell>{formatDate(exchange.updatedAt)}</UpdatedTableCell>
        <FeeTableCell>{formatFee(exchange.fee)}</FeeTableCell>
        <SupportedTableCell>
          <SupportedBadge $isSupported={exchange.isSupported}>
            {exchange.isSupported ? '지원' : '미지원'}
          </SupportedBadge>
        </SupportedTableCell>
      </TableRow>
      <ExpandableRow $isExpanded={isExpanded}>
        <ExpandableContent colSpan={window.innerWidth <= 768 ? 4 : 7}>
          {isExpanded && <ExchangeDetailExpanded exchange={exchange} />}
        </ExpandableContent>
      </ExpandableRow>
    </>
  );
};

interface ExchangeRankingTableProps {
  exchanges: ExchangeRankingItem[];
  loading?: boolean;
  currentPage?: number;
  pageSize?: number;
}

const ExchangeRankingTable: React.FC<ExchangeRankingTableProps> = ({
  exchanges,
  loading = false,
  currentPage = 0,
  pageSize = 100,
}) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const dollarRate = useSelector((state: RootState) => state.info.dollar);

  const handleRowClick = (slug: string) => {
    setExpandedRow(expandedRow === slug ? null : slug);
  };

  // loading은 기존 데이터가 있을 때만 사용하므로, 여기서는 스켈레톤 대신 기존 테이블에 로딩 표시만 함

  if (!exchanges || exchanges.length === 0) {
    return (
      <TableContainer>
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            color: palette.textMuted,
          }}
        >
          거래소 데이터가 없습니다.
        </div>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <tr>
            <RankHeaderCell>순위</RankHeaderCell>
            <ExchangeCell>거래소</ExchangeCell>
            <VolumeCell>24시간 거래량</VolumeCell>
            <LaunchedCell>설립일</LaunchedCell>
            <UpdatedCell>업데이트</UpdatedCell>
            <FeeCell>수수료</FeeCell>
            <SupportedCell>지원 여부</SupportedCell>
          </tr>
        </TableHeader>
        <TableBody>
          {exchanges.map((exchange, index) => (
            <ExchangeTableRow
              key={exchange.slug}
              exchange={exchange}
              rank={currentPage * pageSize + index + 1}
              isExpanded={expandedRow === exchange.slug}
              onClick={() => handleRowClick(exchange.slug)}
              dollarRate={dollarRate}
            />
          ))}
        </TableBody>
      </Table>
      {loading && (
        <div
          style={{
            padding: '1rem',
            textAlign: 'center',
            color: palette.textMuted,
            borderTop: `1px solid ${palette.border}`,
            backgroundColor: palette.bgContainer,
          }}
        >
          업데이트 중...
        </div>
      )}
    </TableContainer>
  );
};

export default ExchangeRankingTable;
