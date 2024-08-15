'use client';

import React, { useEffect, useState } from 'react';
import './Row.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setTokenList } from '@/redux/redux';
import { numberToKorean } from '@/method';

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

  const [rowData, setRowData] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: 'change_rate',
    direction: 'asc',
  });

  const dispatch: AppDispatch = useDispatch();

  const tokenList = useSelector((state: RootState) => state.token.tokenList);

  //TODO : tokenList (토큰 이름순서 변경) - redux 전역상태관리
  const updateTokenList = (newTokenList) => {
    dispatch(setTokenList(newTokenList));
  };

  const getChangeRateStyle = (change, rate) => {
    if (rate > 0 && change === 'RISE') {
      return { color: 'green' };
    } else if (rate < 0 && change === 'FALL') {
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
      const token = dataset.token;
      const change_rate = dataset.change_rate;
      const highest_price = dataset.highest_price;
      const lowest_price = dataset.lowest_price;
      const opening_price = dataset.opening_price;
      const rate_change = dataset.rate_change;
      const trade_price = dataset.trade_price;
      const trade_volume = dataset.trade_volume;
      const acc_trade_price24 = dataset.acc_trade_price24;

      setRowData((prevState) => ({
        ...prevState,
        [token]: {
          token,
          trade_price,
          trade_volume,
          change_rate,
          highest_price,
          lowest_price,
          opening_price,
          rate_change,
          acc_trade_price24,
        },
      }));
    }
  }, [dataset]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '8px',
        borderBottom: '1px solid #ccc',
        fontSize: '0.8rem',
        border: '1px solid white',
      }}
    >
      <div className="table-wrapped">
        <table className="table-m1">
          <thead>
            <tr>
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
              <tr key={token} className="column">
                <td>{data['token']}</td>
                <td>{data['trade_price']}원</td>
                {/* <td>{data['trade_volume']}개</td> */}
                <td
                  style={getChangeRateStyle(
                    data['rate_change'],
                    data['change_rate']
                  )}
                >
                  {data['change_rate']}%
                </td>
                <td>{data['highest_price']}원</td>
                <td>{data['lowest_price']}원</td>
                <td>{data['opening_price']}원</td>
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
