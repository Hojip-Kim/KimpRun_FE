'use client';

import React from 'react';
import { numberToKorean, rateCompareByOriginPrice } from '@/method';
import { formatPrice, formatPercentage } from '@/utils/priceUtils';
import {
  TableCell,
  TableRow as StyledTableRow,
  ExpandableContent,
} from './styled';
import { dataListType, CoinDetail } from './types';
import { CoinDetailSkeleton } from '@/components/skeleton/Skeleton';

// 코인 상세 정보 컴포넌트 (메모이제이션으로 성능 최적화)
const CoinDetailView = React.memo(
  ({ coinDetail }: { coinDetail: CoinDetail }) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr 1fr',
        gridTemplateRows: 'auto auto',
        gap: '1rem',
        padding: '0.5rem',
        alignItems: 'flex-start',
        fontSize: '0.75rem',
      }}
      className="coin-detail-responsive"
    >
      {/* 코인 로고와 기본 정보 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: '80px',
        }}
      >
        <img
          src={coinDetail.logo}
          alt={coinDetail.symbol}
          loading="lazy"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            marginBottom: '0.4rem',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div style={{ textAlign: 'center' }}>
          <h3
            style={{
              margin: '0 0 0.25rem 0',
              color: 'var(--accent)',
              fontSize: '0.85rem',
              fontWeight: '600',
            }}
          >
            {coinDetail.name}
          </h3>
          <p
            style={{
              margin: '0',
              color: 'var(--text-muted)',
              fontSize: '0.7rem',
              fontWeight: '500',
            }}
          >
            {coinDetail.symbol}
          </p>
          <p
            style={{
              margin: '0.25rem 0 0 0',
              color: 'var(--text-secondary)',
              fontSize: '0.65rem',
            }}
          >
            #{coinDetail.rank ? coinDetail.rank.toLocaleString() : '정보 없음'}
          </p>
        </div>
      </div>

      {/* 공급량 정보 */}
      <div>
        <h4
          style={{
            margin: '0 0 0.75rem 0',
            color: 'var(--accent)',
            fontSize: '0.8rem',
            fontWeight: '600',
          }}
        >
          공급량 정보
        </h4>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}
          className="supply-info-container"
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}
            >
              최대 공급량
            </span>
            <span
              style={{
                color: 'var(--text-primary)',
                fontSize: '0.7rem',
                fontWeight: '600',
              }}
            >
              {coinDetail.maxSupply !== '0'
                ? Number(coinDetail.maxSupply).toLocaleString()
                : '무제한'}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}
            >
              총 공급량
            </span>
            <span
              style={{
                color: 'var(--text-primary)',
                fontSize: '0.7rem',
                fontWeight: '600',
              }}
            >
              {coinDetail.totalSupply
                ? Number(coinDetail.totalSupply).toLocaleString()
                : '정보 없음'}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}
            >
              유통 공급량
            </span>
            <span
              style={{
                color: 'var(--text-primary)',
                fontSize: '0.7rem',
                fontWeight: '600',
              }}
            >
              {coinDetail.circulatingSupply
                ? Number(coinDetail.circulatingSupply).toLocaleString()
                : '정보 없음'}
            </span>
          </div>
        </div>
      </div>

      {/* 시장 정보 */}
      <div>
        <h4
          style={{
            margin: '0 0 0.75rem 0',
            color: 'var(--accent)',
            fontSize: '0.8rem',
            fontWeight: '600',
          }}
        >
          시장 정보
        </h4>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}
            >
              시가총액
            </span>
            <span
              style={{
                color: 'var(--text-primary)',
                fontSize: '0.7rem',
                fontWeight: '600',
              }}
            >
              {coinDetail.marketCap
                ? numberToKorean(Number(coinDetail.marketCap)) + '원'
                : '정보 없음'}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}
            >
              업데이트
            </span>
            <span
              style={{
                color: 'var(--text-primary)',
                fontSize: '0.7rem',
                fontWeight: '600',
              }}
            >
              {new Date(coinDetail.lastUpdated).toLocaleDateString('ko-KR')}
            </span>
          </div>
        </div>

        {/* 플랫폼 태그 - 컴팩트하게 */}
        {coinDetail.platforms.length > 0 && (
          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ marginBottom: '0.25rem' }}>
              <span
                style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}
              >
                플랫폼
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {coinDetail.platforms.slice(0, 3).map((platform, index) => (
                <span
                  key={index}
                  style={{
                    display: 'inline-block',
                    background: 'var(--input)',
                    color: 'var(--text-primary)',
                    padding: '0.2rem 0.4rem',
                    borderRadius: '3px',
                    fontSize: '0.6rem',
                    border: '1px solid var(--border)',
                  }}
                >
                  {platform}
                </span>
              ))}
              {coinDetail.platforms.length > 3 && (
                <span
                  style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}
                >
                  +{coinDetail.platforms.length - 3}개
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 탐색기 링크 - 전체 너비 차지 */}
      {coinDetail.explorerUrl && coinDetail.explorerUrl.length > 0 && (
        <div
          style={{
            gridColumn: '1 / -1',
            marginTop: '0.5rem',
            paddingTop: '0.75rem',
            borderTop: `1px solid var(--border)`,
          }}
        >
          <div style={{ marginBottom: '0.5rem' }}>
            <span
              style={{
                color: 'var(--accent)',
                fontSize: '0.75rem',
                fontWeight: '600',
              }}
            >
              탐색기 링크
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {coinDetail.explorerUrl.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  fontSize: '0.7rem',
                  padding: '0.3rem 0.6rem',
                  background: 'var(--accent-ring)',
                  borderRadius: '4px',
                  border: '1px solid var(--accent)',
                  opacity: 0.8,
                  transition: 'all 0.2s ease',
                  fontWeight: '500',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.8';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {new URL(url).hostname.replace('www.', '')}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
);

interface TableRowProps {
  token: string;
  data: dataListType;
  prevData: dataListType;
  expandedRow: string | null;
  fadeOutClass: string;
  onRowClick: (token: string) => void;
  coinDetail?: CoinDetail;
  loadingCoinDetail?: boolean;
}


const getChangeRateStyle = (rate, change?) => {
  if ((rate > 0 && change === 'RISE') || rate > 0) {
    return { color: '#45E8BC' };
  } else if ((rate < 0 && change === 'FALL') || rate < 0) {
    return { color: '#ef4444' };
  } else {
    return { color: 'var(--text-primary)' };
  }
};

const priceChangeStyle = (prev: number, cur: number) => {
  if (prev === undefined)
    return { transition: 'background-color 0.4s ease-in-out' };
  if (prev < cur) {
    return {
      backgroundColor: 'rgba(69, 232, 188, 0.2)',
      transition: 'background-color 0.4s ease-in-out',
    };
  } else if (prev > cur) {
    return {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      transition: 'background-color 0.4s ease-in-out',
    };
  } else {
    return { transition: 'background-color 0.4s ease-in-out' };
  }
};
const TableRowComponent = React.memo(
  ({
    token,
    data,
    prevData,
    expandedRow,
    fadeOutClass,
    onRowClick,
    coinDetail,
    loadingCoinDetail,
  }: TableRowProps) => {
    return (
      <React.Fragment>
        <StyledTableRow
          $isExpanded={expandedRow === token}
          onClick={() => {
            onRowClick(token);
          }}
          className={fadeOutClass || ''}
          style={priceChangeStyle(prevData?.trade_price, data.trade_price)}
        >
          <TableCell>{data.token}</TableCell>
          {/* 코인 가격 */}
          <TableCell>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>
                {data.trade_price ? formatPrice(data.trade_price) : ''}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>
                {data.secondPrice ? formatPrice(data.secondPrice) : ''}
              </span>
            </div>
          </TableCell>
          {/* 김프 */}
          <TableCell
            style={getChangeRateStyle(
              rateCompareByOriginPrice(data.trade_price / data.secondPrice)
            )}
          >
            {data.secondPrice ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>{formatPercentage(data.kimp)}</span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {(() => {
                    const priceDiff = Math.abs(
                      data.trade_price - data.secondPrice
                    );

                    if (priceDiff >= 1) {
                      return priceDiff.toFixed(2);
                    }

                    return parseFloat(priceDiff.toPrecision(2)).toString();
                  })()}
                </span>
              </div>
            ) : (
              ''
            )}
          </TableCell>
          {/* 변동률 */}
          <TableCell
            style={getChangeRateStyle(data.change_rate, data.rate_change)}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>{formatPercentage(data.change_rate * 10)}</span>
              <span style={{ color: 'var(--text-muted)' }}>
                {data.opening_price ? formatPrice(data.opening_price) : ''}
              </span>
            </div>
          </TableCell>
          {/* 52주 고가 */}
          <TableCell>
            <div>
              {data.highest_price !== 0
                ? formatPrice(data.highest_price) + '원'
                : '정보 없음'}
            </div>
            <div
              style={getChangeRateStyle(
                rateCompareByOriginPrice(data.trade_price / data.highest_price)
              )}
            >
              {data.highest_price
                ? (
                    rateCompareByOriginPrice(
                      data.trade_price / data.highest_price
                    ) * 100
                  ).toFixed(2) + '%'
                : ''}
            </div>
          </TableCell>
          {/* 52주 저가 */}
          <TableCell>
            <div>
              {data.lowest_price !== 0
                ? formatPrice(data.lowest_price) + '원'
                : '정보 없음'}
            </div>
            <div
              style={getChangeRateStyle(
                rateCompareByOriginPrice(data.trade_price / data.lowest_price)
              )}
            >
              {data.lowest_price
                ? (
                    rateCompareByOriginPrice(
                      data.trade_price / data.lowest_price
                    ) * 100
                  ).toFixed(2) + '%'
                : ''}
            </div>
          </TableCell>
          <TableCell style={{ fontSize: '0.6rem', color: 'gray' }}>
            {numberToKorean(data.acc_trade_price24) + '원'}
          </TableCell>
        </StyledTableRow>
        {expandedRow === token && (
          <tr>
            <td colSpan={8}>
              <ExpandableContent $isExpanded={expandedRow === token}>
                {loadingCoinDetail ? (
                  <CoinDetailSkeleton />
                ) : coinDetail ? (
                  <CoinDetailView coinDetail={coinDetail} />
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <p>코인 정보를 불러올 수 없습니다.</p>
                  </div>
                )}
              </ExpandableContent>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  },
  (prevProps, nextProps) => {
    const shouldUpdate = !(
      prevProps.data.trade_price === nextProps.data.trade_price &&
      prevProps.data.change_rate === nextProps.data.change_rate &&
      prevProps.data.highest_price === nextProps.data.highest_price &&
      prevProps.data.lowest_price === nextProps.data.lowest_price &&
      prevProps.data.opening_price === nextProps.data.opening_price &&
      prevProps.data.acc_trade_price24 === nextProps.data.acc_trade_price24 &&
      prevProps.expandedRow === nextProps.expandedRow &&
      prevProps.fadeOutClass === nextProps.fadeOutClass &&
      prevProps.coinDetail === nextProps.coinDetail &&
      prevProps.loadingCoinDetail === nextProps.loadingCoinDetail &&
      prevProps.onRowClick === nextProps.onRowClick
    );

    return !shouldUpdate;
  }
);

export default TableRowComponent;
