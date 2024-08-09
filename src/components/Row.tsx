'use client';

import React, { useEffect, useState } from 'react';
import './Row.css';

/*
    TODO : style component 적용
*/

interface RowType {
  title: any;
  dataList: any;
  dataTypes: any;
  dataset: any;
}

const Row = ({ title, dataList, dataTypes, dataset }: RowType) => {
  // values가 존재하지 않을 경우 빈 배열을 사용
  //   console.log(dataset);
  const [rowData, setRowData] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: 'rate_change',
    direction: 'asc',
  });
  //   console.log(rowData);

  const getChangeRateStyle = (change_rate) => {
    if (change_rate === 'RISE') {
      return { color: 'green' };
    } else if (change_rate === 'FALL') {
      return { color: 'red' };
    } else {
      return { color: 'white' };
    }
  };

  const rateCondition = (string, rate) => {
    if (string === 'RISE') {
      return '+' + rate;
    } else if (string === 'FALL') {
      return '-' + rate;
    } else if (rate === 0 || string === 'EVEN') {
      return rate;
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

  useEffect(() => {
    setRowData(dataList);

    // console.log(rowData[dataset.token]);
    if (rowData && dataset) {
      const token = dataset.token;
      //   console.log(identifyData);
      const change_rate = dataset.change_rate;
      const highest_price = dataset.highest_price;
      const lowest_price = dataset.lowest_price;
      const opening_price = dataset.opening_price;
      const rate_change = dataset.rate_change;
      const trade_price = dataset.trade_price;
      const trade_volume = dataset.trade_volume;

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
        },
      }));
    }
  }, [dataList, dataset]);

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
              {title.map((title) => (
                <th key={title}>
                  {title}{' '}
                  <a
                    className="sort-button"
                    onClick={() => sortData('rate_change')}
                  >
                    btn
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(rowData).map(([token, data]) => (
              <tr key={token} className="column">
                <td>{data['token']}</td>
                <td>{data['trade_price']}</td>
                <td>{data['trade_volume']}</td>
                <td style={getChangeRateStyle(data.rate_change)}>
                  {rateCondition(data['rate_change'], data['change_rate'])}
                </td>
                <td>{data['highest_price']}</td>
                <td>{data['lowest_price']}</td>
                <td>{data['opening_price']}</td>

                {/* {dataTypes.map((type) => (
                <td
                  key={type}
                  style={{
                    textAlign: 'center',
                    border: '1px solid white',
                    width: '300px',
                    height: '30px',
                  }}
                >
                  {data[type]}
                </td>
              ))} */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Row;
