import React, { useEffect } from 'react';
import { numberToKorean, rateCompareByOriginPrice } from '@/method';
import {
  TableCell,
  TableRow as StyledTableRow,
  ExpandableContent,
} from './styled';
import { dataListType } from './Row';

interface TableRowProps {
  token: string;
  data: dataListType;
  secondPrice: number;
  secondData: secondData;
  prevData: dataListType;
  expandedRow: string | null;
  fadeOutClass: string;
  onRowClick: (token: string) => void;
}

interface secondData {
  token: string;
  trade_price: number;
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
    secondPrice,
    secondData,
    prevData,
    expandedRow,
    fadeOutClass,
    onRowClick,
  }: TableRowProps) => {
    return (
      <React.Fragment>
        <StyledTableRow
          isExpanded={expandedRow === token}
          onClick={() => onRowClick(token)}
          className={fadeOutClass || ''}
          style={priceChangeStyle(prevData?.trade_price, data.trade_price)}
        >
          <TableCell>{data.token}</TableCell>
          {/* 코인 가격 */}
          <TableCell>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>{data.trade_price?.toLocaleString()}</span>
              <span style={{ color: 'gray' }}>
                {data.secondPrice
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
                <span>
                  {rateCompareByOriginPrice(data.kimp + 1).toFixed(2)}%
                </span>
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
            <div>{data.highest_price?.toLocaleString()}원</div>
            <div
              style={getChangeRateStyle(
                rateCompareByOriginPrice(data.trade_price / data.highest_price)
              )}
            >
              {(
                rateCompareByOriginPrice(
                  data.trade_price / data.highest_price
                ) * 100
              ).toFixed(2)}
              %
            </div>
          </TableCell>
          {/* 52주 저가 */}
          <TableCell>
            {data.lowest_price?.toLocaleString()}원
            <div
              style={getChangeRateStyle(
                rateCompareByOriginPrice(data.trade_price / data.lowest_price)
              )}
            >
              {(
                rateCompareByOriginPrice(data.trade_price / data.lowest_price) *
                100
              ).toFixed(2)}
              %
            </div>
          </TableCell>
          <TableCell style={{ fontSize: '0.6rem', color: 'gray' }}>
            {numberToKorean(data.acc_trade_price24 / 10000)}
          </TableCell>
        </StyledTableRow>
        {expandedRow === token && (
          <tr>
            <td colSpan={8}>
              <ExpandableContent isExpanded={expandedRow === token}>
                <p>Token: {token}</p>
                <p>추가정보:</p>
                <p>Hello world!</p>
              </ExpandableContent>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.data.trade_price === nextProps.data.trade_price &&
      prevProps.data.change_rate === nextProps.data.change_rate &&
      prevProps.data.highest_price === nextProps.data.highest_price &&
      prevProps.data.lowest_price === nextProps.data.lowest_price &&
      prevProps.data.opening_price === nextProps.data.opening_price &&
      prevProps.data.acc_trade_price24 === nextProps.data.acc_trade_price24 &&
      prevProps.expandedRow === nextProps.expandedRow &&
      prevProps.fadeOutClass === nextProps.fadeOutClass
    );
  }
);

export default TableRowComponent;
