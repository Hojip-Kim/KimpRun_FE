'use client';

import Row from '@/components/row/Row';
import {
  setTokenFirstList,
  setTokenFirstDataset,
  setTokenSecondList,
  setTokenSecondDataset,
} from '@/redux/reducer/tokenReducer';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './page.css';
import TradingViewWidget from '@/components/TradingViewWidget';
import Search from '@/components/search/Search';
import Chat from '@/components/chat/Chat';
import { fetchTokenNames, fetchTokenCombinedDatas, fetchTokenDatas } from './components/server/DataFetcher';
import styled from 'styled-components';

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

  const dispatch: AppDispatch = useDispatch();
  const tokenFirstList = useSelector((state: RootState) => state.token.tokenList.first);
  const tokenSecondList = useSelector((state: RootState) => state.token.tokenList.second);
  const tokenFirstSet = useSelector((state: RootState) => state.token.tokenSet.first);
  const tokenSecondSet = useSelector((state: RootState) => state.token.tokenSet.second);

  const updateTokenFirstList = (newTokenList) => dispatch(setTokenFirstList(newTokenList));
  const updateTokenFirstDataSet = (newTokenSet) => dispatch(setTokenFirstDataset(newTokenSet));
  const updateTokenSecondList = (newTokenList) => dispatch(setTokenSecondList(newTokenList));
  const updateTokenSecondDataSet = (newTokenSet) => dispatch(setTokenSecondDataset(newTokenSet));

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
      <ChartContainer>
        <TradingViewWidget />
      </ChartContainer>
      <RowContainer>
        <Search tokenList={tokenFirstList} />
        <Row
          firstTokenNameList={tokenFirstList}
          firstTokenDataList={tokenFirstSet}
          firstDataset={firstDataset}
          secondDataset={secondDataset}
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
`;

const ChartContainer = styled.div`
  margin: 20px;
  padding: 0px 0px 0px 20px;
  width: 30%;
  height: 40%;

  #chart {
    justify-content: center;
    background-color: #131722;
    align-items: left;
    height: 350px;
    margin: auto;
    border: solid white;
    border-radius: 10px;
  }
`;

const RowContainer = styled.div`
  margin: 20px 40px 20px 20px;
  padding: 0px 20px 0px 0px;
  width: 50%;
  border: solid gray;
`;

const ChatContainer = styled.div`
  width: 20%;
  border: solid gray;
  margin: 20px 40px 20px 0px;
`;