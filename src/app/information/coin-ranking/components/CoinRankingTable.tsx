'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { cardStyle } from '@/components/styled/common';
import { palette } from '@/styles/palette';
import { CoinRankingItem, CoinRankingRowProps } from '@/types/coinRanking';
import { numberToKorean } from '@/method/common_method';
import { formatCryptoPrice } from '@/utils/priceUtils';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const TableContainer = styled.div`
  ${cardStyle}
  overflow: hidden;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    overflow-x: hidden;
    width: 100%;
    max-width: 100%;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  line-height: 1.3;
  
  @media (max-width: 768px) {
    table-layout: fixed;
    width: 100%;
    max-width: 100%;
  }
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

const TableBody = styled.tbody`
  background: ${palette.card};
`;

const RankHeaderCell = styled(TableHeaderCell)`
  width: 50px;
  text-align: center;

  @media (max-width: 768px) {
    width: 35px;
  }
`;

const CoinCell = styled(TableHeaderCell)`
  min-width: 160px;

  @media (max-width: 768px) {
    min-width: 110px;
  }
`;

const PriceCell = styled(TableHeaderCell)`
  min-width: 100px;
  text-align: right;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SupplyCell = styled(TableHeaderCell)`
  min-width: 110px;
  text-align: right;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MarketCapCell = styled(TableHeaderCell)`
  min-width: 120px;
  text-align: right;
  font-weight: 700;

  @media (max-width: 768px) {
    min-width: 100px;
  }
`;

const DominanceCell = styled(TableHeaderCell)`
  min-width: 85px;
  text-align: right;
  font-weight: 700;

  @media (max-width: 768px) {
    min-width: 70px;
    font-size: 0.7rem;
  }
`;

// 테이블 행 컴포넌트들
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

const CoinInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CoinLogo = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;

const CoinNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const CoinName = styled.div`
  font-weight: 600;
  color: ${palette.textPrimary};
  font-size: 0.85rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const CoinSymbol = styled.div`
  font-size: 0.7rem;
  color: ${palette.textMuted};
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
`;

const PriceTableCell = styled(TableCell)`
  text-align: right;
  font-weight: 600;
  font-family: 'Courier New', monospace;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SupplyTableCell = styled(TableCell)`
  text-align: right;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MarketCapTableCell = styled(TableCell)`
  text-align: right;
  font-family: 'Courier New', monospace;
  font-weight: 700;
  font-size: 0.8rem;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const DominanceTableCell = styled(TableCell)`
  text-align: right;
  font-family: 'Courier New', monospace;
  font-weight: 700;
  font-size: 0.8rem;

  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
`;

const ExpandableRow = styled.tr<{ $isExpanded: boolean }>`
  ${({ $isExpanded }) => !$isExpanded && 'display: none;'}
`;

const ExpandableContent = styled.td`
  padding: 1.5rem;
  border: none;
  background: ${palette.bgPage};
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      max-height: 0;
    }
    to {
      opacity: 1;
      max-height: 500px;
    }
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    overflow: hidden;
    width: 100vw;
    max-width: calc(100vw - 1.5rem);
    box-sizing: border-box;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 1rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0.5rem 0;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    min-width: 0;
  }
`;

const DetailSection = styled.div`
  min-width: 0;
  
  h4 {
    margin: 0 0 1rem 0;
    color: ${palette.accent};
  }
  
  @media (max-width: 768px) {
    h4 {
      font-size: 1rem;
    }
  }
`;

const DetailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
`;

const DetailLabel = styled.span`
  color: ${palette.textSecondary};
`;

const DetailValue = styled.span`
  color: ${palette.textPrimary};
  
  @media (max-width: 768px) {
    word-break: break-all;
    text-align: right;
    min-width: 0;
  }
`;

const DescriptionSection = styled.div`
  grid-column: 1 / -1;
  margin-top: 1rem;
  min-width: 0;

  h4 {
    margin: 0 0 0.5rem 0;
    color: ${palette.accent};
  }

  p {
    color: ${palette.textSecondary};
    line-height: 1.6;
    margin: 0;
  }

  @media (max-width: 768px) {
    h4 {
      font-size: 0.9rem;
    }
    
    p {
      font-size: 0.8rem;
      word-break: break-word;
      overflow-wrap: break-word;
      min-width: 0;
    }
  }
`;

const ExplorerSection = styled.div`
  margin-top: 1rem;

  span {
    color: ${palette.textSecondary};
    
    @media (max-width: 768px) {
      font-size: 0.7rem;
    }
  }

  a {
    color: ${palette.accent};
    text-decoration: none;
    margin-right: 0.5rem;
    
    @media (max-width: 768px) {
      font-size: 0.7rem;
      display: inline-block;
      margin-bottom: 0.25rem;
      word-break: break-all;
    }
  }
`;

// 유틸리티 함수들

