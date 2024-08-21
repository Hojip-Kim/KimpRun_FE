'use client';

import React, { useEffect, useState } from 'react';
import './Row.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setTokenList } from '@/redux/redux';
import { numberToKorean, rateCompareByOriginPrice } from '@/method';

/*
    TODO : style component 적용
*/

interface RowType {
  title: any;
  tokenNameList: any;
  tokenDataList: any;
  dataTypes: any;
  dataset: any;
}

// dataList : 토큰 이름
// dataset : 실시간 토큰 데이터
const Row = ({
  title,
  tokenNameList,
  tokenDataList,
  dataTypes,
  dataset,
}: RowType) => {
  // values가 존재하지 않을 경우 빈 배열을 사용
  const [nameList, setNameList] = useState({});
  const [dataList, setDataList] = useState({});

  const [prevRowData, setPrevRowData] = useState({});
  const [rowData, setRowData] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: 'change_rate',
    direction: 'asc',
  });

  const [fadeOutClass, setFadeOutClass] = useState({});

  const dispatch: AppDispatch = useDispatch();

  const tokenList = useSelector((state: RootState) => state.token.tokenList);

  //TODO : tokenList (토큰 이름순서 변경) - redux 전역상태관리
  const updateTokenList = (newTokenList) => {
    dispatch(setTokenList(newTokenList));
  };

  const getChangeRateStyle = (rate, change?) => {
    if ((rate > 0 && change === 'RISE') || rate > 0) {
      return { color: '#45E8BC' };
    } else if ((rate < 0 && change === 'FALL') || rate < 0) {
      return { color: 'red' };
    } else {
      // console.log('change : ' + change);
      // console.log('rate : ' + rate);
      return { color: 'white' };
    }
  };

  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = Object.entries(rowData).sort((a, b) => {
      console.log(a[1][key], b[1][key]);
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

  /* 
  name의 [0] : index
  name의 [1] : token Name
  data의 [0] : index
  data의 [1] : token data
    */
  const dataMerge = (name: any, data: any) => {
    const mergeData = {};

    const nameKeys = Object.keys(name);

    for (let i = 0; i < nameKeys.length; i++) {
      mergeData[name[i]] = data[i];
    }
    setRowData(mergeData);
  };

  const priceChangeStyle = (prev: number, cur: number) => {
    if (prev === undefined)
      return { transition: 'background-color 0.4s ease-in-out' };
    if (prev < cur) {
      return {
        backgroundColor: 'rgba(0, 255, 0, 0.3)',
        transition: 'background-color 0.4s ease-in-out',
      }; // Green with opacity
    } else if (prev > cur) {
      return {
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        transition: 'background-color 0.4s ease-in-out',
      }; // Red with opacity
    } else {
      return { transition: 'background-color 0.4s ease-in-out' };
    }
  };

  useEffect(() => {
    if (tokenNameList && tokenDataList) {
      setNameList(tokenNameList);
      setDataList(tokenDataList);
    }
  }, [tokenNameList, tokenDataList]);

  useEffect(() => {
    if (nameList.length > 0 && dataList.length > 0) {
      dataMerge(nameList, dataList);
    }
  }, [nameList, dataList]);

  useEffect(() => {
    if (rowData && dataset) {
      setPrevRowData(rowData);
      setRowData((prevState) => {
        const newState = { ...prevState };

        Object.entries(dataset).forEach(([token, data]) => {
          newState[token] = data;
        });
        return newState;
      });

      const newFadeOutClass = {};
      Object.keys(dataset).forEach((token) => {
        const prev = prevRowData[token]?.trade_price;
        const cur = dataset[token].trade_price;
        if (prev !== undefined && prev !== cur) {
          newFadeOutClass[token] = 'fade-out';
        }
      });
      setFadeOutClass(newFadeOutClass);

      setTimeout(() => {
        setFadeOutClass({});
      }, 200);
    }
  }, [dataset]);

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
              {/* <th>거래량(개)</th> */}
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

              {/* {title.map((title) => (
                <th key={title}>
                  {title}{' '}
                  <a
                    className="sort-button"
                    onClick={() => sortData('change_rate')}
                  >
                    btn
                  </a>
                </th>
              ))} */}
            </tr>
          </thead>
          <tbody>
            {Object.entries(rowData).map(([token, data]) => (
              <tr
                key={token}
                className={`column ${fadeOutClass[token] || ''}`}
                style={priceChangeStyle(
                  prevRowData[token]?.trade_price,
                  data['trade_price']
                )}
              >
                <td>{data['token']}</td>
                <td>{data['trade_price']?.toLocaleString()}원</td>
                {/* <td>{data['trade_volume']}개</td> */}
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
                    {rateCompareByOriginPrice(
                      data['trade_price'] / data['highest_price']
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Row;
