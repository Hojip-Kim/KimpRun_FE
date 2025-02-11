'use client';

import Row from '@/components/row/Row';
import {
  setTokenFirstList,
  setTokenFirstDataset,
  setTokenSecondList,
  setTokenSecondDataset,
} from '@/redux/reducer/tokenReducer';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './page.css';
import Search from '@/components/search/Search';
import Chat from '@/components/chat/Chat';
import {
  fetchTokenNames,
  fetchTokenCombinedDatas,
  fetchTokenDatas,
} from './components/server/DataFetcher';
import styled from 'styled-components';
import TradingViewWidget from '@/components/tradingview/TradingViewWidget';
import { fetchUserInfo } from '@/components/auth/fetchUserInfo';
import { checkAuth } from '@/components/login/server/checkAuth';
import TwitterFeed from '@/components/twitter/TwitterFeed';

export type TokenNameList = {
  firstMarketData: any;
  secondMarketData: any;
};

export type tokenNameList = {
  firstMarketList: string[];
  secondMarketList: string[];
};

export type firstDataSet = {
  acc_trade_price24: number;
  change_rate: number;
  highest_price: number;
  lowest_price: number;
  opening_price: number;
  rate_change: string;
  token: string;
  trade_price: number;
  trade_volume: number;
};

export type secondDataSet = {
  token: string;
  trade_price: number;
};

const MainPage = () => {
  const [firstDataset, setFirstDataset] = useState<{
    [key: string]: firstDataSet;
  }>({});
  const [secondDataset, setSecondDateset] = useState<{
    [key: string]: secondDataSet;
  }>({});

  const [filteredTokens, setFilteredTokens] = useState<string[]>([]);

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

  const updateTokenFirstList = (newTokenList) =>
    dispatch(setTokenFirstList(newTokenList));
  const updateTokenFirstDataSet = (newTokenSet) =>
    dispatch(setTokenFirstDataset(newTokenSet));
  const updateTokenSecondList = (newTokenList) =>
    dispatch(setTokenSecondList(newTokenList));
  const updateTokenSecondDataSet = (newTokenSet) =>
    dispatch(setTokenSecondDataset(newTokenSet));

  const upbitWebsocketURL = process.env.NEXT_PUBLIC_UPBIT_WEBSOCKET_URL;
  const binanceWebsocketURL = process.env.NEXT_PUBLIC_BINANCE_WEBSOCKET_URL;

  const updateNamesAsync = async () => {
    try {
      const tokenNames = await fetchTokenNames();
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
        tokenData = await fetchTokenDatas(market);
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

  const handleSearch = useCallback(
    (searchTerm: string) => {
      if (!searchTerm) {
        setFilteredTokens(tokenFirstList);
      } else {
        const filtered = tokenFirstList.filter((token) =>
          token.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTokens(filtered);
      }
    },
    [tokenFirstList]
  );

  useEffect(() => {
    setFilteredTokens(tokenFirstList);
  }, [tokenFirstList]);

  useEffect(() => {
    if (window.location.search.includes('login=success')) {
      checkAuth(dispatch);
    }
  }, [dispatch]);

  useEffect(() => {
    updateNamesAsync();
    updateDataAsync('upbit', 'binance');
  }, []);

  useEffect(() => {
    const wsUpbit = new WebSocket(upbitWebsocketURL);
    const wsBinance = new WebSocket(binanceWebsocketURL);

    wsUpbit.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      if (tokenFirstList) {
        setFirstDataset((prevState) => {
          const newState = { ...prevState };
          Object.entries(parsedData).forEach(([key, value]) => {
            newState[key] = value as firstDataSet;
          });
          return newState;
        });
      }
    };

    wsBinance.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      if (tokenSecondList) {
        setSecondDateset((prevState) => {
          const newState = { ...prevState };
          Object.entries(parsedData).forEach(([key, value]) => {
            newState[key] = value as secondDataSet;
          });
          return newState;
        });
      }
    };

    wsUpbit.onerror = (error) => {
      console.error('Upbit Websocket Error:', error);
      wsUpbit.close();
    };

    wsBinance.onerror = (error) => {
      console.error('Binance Websocket Error:', error);
      wsBinance.close();
    };

    return () => {
      wsUpbit.close();
      wsBinance.close();
    };
  }, [tokenFirstList, tokenSecondList]);

  return (
    <MainContainer>
      <LeftSideContainer>
        <ChartContainer>
          <TradingViewWidget />
        </ChartContainer>
        <TwitterFeed />
      </LeftSideContainer>
      <RowContainer>
        <Search onSearch={handleSearch} />
        <Row
          firstTokenNameList={tokenFirstList}
          firstTokenDataList={tokenFirstSet}
          secondTokenDataList={tokenSecondSet}
          firstDataset={firstDataset}
          secondDataset={secondDataset}
          filteredTokens={filteredTokens}
        />
      </RowContainer>
      <ChatContainer>
        <Chat />
      </ChatContainer>
    </MainContainer>
  );
};

export default MainPage;

const MainContainer = styled.div`
  width: 100%;
  display: flex;
  background-color: #121212;
  color: #ffffff;
  height: 100vh;
  overflow: hidden;
  padding-bottom: 150px;
  gap: 20px;
  justify-content: center;
`;

const LeftSideContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 130px);
  flex: 3;
  min-width: 400px;
  max-width: 600px;
  gap: 20px;
  margin: 20px 0 20px 20px; // 전체 여백을 여기서 처리
`;

const ChartContainer = styled.div`
  flex: 1;
  min-height: 300px;
  max-height: 30%;

  #chart {
    justify-content: center;
    background-color: #131722;
    align-items: left;
    height: 100%;
    width: 100%;
    border: 1px solid #333333;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const RowContainer = styled.div`
  flex: 4.5;
  min-width: 600px;
  max-width: 900px;
  margin: 20px 0;
  padding: 20px;
  background-color: #1e1e1e;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
  overflow: hidden; / 컨테이너 자체는 overflow 숨김
`;

const ChatContainer = styled.div`
  flex: 2.5;
  min-width: 300px;
  max-width: 400px;
  background-color: #1e1e1e;
  margin: 20px 20px 20px 0;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: 100%;
  display: flex; // 추가
  flex-direction: column; // 추가
`;
