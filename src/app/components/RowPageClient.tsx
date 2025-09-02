'use client';

import Row from '@/components/row/Row';
import {
  setTokenFirstList,
  setTokenFirstDataset,
  setTokenSecondList,
  setTokenSecondDataset,
} from '@/redux/reducer/tokenReducer';
import {
  setSelectedMainMarket,
  setSelectedCompareMarket,
} from '@/redux/reducer/marketReducer';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Search from '@/components/search/Search';
import { checkAuth } from '@/components/login/server/checkAuth';
import { setGuestUser } from '@/redux/reducer/authReducer';
import { firstDataSet, secondDataSet, TokenNameMapping } from '../types';
import { RowContainer, MobileChartContainer } from './style';
import { MarketType } from '@/types/marketType';
import { getClientSingleMarketData, getClientTokenMapping } from './clientApi';
import { useStompClientSingleton } from '@/hooks/useStompClientSingleton';
import { IMessage } from '@stomp/stompjs';
import { MarketDataMap } from '@/types/marketData';
import MarketSelector from '@/components/market-selector/MarketSelector';
import TradingViewWidget from '@/components/tradingview/TradingViewWidget';
import {
  MarketSelectorSkeleton,
  SearchSkeleton,
  TableSkeleton,
  ChartSkeleton,
} from '@/components/skeleton/Skeleton';

