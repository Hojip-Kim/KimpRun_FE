'use client';

import Row from '@/components/Row';
import { setTokenDataset, setTokenList } from '@/redux/redux';
import { AppDispatch, RootState } from '@/redux/store';
import serverFetch from '@/server/fetch/server';
import Script from 'next/script';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './page.css';
import TradingViewWidget from '@/components/TradingViewWidget';

export const UpbitWebSocket = () => {
  // state
  const [tokenNameList, setTokenNameList] = useState({});
  const [tokenDataList, setTokenDataList] = useState({});
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

  const marketDataURL = process.env.NEXT_PUBLIC_MARKET_FIRST_DATA;
  const marketListURL = process.env.NEXT_PUBLIC_MARKET_FIRST_NAME;

  const requestInit: RequestInit = {
    method: 'GET',
    headers: { 'Content-type': 'application/json' },
  };

  const fetchTokenNames = async () => {
    try {
      const nameList = await serverFetch(marketListURL, requestInit);
      if (nameList.ok) {
        return nameList.text;
      } else {
        throw new Error('Data Name parse Error Occured!');
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const fetchTokenDatas = async () => {
    try {
      const result = await serverFetch(marketDataURL, requestInit);
      if (result.ok) {
        return result.text;
      } else {
        throw new Error('Error Occured');
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const updateNamesAsync = async () => {
    try {
      const tokenNames = await fetchTokenNames();
      if (tokenNames) {
        updateTokenList(tokenNames);
        setTokenNameList(tokenNames);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateDataAsync = async () => {
    try {
      const tokenData = await fetchTokenDatas();

      if (tokenData) {
        updateTokenDataSet(tokenData);
        setTokenDataList(tokenData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    updateNamesAsync(); // 토큰이름 fetch
    updateDataAsync(); // 토큰데이터 fetch

    const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL);

    // websocket 실시간 마켓데이터 호출
    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);

      if (tokenList) {
        setDataset({
          token: parsedData.token,
          trade_price: parsedData.trade_price,
          trade_volume: parsedData.trade_volume,
          change_rate: parsedData.change_rate,
          highest_price: parsedData.highest_price,
          lowest_price: parsedData.lowest_price,
          opening_price: parsedData.opening_price,
          rate_change: parsedData.rate_change,
          acc_trade_price24: parsedData.acc_trade_price24,
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
    'acc_trade_price24',
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
      <div className="chart_container">
        <TradingViewWidget></TradingViewWidget>
      </div>

      <Row
        title={dataTitle}
        tokenNameList={tokenNameList.marketNameList}
        tokenDataList={tokenDataList.marketDataList}
        dataTypes={dataTypes}
        dataset={dataset}
      />
    </div>
  );
};

export default UpbitWebSocket;
