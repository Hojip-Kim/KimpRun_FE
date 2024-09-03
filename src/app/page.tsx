'use client';

import Row from '@/components/Row';
import {
  setTokenFirstList,
  setTokenFirstDataset,
  setTokenSecondList,
  setTokenSecondDataset,
} from '@/redux/reducer/tokenReducer';
import { AppDispatch, RootState } from '@/redux/store';
import serverFetch from '@/server/fetch/server';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './page.css';
import TradingViewWidget from '@/components/TradingViewWidget';
import { error } from 'console';

export type TokenNameList = {
  firstMarketData: any;
  secondMarketData: any;
};

export type tokenNameList = {
  firstMarketList: string[];
  secondMarketList: string[];
};

const UpbitWebSocket = () => {
  // state

  const [firstDataset, setFirstDataset] = useState<{ [key: string]: any }>({});
  const [secondDataset, setSecondDateset] = useState<{ [key: string]: any }>(
    {}
  );

  // redux
  const dispatch: AppDispatch = useDispatch();
  const tokenFirstList = useSelector(
    (state: RootState) => state.token.tokenList.first
  );
  const tokenSecondList = useSelector(
    (state: RootState) => state.token.tokenList.second
  );

  const tokenFirstSet = useSelector(
    (state: RootState) => state.token.tokenSet.first
  );

  const tokenSecondSet = useSelector(
    (state: RootState) => state.token.tokenSet.second
  );

  const updateTokenFirstList = (newTokenList) => {
    dispatch(setTokenFirstList(newTokenList));
  };
  const updateTokenFirstDataSet = (newTokenSet) => {
    dispatch(setTokenFirstDataset(newTokenSet));
  };

  const updateTokenSecondList = (newTokenList) => {
    dispatch(setTokenSecondList(newTokenList));
  };

  const updateTokenSecondDataSet = (newTokenSet) => {
    dispatch(setTokenSecondDataset(newTokenSet));
  };

  const upbitMarketDataURL = process.env.NEXT_PUBLIC_MARKET_UPBIT_DATA;

  const marketDataURL = process.env.NEXT_PUBLIC_MARKET_DATA;

  const marketListURL = process.env.NEXT_PUBLIC_MARKET_FIRST_NAME;

  const upbitWebsocketURL = process.env.NEXT_PUBLIC_UPBIT_WEBSOCKET_URL;
  const binanceWebsocketURL = process.env.NEXT_PUBLIC_BINANCE_WEBSOCKET_URL;

  const requestInit: RequestInit = {
    method: 'GET',
    headers: { 'Content-type': 'application/json' },
  };

  const fetchTokenNames = async (): Promise<tokenNameList | null> => {
    try {
      const nameList = await serverFetch(marketListURL, requestInit);

      if (nameList.ok) {
        const text: tokenNameList = JSON.parse(nameList.text);
        return text;
      } else {
        throw new Error('Data Name parse Error Occured!');
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const fetchTokenCombinedDatas = async (firstMarket: string, secondMarket) => {
    try {
      const url = new URL(marketDataURL);
      url.searchParams.set('first', firstMarket);
      url.searchParams.set('second', secondMarket);

      const result = await serverFetch(url.toString(), requestInit);
      if (result.ok) {
        return JSON.parse(result.text);
      } else {
        throw new Error('Error Occured');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTokenDatas = async (market: string) => {
    try {
      const url = new URL(upbitMarketDataURL);
      url.searchParams.set('market', market);

      // console.log(url.toString());
      const result = await serverFetch(url.toString(), requestInit);
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
      const tokenNames: tokenNameList = await fetchTokenNames();

      if (tokenNames) {
        updateTokenFirstList(tokenNames.firstMarketList);
        updateTokenSecondList(tokenNames.secondMarketList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateDataAsync = async (market: string, secondMarket?: string) => {
    try {
      let tokenData;
      if (secondMarket === null || secondMarket === undefined) {
        // 이 데이터는 사용되지 않을 데이터입니다.
        tokenData = await fetchTokenDatas(market);
        tokenData = JSON.parse(tokenData);
        console.log(tokenData);
        if (tokenData) {
          if (market === 'upbit') {
            await updateTokenFirstDataSet(tokenData);
          } else if (market === 'binance') {
            await updateTokenSecondDataSet(tokenData);
          }
        }
      } else {
        tokenData = await fetchTokenCombinedDatas(market, secondMarket);
        if (tokenData) {
      
          await updateTokenFirstDataSet(tokenData.firstMarketDataList);
          await updateTokenSecondDataSet(tokenData.secondMarketDataList);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    updateNamesAsync(); // 토큰이름 fetch
    updateDataAsync('upbit', 'binance'); // 토큰데이터 fetch
  }, []);

  useEffect(() => {
    if (tokenSecondSet) {
      console.log(tokenSecondSet);
    }
  }, [tokenSecondSet]);

  useEffect(() => {
    const wsUpbit = new WebSocket(upbitWebsocketURL);

    // websocket 실시간 마켓데이터 호출
    wsUpbit.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);

      if (tokenFirstList) {
        setFirstDataset((prevState) => {
          const newState = { ...prevState };
          Object.entries(parsedData).map(([key, value]) => {
            newState[key] = value;
          });

          return newState;
        });
      }
    };

    wsUpbit.onerror = (error) => {
      console.error('Upbit Websocket Error:', error);
      wsUpbit.close();
    };
    // binance
    const wsBinance = new WebSocket(binanceWebsocketURL);

    // websocket 실시간 마켓데이터 호출
    wsBinance.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      console.log(parsedData);

      if (tokenSecondList) {
        setSecondDateset((prevState) => {
          const newState = { ...prevState };
          Object.entries(parsedData).map(([key, value]) => {
            newState[key] = value;
          });
          return newState;
        });
      }

      wsBinance.onerror = (error) => {
        console.error('Binacne Websocket Error: ', error);
        wsBinance.close();
      };

    };

    wsBinance.onerror = (error) => {
      console.error('Websocket Error:', error);
      wsBinance.close();
    };

    return () => {
      wsUpbit.close();
      wsBinance.close();
    };
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
    <div className="main_container">
      <div className="chart_container">
        <TradingViewWidget></TradingViewWidget>
      </div>

      <div className="row_container">
        <Row
          title={dataTitle}
          firstTokenNameList={tokenFirstList}
          secondTokenNameList={tokenSecondList}
          firstTokenDataList={tokenFirstSet}
          secondTokenDataList={tokenSecondSet}
          dataTypes={dataTypes}
          firstDataset={firstDataset}
          secondDataset={secondDataset}
        />
      </div>

      <div className="chat_container"></div>
    </div>
  );
};

export default UpbitWebSocket;