const RowPageClient: React.FC = () => {
  // 기본 거래소 설정
  const DEFAULT_MAIN_MARKET = MarketType.UPBIT;
  const DEFAULT_COMPARE_MARKET = MarketType.BINANCE;

  const dispatch: AppDispatch = useDispatch();

  const setMainMarket = (market: MarketType) => {
    dispatch(setSelectedMainMarket(market));
  };

  const setCompareMarket = (market: MarketType) => {
    dispatch(setSelectedCompareMarket(market));
  };

  // 웹소켓 데이터를 위한 로컬 state
  const [firstDataset, setFirstDataset] = useState<{
    [key: string]: firstDataSet;
  }>({});
  const [secondDataset, setSecondDateset] = useState<{
    [key: string]: secondDataSet;
  }>({});

  const [filteredTokens, setFilteredTokens] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('');

  // 토큰 매핑 정보를 위한 state 추가
  const [tokenMapping, setTokenMapping] = useState<TokenNameMapping | null>(
    null
  );

  // 리덕스에서 거래소 선택 상태 가져오기
  const selectedMainMarket = useSelector(
    (state: RootState) => state.market.selectedMainMarket
  );
  const selectedCompareMarket = useSelector(
    (state: RootState) => state.market.selectedCompareMarket
  );

  // 환율 정보 가져오기
  const dollar = useSelector((state: RootState) => state.info.dollar);

  const tokenFirstList = useSelector(
    (state: RootState) => state.token.tokenList.first
  );

  // 싱글톤 STOMP 클라이언트 사용
  const { isConnected, isConnecting, connectionError, subscribe, unsubscribe } =
    useStompClientSingleton({
      autoConnect: true,
    });

  const updateTokenFirstList = (newTokenList: string[]) =>
    dispatch(setTokenFirstList(newTokenList));
  const updateTokenFirstDataSet = (newTokenSet: any) =>
    dispatch(setTokenFirstDataset(newTokenSet));
  const updateTokenSecondList = (newTokenList: string[]) =>
    dispatch(setTokenSecondList(newTokenList));
  const updateTokenSecondDataSet = (newTokenSet: any) =>
    dispatch(setTokenSecondDataset(newTokenSet));

  // 현재 웹소켓이 지원되는 거래소만 선택 가능하도록 제한
  const marketOptions = [
    { value: MarketType.UPBIT, label: 'UPBIT', hasWebsocket: true },
    { value: MarketType.BINANCE, label: 'BINANCE', hasWebsocket: true },
    { value: MarketType.COINONE, label: 'COINONE', hasWebsocket: true },
    { value: MarketType.BITHUMB, label: 'BITHUMB', hasWebsocket: true },
  ];

  const mapToFirstDataSet = useCallback((data: any): Partial<firstDataSet> => {
    const result: Partial<firstDataSet> = {};

    // 기본적으로 항상 있어야 하는 필드들
    result.token = data.token || '';
    result.trade_price = data.trade_price || 0;
    result.change_rate = data.change_rate || 0;
    result.rate_change = data.rate_change || 'EVEN';

    // 선택적 필드들 - 실제 데이터가 있을 때만 업데이트
    if (data.acc_trade_price24 !== undefined) {
      result.acc_trade_price24 = data.acc_trade_price24;
    }
    if (data.opening_price !== undefined) {
      result.opening_price = data.opening_price;
    }
    if (data.trade_volume !== undefined) {
      result.trade_volume = data.trade_volume;
    }

    // 52주 고가/저가는 실제 데이터가 있고 0이 아닐 때만 업데이트
    if (data.highest_price !== undefined && data.highest_price !== 0) {
      result.highest_price = data.highest_price;
    }
    if (data.lowest_price !== undefined && data.lowest_price !== 0) {
      result.lowest_price = data.lowest_price;
    }

    return result as firstDataSet;
  }, []);

  const mapToSecondDataSet = useCallback((data: any): secondDataSet => {
    return {
      token: data.token || '',
      trade_price: data.trade_price || 0,
    };
  }, []);

  const handleMarketData = useCallback(
    (marketType: MarketType, data: MarketDataMap) => {
      // 메인 거래소인 경우 - 기존 데이터와 병합하여 업데이트
      if (selectedMainMarket === marketType) {
        setFirstDataset((prevData) => {
          const updatedData = { ...prevData };

          Object.entries(data).forEach(([token, marketData]) => {
            const newData = mapToFirstDataSet(marketData);

            // 기존 데이터가 있으면 병합, 없으면 새로 생성
            if (updatedData[token]) {
              updatedData[token] = {
                ...updatedData[token], // 기존 데이터 유지
                ...newData, // 새 데이터로 업데이트 (undefined 필드는 덮어쓰지 않음)
              };
            } else {
              // 새 토큰인 경우 기본값과 함께 생성
              updatedData[token] = {
                acc_trade_price24: 0,
                change_rate: 0,
                highest_price: 0,
                lowest_price: 0,
                opening_price: 0,
                rate_change: 'EVEN',
                token: '',
                trade_price: 0,
                trade_volume: 0,
                ...newData, // 웹소켓 데이터로 덮어쓰기
              };
            }
          });

          return updatedData;
        });
      }

      // 비교 거래소인 경우 - 가격 정보만 사용
      if (selectedCompareMarket === marketType) {
        const mappedData: { [key: string]: secondDataSet } = {};
        Object.entries(data).forEach(([token, marketData]) => {
          mappedData[token] = mapToSecondDataSet(marketData);
        });
        setSecondDateset((prevData) => ({
          ...prevData,
          ...mappedData,
        }));
      }
    },
    [
      selectedMainMarket,
      selectedCompareMarket,
      mapToFirstDataSet,
      mapToSecondDataSet,
    ]
  );

  // 배열을 객체로 변환하는 헬퍼 함수
  const arrayToObject = useCallback((dataArray: any[]): MarketDataMap => {
    const result: MarketDataMap = {};
    dataArray.forEach((item) => {
      if (item.token) {
        result[item.token] = item;
      }
    });
    return result;
  }, []);

  // 웹소켓 메시지 처리 함수
  const handleMarketDataMessage = useCallback(
    (message: IMessage) => {
      try {
        const data = JSON.parse(message.body);

        // 각 거래소별로 데이터 처리
        if (data.upbitData) {
          const upbitMap = arrayToObject(data.upbitData);
          handleMarketData(MarketType.UPBIT, upbitMap);
        }

        if (data.binanceData) {
          const binanceMap = arrayToObject(data.binanceData);
          handleMarketData(MarketType.BINANCE, binanceMap);
        }

        if (data.coinoneData) {
          const coinoneMap = arrayToObject(data.coinoneData);
          handleMarketData(MarketType.COINONE, coinoneMap);
        }

        if (data.bithumbData) {
          const bithumbMap = arrayToObject(data.bithumbData);
          handleMarketData(MarketType.BITHUMB, bithumbMap);
        }
      } catch (error) {
        console.error('❌ 마켓 데이터 웹소켓 메시지 파싱 오류:', error);
        console.error('원본 데이터:', message.body);
      }
    },
    [handleMarketData, arrayToObject]
  );

  // STOMP 구독 설정 (통합 마켓 데이터)
  useEffect(() => {
    if (isConnected) {
      subscribe('/topic/marketData', handleMarketDataMessage);

      return () => {};
    }
  }, [isConnected, subscribe, unsubscribe, handleMarketDataMessage]);

  // 초기 설정 및 데이터 로드 - redux-persist 상태 우선 사용
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await checkAuth(dispatch);
      } catch (error) {
        console.error(error);
        dispatch(setGuestUser());
      }

      // redux-persist rehydration을 위한 짧은 지연
      await new Promise((resolve) => setTimeout(resolve, 100));

      // redux-persist에서 복원된 상태가 있으면 사용, 없으면 기본값 설정
      let mainMarket = selectedMainMarket;
      let compareMarket = selectedCompareMarket;

      // 저장된 상태가 없거나 유효하지 않은 경우 기본값 설정
      if (!mainMarket || !compareMarket || mainMarket === compareMarket) {
        mainMarket = DEFAULT_MAIN_MARKET;
        compareMarket = DEFAULT_COMPARE_MARKET;

        // 리덕스 상태 업데이트 (localStorage에 저장됨)
        setMainMarket(mainMarket);
        setCompareMarket(compareMarket);
      }

      // 최종 결정된 거래소로 초기 데이터 로드
      await loadMarketData(mainMarket, compareMarket);
      setInitialLoading(false);
    };

    initializeApp();
  }, []); // 의존성에서 selectedMainMarket, selectedCompareMarket 제거 (초기화 시에만 실행)

  // 마켓 데이터 STOMP 기능 임시 비활성화

  // 거래소 변경 시 데이터 로드 - 완전 초기화 방식
  const loadMarketData = async (
    mainMarket: MarketType,
    compareMarket: MarketType
  ) => {
    setLoading(true);

    try {
      // 1. 모든 상태를 완전히 초기화 (SSR 데이터 포함)
      setFirstDataset({});
      setSecondDateset({});
      setFilteredTokens([]);
      setTokenMapping(null);

      // Redux 상태도 완전히 초기화
      updateTokenFirstList([]);
      updateTokenSecondList([]);
      updateTokenFirstDataSet({});
      updateTokenSecondDataSet({});

      // 2. 새로운 데이터 로드
      const [mainMarketData, compareMarketData] = await Promise.all([
        getClientSingleMarketData(mainMarket),
        getClientSingleMarketData(compareMarket),
      ]);

      // 3. 메인 거래소의 코인 리스트 생성
      const mainTokenList = mainMarketData ? Object.keys(mainMarketData) : [];

      // 4. 비교 거래소 데이터 매핑
      const compareDataForMain: { [key: string]: any } = {};
      if (mainMarketData && compareMarketData) {
        Object.keys(mainMarketData).forEach((token) => {
          if (compareMarketData[token]) {
            compareDataForMain[token] = compareMarketData[token];
          }
        });
      }

      // 5. 새 데이터로 상태 업데이트
      updateTokenFirstList(mainTokenList);
      updateTokenSecondList(Object.keys(compareDataForMain));

      if (mainMarketData) {
        setFirstDataset(mainMarketData);
        updateTokenFirstDataSet(mainMarketData);
      }

      if (compareDataForMain) {
        setSecondDateset(compareDataForMain);
        updateTokenSecondDataSet(compareDataForMain);
      }

      // 6. 토큰 매핑 정보 로드
      const mapping = await getClientTokenMapping(mainMarket, compareMarket);
      setTokenMapping(mapping);
    } catch (error) {
      console.error('❌ 데이터 로딩 오류:', error);
      alert('데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 거래소 선택 변경 핸들러
  const handleMarketChange = async (
    type: 'main' | 'compare',
    market: MarketType
  ) => {
    const selectedOption = marketOptions.find((opt) => opt.value === market);

    // 웹소켓이 지원되지 않는 거래소 선택 시 경고 (추후 확장을 위함)
    if (!selectedOption?.hasWebsocket) {
      alert('해당 거래소는 아직 실시간 데이터가 지원되지 않습니다.');
      return;
    }

    const newMainMarket = type === 'main' ? market : selectedMainMarket;
    const newCompareMarket =
      type === 'compare' ? market : selectedCompareMarket;

    // 같은 거래소 선택 방지
    if (newMainMarket === newCompareMarket) {
      alert('메인 거래소와 비교 거래소는 다르게 선택해주세요.');
      return;
    }

    // Redux state 먼저 업데이트 (자동으로 localStorage에 저장됨)

    setMainMarket(newMainMarket);
    setCompareMarket(newCompareMarket);

    // 새 데이터 로드 (정적 데이터 먼저, 그 다음 웹소켓 자동 재연결)
    await loadMarketData(newMainMarket, newCompareMarket);
  };

  const handleSearch = useCallback(
    (searchTerm: string) => {
      // 메인 거래소의 모든 코인을 기반으로 필터링
      const baseTokens = tokenFirstList || []; // 메인 거래소의 모든 코인

      setCurrentSearchTerm(searchTerm);
      if (!searchTerm) {
        setFilteredTokens(baseTokens);
      } else {
        const filtered = baseTokens.filter((token) =>
          token.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTokens(filtered);
      }
    },
    [tokenFirstList]
  );

  useEffect(() => {
    // 메인 거래소의 모든 토큰을 기본으로 설정하되, 현재 검색어가 있다면 필터링 유지
    if (tokenFirstList && tokenFirstList.length > 0) {
      if (currentSearchTerm) {
        // 현재 검색어로 다시 필터링
        const filtered = tokenFirstList.filter((token) =>
          token.toLowerCase().includes(currentSearchTerm.toLowerCase())
        );
        setFilteredTokens(filtered);
      } else {
        setFilteredTokens(tokenFirstList);
      }
    }
  }, [
    tokenFirstList,
    selectedMainMarket,
    selectedCompareMarket,
    currentSearchTerm,
  ]);

  // 웹소켓 데이터 사용 (정적 데이터는 이미 초기값으로 설정됨)
  const displayFirstDataset = firstDataset;
  const displaySecondDataset = secondDataset;

  const showSkeleton = initialLoading || loading;

  return (
    <RowContainer style={{ position: 'relative' }}>
      {showSkeleton ? (
        <>
          <MarketSelectorSkeleton />
          <MobileChartContainer>
            <ChartSkeleton height={200} />
          </MobileChartContainer>
          <SearchSkeleton />
          <TableSkeleton rows={12} />
        </>
      ) : (
        <>
          <MarketSelector
            selectedMainMarket={selectedMainMarket}
            selectedCompareMarket={selectedCompareMarket}
            onMarketChange={handleMarketChange}
            disabled={false}
            marketOptions={marketOptions}
          />
          {/* Mobile chart between selector and search */}
          <MobileChartContainer>
            <TradingViewWidget containerId="mobile-chart" />
          </MobileChartContainer>
          <Search onSearch={handleSearch} />
          {tokenFirstList && tokenFirstList.length > 0 && (
            <Row
              firstTokenNameList={tokenFirstList}
              firstTokenDataList={displayFirstDataset}
              secondTokenDataList={displaySecondDataset}
              firstDataset={displayFirstDataset}
              secondDataset={displaySecondDataset}
              filteredTokens={filteredTokens}
              tokenMapping={tokenMapping}
            />
          )}
        </>
      )}
    </RowContainer>
  );
};

export default RowPageClient;