const formatMarketCap = (
  marketCap: string,
  dollarRate: number
): React.ReactNode => {
  if (!marketCap || marketCap === '0' || marketCap === 'null') {
    return '정보없음';
  }

  const numMarketCap = parseFloat(marketCap) * dollarRate; // 달러 환율 곱하기
  if (isNaN(numMarketCap) || numMarketCap <= 0) {
    return '정보없음';
  }

  // 매우 큰 숫자들을 위한 단위 추가
  if (numMarketCap >= 1e18) {
    const value = (numMarketCap / 1e18).toFixed(2);
    return (
      <>
        ${value}
        <span style={{ color: palette.accent }}>Qi</span>
      </>
    );
  } else if (numMarketCap >= 1e15) {
    const value = (numMarketCap / 1e15).toFixed(2);
    return (
      <>
        ${value}
        <span style={{ color: palette.accent }}>Qa</span>
      </>
    );
  } else if (numMarketCap >= 1e12) {
    const value = (numMarketCap / 1e12).toFixed(2);
    return (
      <>
        ${value}
        <span style={{ color: palette.accent }}>T</span>
      </>
    );
  } else if (numMarketCap >= 1e9) {
    const value = (numMarketCap / 1e9).toFixed(2);
    return (
      <>
        ${value}
        <span style={{ color: palette.accent }}>B</span>
      </>
    );
  } else if (numMarketCap >= 1e6) {
    const value = (numMarketCap / 1e6).toFixed(2);
    return (
      <>
        ${value}
        <span style={{ color: palette.accent }}>M</span>
      </>
    );
  } else if (numMarketCap >= 1e3) {
    const value = (numMarketCap / 1e3).toFixed(2);
    return (
      <>
        ${value}
        <span style={{ color: palette.accent }}>K</span>
      </>
    );
  } else {
    return `$${numMarketCap.toFixed(2)}`;
  }
};

// 공급량 포맷팅 함수 (테이블용 - 축약형) - JSX 반환
const formatSupply = (supply: string): React.ReactNode => {
  if (!supply || supply === '0' || supply === 'null') {
    return '무제한';
  }

  const num = parseFloat(supply);
  if (isNaN(num) || num <= 0) {
    return '무제한';
  }

  // 매우 큰 숫자들을 위한 단위 추가
  if (num >= 1e18) {
    const value = (num / 1e18).toFixed(1);
    return (
      <>
        {value}
        <span style={{ color: palette.accent }}>Qi</span>
      </>
    );
  } else if (num >= 1e15) {
    const value = (num / 1e15).toFixed(1);
    return (
      <>
        {value}
        <span style={{ color: palette.accent }}>Qa</span>
      </>
    );
  } else if (num >= 1e12) {
    const value = (num / 1e12).toFixed(1);
    return (
      <>
        {value}
        <span style={{ color: palette.accent }}>T</span>
      </>
    );
  } else if (num >= 1e9) {
    const value = (num / 1e9).toFixed(1);
    return (
      <>
        {value}
        <span style={{ color: palette.accent }}>B</span>
      </>
    );
  } else if (num >= 1e6) {
    const value = (num / 1e6).toFixed(1);
    return (
      <>
        {value}
        <span style={{ color: palette.accent }}>M</span>
      </>
    );
  } else if (num >= 1e3) {
    const value = (num / 1e3).toFixed(1);
    return (
      <>
        {value}
        <span style={{ color: palette.accent }}>K</span>
      </>
    );
  } else {
    return num.toLocaleString();
  }
};

// 공급량 포맷팅 함수 (세부 정보용 - 전체 숫자)
const formatSupplyDetail = (supply: string): string => {
  if (!supply || supply === '0' || supply === 'null') {
    return '무제한';
  }

  const num = parseFloat(supply);
  if (isNaN(num) || num <= 0) {
    return '무제한';
  }

  return Math.floor(num).toLocaleString(); // 소수점 제거하고 천 단위 구분자 추가
};

// 시가총액을 한국어 단위로 포맷팅하는 함수 (만원 단위까지만)
const formatMarketCapToWon = (
  marketCap: string,
  dollarRate: number
): string => {
  if (!marketCap || marketCap === '0' || marketCap === 'null') {
    return '정보 없음';
  }

  const numMarketCap = parseFloat(marketCap) * dollarRate;
  if (isNaN(numMarketCap) || numMarketCap <= 0) {
    return '정보 없음';
  }

  // 만원 단위로 반올림 (10,000으로 나눈 후 반올림하고 다시 곱하기)
  const roundedToManWon = Math.round(numMarketCap / 10000) * 10000;
  return numberToKorean(roundedToManWon) + '원';
};

