'use client';

import React from 'react';
import { numberToKorean, rateCompareByOriginPrice } from '@/method';
import {
  TableCell,
  TableRow as StyledTableRow,
  ExpandableContent,
} from './styled';
import { dataListType, CoinDetail } from './types';

// 코인 상세 정보 컴포넌트 (메모이제이션으로 성능 최적화)
const CoinDetailView = React.memo(
  ({ coinDetail }: { coinDetail: CoinDetail }) => (
    <div
      style={{
        padding: '20px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '15px',
          }}
        >
          <img
            src={coinDetail.logo}
            alt={coinDetail.symbol}
            loading="lazy"
            style={{
              width: '48px',
              height: '48px',
              marginRight: '15px',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div>
            <h3 style={{ margin: '0', color: '#45E8BC' }}>{coinDetail.name}</h3>
            <p style={{ margin: '0', color: 'gray' }}>{coinDetail.symbol}</p>
          </div>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>순위:</strong> #
          {coinDetail.rank ? coinDetail.rank.toLocaleString() : '정보 없음'}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>최대 공급량:</strong>{' '}
          {coinDetail.maxSupply !== '0'
            ? Number(coinDetail.maxSupply).toLocaleString()
            : '∞'}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>총 공급량:</strong>{' '}
          {coinDetail.totalSupply
            ? Number(coinDetail.totalSupply).toLocaleString()
            : '정보 없음'}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>유통량:</strong>{' '}
          {coinDetail.circulatingSupply
            ? Number(coinDetail.circulatingSupply).toLocaleString()
            : '정보 없음'}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>시가총액:</strong>{' '}
          {coinDetail.marketCap
            ? numberToKorean(Number(coinDetail.marketCap)) + '원'
            : '정보 없음'}
        </div>
      </div>

      <div>
        <div style={{ marginBottom: '15px' }}>
          <strong>플랫폼:</strong>
          <div style={{ marginTop: '5px' }}>
            {coinDetail.platforms.length !== 0
              ? coinDetail.platforms.map((platform, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'inline-block',
                      background: '#333',
                      padding: '4px 8px',
                      margin: '2px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                    }}
                  >
                    {platform}
                  </span>
                ))
              : '메인넷'}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <strong>탐색기 링크:</strong>
          <div style={{ marginTop: '5px' }}>
            {coinDetail.explorerUrl.map((url, index) => (
              <div key={index} style={{ marginBottom: '2px' }}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={url}
                  style={{
                    color: '#45E8BC',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    display: 'block',
                    wordBreak: 'break-all',
                  }}
                >
                  {url.length > 30 ? `${url.substring(0, 30)}...` : url}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'gray' }}>
          <strong>마지막 업데이트:</strong>{' '}
          {new Date(coinDetail.lastUpdated).toLocaleString('ko-KR')}
        </div>
      </div>
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
    return { color: 'red' };
  } else {
    return { color: 'white' };
  }
};

const priceChangeStyle = (prev: number, cur: number) => {
  if (prev === undefined)
    return { transition: 'background-color 0.4s ease-in-out' };
  if (prev < cur) {
    return {
      backgroundColor: 'rgba(0, 255, 0, 0.3)',
      transition: 'background-color 0.4s ease-in-out',
    };
  } else if (prev > cur) {
    return {
      backgroundColor: 'rgba(255, 0, 0, 0.3)',
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
              <span>{data.trade_price?.toLocaleString()}</span>
              <span style={{ color: 'gray' }}>
                {data.trade_price && data.secondPrice
                  ? (() => {
                      const decimalPlaces =
                        data.trade_price.toString().split('.')[1]?.length || 1;

                      return data.secondPrice.toLocaleString(undefined, {
                        minimumFractionDigits: decimalPlaces,
                        maximumFractionDigits: decimalPlaces,
                      });
                    })()
                  : ''}
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
                <span>{(data.kimp * 100).toFixed(2)}%</span>
                <span style={{ color: 'gray' }}>
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
              <span>{(data.change_rate * 10).toFixed(2)}%</span>
              <span style={{ color: 'gray' }}>
                {data.opening_price?.toLocaleString()}
              </span>
            </div>
          </TableCell>
          {/* 52주 고가 */}
          <TableCell>
            <div>
              {data.highest_price !== 0
                ? data.highest_price.toLocaleString() + '원'
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
                ? data.lowest_price.toLocaleString() + '원'
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
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <p>코인 정보를 불러오는 중...</p>
                  </div>
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
