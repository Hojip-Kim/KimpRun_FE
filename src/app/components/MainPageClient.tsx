'use client';

import Row from '@/components/row/Row';
import {
  setTokenFirstList,
  setTokenFirstDataset,
  setTokenSecondList,
  setTokenSecondDataset,
} from '@/redux/reducer/tokenReducer';
import { clientEnv } from '@/utils/env';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Search from '@/components/search/Search';
import Chat from '@/components/chat/Chat';
import {
  getSingleMarketData,
  getCombinedTokenData,
} from '@/server/serverDataLoader';
import TradingViewWidget from '@/components/tradingview/TradingViewWidget';
import { checkAuth } from '@/components/login/server/checkAuth';
import TwitterFeed from '@/components/twitter/TwitterFeed';
import { setGuestUser } from '@/redux/reducer/authReducer';
import { MainPageProps, firstDataSet, secondDataSet } from '../types';
import {
  ChartContainer,
  ChatContainer,
  LeftSideContainer,
  MainContainer,
  RowContainer,
} from './style';

const MainPageClient: React.FC<MainPageProps> = ({
  initialTokenNames,
  initialCombinedData,
}) => {
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

  const updateTokenFirstList = (newTokenList: string[]) =>
    dispatch(setTokenFirstList(newTokenList));
  const updateTokenFirstDataSet = (newTokenSet: any) =>
    dispatch(setTokenFirstDataset(newTokenSet));
  const updateTokenSecondList = (newTokenList: string[]) =>
    dispatch(setTokenSecondList(newTokenList));
  const updateTokenSecondDataSet = (newTokenSet: any) =>
    dispatch(setTokenSecondDataset(newTokenSet));

  // 데이터 업데이트 비동기 처리
  const updateDataAsync = async (market: string, secondMarket?: string) => {
    try {
      let tokenData;
      if (secondMarket === null || secondMarket === undefined) {
        tokenData = await getSingleMarketData(market);
        if (tokenData) {
          if (market === 'upbit') {
            await updateTokenFirstDataSet(tokenData);
          } else if (market === 'binance') {
            await updateTokenSecondDataSet(tokenData);
          }
        }
      } else {
        tokenData = await getCombinedTokenData(market, secondMarket);
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

  // 초기 데이터 설정
  useEffect(() => {
    if (initialTokenNames) {
      updateTokenFirstList(initialTokenNames.firstMarketList);
      updateTokenSecondList(initialTokenNames.secondMarketList);
    }

    if (initialCombinedData) {
      updateTokenFirstDataSet(initialCombinedData.firstMarketDataList);
      updateTokenSecondDataSet(initialCombinedData.secondMarketDataList);
    }
  }, [initialTokenNames, initialCombinedData]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuth(dispatch);
      } catch (error) {
        console.error(error);
        dispatch(setGuestUser());
      }
    };
    initAuth();
  }, [dispatch]);

  const wsUpbitRef = React.useRef<WebSocket | null>(null);
  const wsBinanceRef = React.useRef<WebSocket | null>(null);

  // 웹소켓 연결 (마켓 데이터 실시간 업데이트를 위한 웹소켓)
  useEffect(() => {
    wsUpbitRef.current = new WebSocket(clientEnv.UPBIT_WEBSOCKET_URL);
    wsBinanceRef.current = new WebSocket(clientEnv.BINANCE_WEBSOCKET_URL);

    wsUpbitRef.current.onerror = (error) => {
      console.error(error);
      wsUpbitRef.current?.close();
    };

    wsBinanceRef.current.onerror = (error) => {
      console.error(error);
      wsBinanceRef.current?.close();
    };

    return () => {
      if (wsUpbitRef.current) {
        wsUpbitRef.current.close();
      }
      if (wsBinanceRef.current) {
        wsBinanceRef.current.close();
      }
    };
  }, []);

  // 업비트 웹소켓 메시지 처리
  const UpbitMessageHandler = (event: MessageEvent) => {
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

  // 바이낸스 웹소켓 메시지 처리
  const BinanceMessageHandler = (event: MessageEvent) => {
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

  // 향후 upbit , binance가 아닌 first market / second market 추가하여야 함.
  // 이를 통해 market이 늘어남에 따른 클라이언트 단 선택으로 서로 다른 두 거래소 간 가격 비교 가능
  useEffect(() => {
    if (!wsUpbitRef.current || !wsBinanceRef.current) {
      return;
    }

    wsUpbitRef.current.onmessage = UpbitMessageHandler;
    wsBinanceRef.current.onmessage = BinanceMessageHandler;

    return () => {
      if (wsUpbitRef.current) {
        wsUpbitRef.current.onmessage = null;
      }
      if (wsBinanceRef.current) {
        wsBinanceRef.current.onmessage = null;
      }
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

export default MainPageClient;
