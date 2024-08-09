'use client';

import Row from '@/components/Row';
import { setTokenDataset, setTokenList } from '@/redux/redux';
import { AppDispatch, RootState } from '@/redux/store';
import serverFetch from '@/server/fetch/server';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const UpbitWebSocket = () => {
  // state
  const [dataList, setDataList] = useState({});
  const [dataset, setDataset] = useState({});

  // redux
  const dispatch: AppDispatch = useDispatch();
  const tokenList = useSelector((state: RootState) => state.token.tokenList);
  const tokenSet = useSelector((state: RootState) => state.token.tokenSet);

  const updateTokenList = (newTokenList) => {
    dispatch(setTokenList(newTokenList));
  };

  const updateTokenDataSet = (newTokenSet) => {
    dispatch(setTokenDataset(newTokenSet));
  };

  const url = process.env.NEXT_PUBLIC_MARKET_FIRST_DATA;
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
        updateTokenList(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataAsync();

    const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL);

    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      if (tokenList) {
        updateTokenDataSet({
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
        dataList={tokenList}
        dataTypes={dataTypes}
        dataset={tokenSet}
      />
    </div>
  );
};

export default UpbitWebSocket;