// 코인 세부 정보 컴포넌트
const CoinDetailExpanded: React.FC<{
  coin: CoinRankingItem;
  dollarRate: number;
}> = ({ coin, dollarRate }) => {
  return (
    <DetailGrid>
      <DetailSection>
        <h4>공급량 정보</h4>
        <DetailList>
          <DetailItem>
            <DetailLabel>최대 공급량:</DetailLabel>
            <DetailValue>{formatSupplyDetail(coin.maxSupply)}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>총 공급량:</DetailLabel>
            <DetailValue>{formatSupplyDetail(coin.totalSupply)}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>유통 공급량:</DetailLabel>
            <DetailValue>{formatSupplyDetail(coin.circulatingSupply)}</DetailValue>
          </DetailItem>
        </DetailList>
      </DetailSection>
      
      <DetailSection>
        <h4>시장 정보</h4>
        <DetailList>
          <DetailItem>
            <DetailLabel>시가총액:</DetailLabel>
            <DetailValue>{formatMarketCapToWon(coin.marketCap, dollarRate)}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>도미넌스:</DetailLabel>
            <DetailValue>
              {coin.dominance !== null && coin.dominance !== undefined
                ? `${coin.dominance.toFixed(2)}%`
                : '정보없음'}
            </DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>출시일:</DetailLabel>
            <DetailValue>
              {coin.dateAdded
                ? (() => {
                    try {
                      return new Date(coin.dateAdded).toLocaleDateString('ko-KR');
                    } catch {
                      return '정보 없음';
                    }
                  })()
                : '정보 없음'}
            </DetailValue>
          </DetailItem>
        </DetailList>
      </DetailSection>
      
      <DescriptionSection>
        <h4>프로젝트 소개</h4>
        <p>{coin.description}</p>
        {coin.explorerUrl && coin.explorerUrl.length > 0 && (
          <ExplorerSection>
            <span>탐색기: </span>
            {coin.explorerUrl.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {new URL(url).hostname}
              </a>
            ))}
          </ExplorerSection>
        )}
      </DescriptionSection>
    </DetailGrid>
  );
};

// 테이블 행 컴포넌트
const CoinTableRow: React.FC<CoinRankingRowProps & { dollarRate: number }> = ({
  coin,
  isExpanded,
  onClick,
  dollarRate,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return (
    <>
      <TableRow $isExpanded={isExpanded} onClick={onClick}>
        <RankCell>#{coin.rank}</RankCell>
        <TableCell>
          <CoinInfo>
            <CoinLogo
              src={coin.logo}
              alt={`${coin.name} logo`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.png';
              }}
            />
            <CoinNameContainer>
              <CoinName>{coin.name}</CoinName>
              <CoinSymbol>{coin.symbol}</CoinSymbol>
            </CoinNameContainer>
          </CoinInfo>
        </TableCell>
        <PriceTableCell>
          $
          {(() => {
            if (
              !coin.marketCap ||
              !coin.circulatingSupply ||
              coin.marketCap === 'null' ||
              coin.circulatingSupply === 'null'
            ) {
              return '정보없음';
            }

            const marketCap = parseFloat(coin.marketCap); // 달러 환율 제거
            const circulatingSupply = parseFloat(coin.circulatingSupply);

            if (
              isNaN(marketCap) ||
              isNaN(circulatingSupply) ||
              marketCap <= 0 ||
              circulatingSupply <= 0
            ) {
              return '정보없음';
            }

            const price = marketCap / circulatingSupply;
            return formatCryptoPrice(price.toString());
          })()}
        </PriceTableCell>
        <SupplyTableCell>{formatSupply(coin.maxSupply)}</SupplyTableCell>
        <MarketCapTableCell>
          {formatMarketCap(coin.marketCap, dollarRate)}
        </MarketCapTableCell>
        <DominanceTableCell>
          {coin.dominance !== null && coin.dominance !== undefined
            ? `${coin.dominance.toFixed(2)}%`
            : '정보없음'}
        </DominanceTableCell>
      </TableRow>
      <ExpandableRow $isExpanded={isExpanded}>
        <ExpandableContent colSpan={isMobile ? 4 : 6}>
          {isExpanded && (
            <div style={{ 
              width: '100%', 
              maxWidth: '100%', 
              overflow: 'hidden',
              boxSizing: 'border-box'
            }}>
              <CoinDetailExpanded coin={coin} dollarRate={dollarRate} />
            </div>
          )}
        </ExpandableContent>
      </ExpandableRow>
    </>
  );
};

interface CoinRankingTableProps {
  coins: CoinRankingItem[];
  loading?: boolean;
}

const CoinRankingTable: React.FC<CoinRankingTableProps> = ({
  coins,
  loading = false,
}) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const dollarRate = useSelector((state: RootState) => state.info.dollar);

  const handleRowClick = (symbol: string) => {
    setExpandedRow(expandedRow === symbol ? null : symbol);
  };

  if (loading) {
    return (
      <TableContainer>
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            color: palette.textMuted,
          }}
        >
          코인 데이터를 불러오는 중...
        </div>
      </TableContainer>
    );
  }

  if (!coins || coins.length === 0) {
    return (
      <TableContainer>
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            color: palette.textMuted,
          }}
        >
          코인 데이터가 없습니다.
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
            <CoinCell>코인</CoinCell>
            <PriceCell>가격 (USD)</PriceCell>
            <SupplyCell>최대공급량</SupplyCell>
            <MarketCapCell>시가총액</MarketCapCell>
            <DominanceCell>도미넌스</DominanceCell>
          </tr>
        </TableHeader>
        <TableBody>
          {coins.map((coin) => (
            <CoinTableRow
              key={coin.symbol}
              coin={coin}
              isExpanded={expandedRow === coin.symbol}
              onClick={() => handleRowClick(coin.symbol)}
              dollarRate={dollarRate}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CoinRankingTable;
