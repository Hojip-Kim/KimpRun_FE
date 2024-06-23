'use client';

import Row from '@/components/Row';
import serverFetch from '@/server/fetch/server';
import React, { useEffect, useState } from 'react';

export const UpbitWebSocket = () => {
  const [dataList, setDataList] = useState({});
  const [dataset, setDataset] = useState({});

  const url = 'http://localhost:8080/market/first';
  const requestInit: RequestInit = {
    method: 'GET',
    headers: { 'Content-type': 'application/json' },
  };

  const fetchData = async () => {
    try {
      const result = await serverFetch(url, requestInit);
      if (result.ok) {
        const data = result.text;
        console.log(data);
        return data;
      } else {
        throw new Error('Error Occured');
      }
    } catch (error) {
      console.error(ErrorEvent);
      return null;
    }
  };

  const fetchDataAsync = async () => {
    try {
      const data = await fetchData();
      if (data) {
        setDataList(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataAsync();

    const ws = new WebSocket('ws://localhost:8080/websocket');

    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      if (dataList) {
        setDataset({
          token: parsedData.token,
          trade_price: parsedData.trade_price,
          trade_volume: parsedData.trade_volume,
          change_rate: parsedData.change_rate,
          highest_price: parsedData.highest_price,
          lowest_price: parsedData.lowest_price,
          opening_price: parsedData.opening_price,
          rate_change: parsedData.rate_change,
        });
      }
    };

    ws.onerror = (error) => {
      console.error('Websocket Error:', error);
      ws.close();
    };

    // Clean up the connection when component unmounts
    return () => ws.close();
  }, []);

  // console.log(dataList);

  // console.log(dataList);

  const dataTypes: String[] = [
    'token',
    'trade_price',
    'trade_volume',
    'change_rate',
    'highest_price',
    'lowest_price',
    'opening_price',
    'rate_change',
  ];

  const dataTitle: String[] = [
    '코인',
    '현재 가격',
    '거래량',
    '변동률(전가격대비)',
    '52주 고가',
    '52주 저가',
    '시가',
  ];

  return (
    <div>
      <Row
        title={dataTitle}
        dataList={dataList}
        dataTypes={dataTypes}
        dataset={dataset}
      />
    </div>
  );
};

export default UpbitWebSocket;
