'use client';

import React, { useEffect, useState } from 'react';
import './Row.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setTokenFirstList } from '@/redux/reducer/tokenReducer';
import { numberToKorean, rateCompareByOriginPrice } from '@/method';
import { setTether } from '@/redux/reducer/infoReducer';
import { setToken } from '@/redux/reducer/widgetReduce';
import { firstDataSet, secondDataSet } from '@/app/page';
import { getRowData, updateRowData } from './rowDataFetch';

interface RowType {
  firstTokenNameList: string[];
  firstTokenDataList: any;
  firstDataset: { [key: string]: firstDataSet };
  secondDataset: { [key: string]: secondDataSet };
}

export type dataListType = {
  acc_trade_price24: number;
  change_rate: number;
  highest_price: number;
  lowest_price: number;
  opening_price: number;
  rate_change: number;
  token: string;
  trade_price: number;
  trade_volume: number;
};

const Row = ({
  firstTokenNameList,
  firstTokenDataList,
  firstDataset,
  secondDataset,
}: RowType) => {
  const [nameList, setNameList] = useState<string[]>([]);
  const [dataList, setDataList] = useState<dataListType[]>([]);

  const [prevRowData, setPrevRowData] = useState({});
  const [rowData, setRowData] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: 'change_rate',
    direction: 'asc',
  });

  const [fadeOutClass, setFadeOutClass] = useState({});

  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const dispatch: AppDispatch = useDispatch();

  const tether = useSelector((state: RootState) => state.info.tether);
  const updateTether = (tether) => {
    dispatch(setTether(tether));
  };

  const widgetToken = useSelector((state: RootState) => state.widget.token);

  const updateWidgetToken = (token) => {
    dispatch(setToken(token));
  };

  const updateTokenFirstList = (newTokenList) => {
    dispatch(setTokenFirstList(newTokenList));
  };

  const getChangeRateStyle = (rate, change?) => {
    if ((rate > 0 && change === 'RISE') || rate > 0) {
      return { color: '#45E8BC' };
    } else if ((rate < 0 && change === 'FALL') || rate < 0) {
      return { color: 'red' };
    } else {
      return { color: 'white' };
    }
  };

  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = Object.entries(rowData).sort((a, b) => {
      if (a[1][key] < b[1][key]) {
        return direction === 'asc' ? -1 : 1;
      } else if (a[1][key] > b[1][key]) {
        return direction === 'asc' ? 1 : -1;
      }

      return 0;
    });

    setRowData(Object.fromEntries(sortedData));
    setSortConfig({ key, direction });
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

  const rowClick = async (token: string) => {
    if (expandedRow === token) {
      setExpandedRow(null);
    } else {
      updateWidgetToken(token);
      setExpandedRow(token);
    }

    return;
  };

  useEffect(() => {
    if (firstTokenNameList && firstTokenDataList) {
      setNameList(firstTokenNameList);
      setDataList(firstTokenDataList);
    }
  }, [firstTokenNameList, firstTokenDataList]);

  useEffect(() => {
    if (nameList.length > 0 && dataList.length > 0) {
      getRowData(nameList, dataList).then(setRowData);
    }
  }, [nameList, dataList]);

  useEffect(() => {
    if (rowData && firstDataset && secondDataset) {
      setPrevRowData(rowData);

      updateRowData(rowData, firstDataset, secondDataset, tether).then((updatedData) => {
        setRowData(updatedData);

        const newFadeOutClass = {};
        Object.keys(firstDataset).forEach((token) => {
          if (token != 'USDT') {
            const prev = prevRowData[token]?.trade_price;
            const cur = firstDataset[token].trade_price;
            if (prev !== undefined && prev !== cur) {
              newFadeOutClass[token] = 'fade-out';
            }
          } else {
            updateTether(firstDataset[token].trade_price);
          }
        });
        setFadeOutClass(newFadeOutClass);

        setTimeout(() => {
          setFadeOutClass({});
        }, 200);
      });
    }
  }, [firstDataset, secondDataset]);

  return (
    <div className="row-container">
      <div className="table-wrapped">
        <table className="table-m1">
          <thead>
            <tr className="tb-header-container">
              <th>코인</th>
              <th>
                현재가격
                <a
                  className="sort-button"
                  onClick={() => sortData('trade_price')}
                >
                  btn
                </a>
              </th>
              <th>
                변동률(전일대비)
                <a
                  className="sort-button"
                  onClick={() => sortData('change_rate')}
                >
                  btn
                </a>
              </th>
              <th>52주 고가</th>
              <th>52주 저가</th>
              <th>장 시작가</th>
              <th>
                누적 거래액
                <a
                  className="sort-button"
                  onClick={() => sortData('acc_trade_price24')}
                >
                  btn
                </a>
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(rowData).map(([token, data]) => (
              <React.Fragment key={token}>
                <tr
                  onClick={() => {
                    rowClick(token);
                  }}
                  key={token}
                  className={`column ${fadeOutClass[token] || ''}`}
                  style={priceChangeStyle(
                    prevRowData[token]?.trade_price,
                    data['trade_price']
                  )}
                >
                  <td>{data['token']}</td>
                  <td>
                    {data['trade_price']?.toLocaleString()}원
                    <p className="comparison-group">
                      원
                    </p>
                  </td>
                  <td
                    style={getChangeRateStyle(
                      data['change_rate'],
                      data['rate_change']
                    )}
                  >
                    {(data['change_rate'] * 10).toFixed(2)}%
                  </td>
                  <td>
                    <div>{data['highest_price']?.toLocaleString()}원</div>
                    <div
                      className="rate_per_52week"
                      style={getChangeRateStyle(
                        rateCompareByOriginPrice(
                          data['trade_price'] / data['highest_price']
                        )
                      )}
                    >
                      {(
                        rateCompareByOriginPrice(
                          data['trade_price'] / data['highest_price']
                        ) * 100
                      ).toFixed(2)}
                      %
                    </div>
                  </td>
                  <td>{data['lowest_price']?.toLocaleString()}원</td>
                  <td>{data['opening_price']?.toLocaleString()}원</td>
                  <td style={{ fontSize: '0.6rem', color: 'gray' }}>
                    {numberToKorean(data['acc_trade_price24'] / 10000)}
                  </td>
                </tr>
                {expandedRow === token && (
                  <tr>
                    <td colSpan={7}>
                      <div
                        className={`expandable-content ${
                          expandedRow === token ? 'expanded' : ''
                        }`}
                        style={{
                          backgroundColor: 'gray',
                          padding: '10px',
                          border: '1px solid #dee2e6',
                          borderRadius: '4px',
                          height: expandedRow === token ? 'auto' : '0',
                        }}
                      >
                        <p>Token : {token}</p>
                        <p>추가정보 : </p>
                        <p> Hello world!</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Row;