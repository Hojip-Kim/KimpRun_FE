"use client";

import Row from "@/components/row/Row";
import {
  setTokenFirstList,
  setTokenFirstDataset,
  setTokenSecondList,
  setTokenSecondDataset,
} from "@/redux/reducer/tokenReducer";
import {
  setSelectedMainMarket,
  setSelectedCompareMarket,
} from "@/redux/reducer/marketReducer";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Search from "@/components/search/Search";
import { checkAuth } from "@/components/login/server/checkAuth";
import { setGuestUser } from "@/redux/reducer/authReducer";
import { firstDataSet, secondDataSet } from "../types";
import {
  RowContainer,
  MarketSelectorContainer,
  MarketSelectorGroup,
  MarketSelectorLabel,
  MarketSelect,
  LoadingOverlay,
} from "./style";
import { MarketType } from "@/types/marketType";
import { getClientSingleMarketData } from "./clientApi";
import { useMarketDataWebSocket } from "@/hooks/useMarketDataWebSocket";
import { MarketDataMap } from "@/types/marketData";

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
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>("");

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
    { value: MarketType.UPBIT, label: "UPBIT", hasWebsocket: true },
    { value: MarketType.BINANCE, label: "BINANCE", hasWebsocket: true },
    { value: MarketType.COINONE, label: "COINONE", hasWebsocket: true },
    { value: MarketType.BITHUMB, label: "BITHUMB", hasWebsocket: true },
  ];

  const mapToFirstDataSet = useCallback((data: any): firstDataSet => {
    return {
      acc_trade_price24: data.acc_trade_price24 || 0,
      change_rate: data.change_rate || 0,
      highest_price: data.highest_price || 0,
      lowest_price: data.lowest_price || 0,
      opening_price: data.opening_price || 0,
      rate_change: data.rate_change || "EVEN",
      token: data.token || "",
      trade_price: data.trade_price || 0,
      trade_volume: data.trade_volume || 0,
    };
  }, []);

  const mapToSecondDataSet = useCallback((data: any): secondDataSet => {
    return {
      token: data.token || "",
      trade_price: data.trade_price || 0,
    };
  }, []);

  const handleMarketData = useCallback(
    (marketType: MarketType, data: MarketDataMap) => {
      // 메인 거래소인 경우 - 모든 필드 사용
      if (selectedMainMarket === marketType) {
        const mappedData: { [key: string]: firstDataSet } = {};
        Object.entries(data).forEach(([token, marketData]) => {
          mappedData[token] = mapToFirstDataSet(marketData);
        });
        setFirstDataset((prevData) => ({
          ...prevData,
          ...mappedData,
        }));
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

  // 통합 마켓 데이터 웹소켓 사용
  const { disconnect } = useMarketDataWebSocket({
    onMarketData: handleMarketData,
    enabled: !loading && !initialLoading,
  });

  // 초기 설정 및 데이터 로드
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await checkAuth(dispatch);
      } catch (error) {
        console.error(error);
        dispatch(setGuestUser());
      }

      // 리덕스에 저장된 거래소 확인
      const savedFirstMarket = selectedMainMarket;
      const savedSecondMarket = selectedCompareMarket;

      if (!(savedFirstMarket && savedSecondMarket)) {
        setMainMarket(DEFAULT_MAIN_MARKET);
        setCompareMarket(DEFAULT_COMPARE_MARKET);
      }

      // 초기 데이터 로드
      await loadMarketData(savedFirstMarket, savedSecondMarket);
      setInitialLoading(false);
    };

    initializeApp();
  }, []);

  // 거래소 변경 시 데이터 로드
  const loadMarketData = async (
    mainMarket: MarketType,
    compareMarket: MarketType
  ) => {
    setLoading(true);

    try {
      // 1. 기존 웹소켓 연결 종료
      disconnect();

      // 2. 기존 상태 초기화
      setFirstDataset({});
      setSecondDateset({});
      setFilteredTokens([]);

      // 3. 메인 거래소의 모든 데이터와 비교 거래소의 공통 데이터 가져오기
      const [mainMarketData, compareMarketData] = await Promise.all([
        getClientSingleMarketData(mainMarket), // 메인 거래소의 모든 데이터
        getClientSingleMarketData(compareMarket), // 비교 거래소의 모든 데이터
      ]);

      // 4. 메인 거래소의 코인 리스트 생성
      const mainTokenList = mainMarketData ? Object.keys(mainMarketData) : [];

      // 5. 비교 거래소에서 메인 거래소와 공통된 코인만 필터링
      const filteredCompareData: { [key: string]: any } = {};
      if (mainMarketData && compareMarketData) {
        Object.keys(mainMarketData).forEach((token) => {
          if (compareMarketData[token]) {
            filteredCompareData[token] = compareMarketData[token];
          }
        });
      }

      // 6. Redux store에 코인 리스트 저장
      updateTokenFirstList(mainTokenList); // 메인 거래소의 모든 코인
      updateTokenSecondList(Object.keys(filteredCompareData)); // 공통 코인만

      // 7. 정적 데이터를 웹소켓 데이터의 초기값으로 설정
      if (mainMarketData) {
        setFirstDataset(mainMarketData);
        updateTokenFirstDataSet(mainMarketData);
      }

      if (filteredCompareData) {
        setSecondDateset(filteredCompareData);
        updateTokenSecondDataSet(filteredCompareData);
      }
    } catch (error) {
      console.error("❌ 데이터 로딩 오류:", error);
      alert("데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 거래소 선택 변경 핸들러
  const handleMarketChange = async (
    type: "main" | "compare",
    market: MarketType
  ) => {
    const selectedOption = marketOptions.find((opt) => opt.value === market);

    // 웹소켓이 지원되지 않는 거래소 선택 시 경고 (추후 확장을 위함)
    if (!selectedOption?.hasWebsocket) {
      alert("해당 거래소는 아직 실시간 데이터가 지원되지 않습니다.");
      return;
    }

    const newMainMarket = type === "main" ? market : selectedMainMarket;
    const newCompareMarket =
      type === "compare" ? market : selectedCompareMarket;

    // 같은 거래소 선택 방지
    if (newMainMarket === newCompareMarket) {
      alert("메인 거래소와 비교 거래소는 다르게 선택해주세요.");
      return;
    }

    // Redux state 먼저 업데이트
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

  return (
    <RowContainer style={{ position: "relative" }}>
      {initialLoading && (
        <LoadingOverlay>
          <div>로딩 중</div>
        </LoadingOverlay>
      )}

      {!initialLoading && loading && (
        <LoadingOverlay>
          <div>거래소 데이터 로딩 중</div>
        </LoadingOverlay>
      )}

      <MarketSelectorContainer>
        <MarketSelectorGroup>
          <MarketSelectorLabel>메인 거래소</MarketSelectorLabel>
          <MarketSelect
            value={selectedMainMarket}
            onChange={(e) =>
              handleMarketChange("main", e.target.value as MarketType)
            }
            disabled={loading || initialLoading}
          >
            {marketOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={!option.hasWebsocket}
              >
                {option.label} {!option.hasWebsocket && "(준비중)"}
              </option>
            ))}
          </MarketSelect>
        </MarketSelectorGroup>

        <MarketSelectorGroup>
          <MarketSelectorLabel>비교 거래소</MarketSelectorLabel>
          <MarketSelect
            value={selectedCompareMarket}
            onChange={(e) =>
              handleMarketChange("compare", e.target.value as MarketType)
            }
            disabled={loading || initialLoading}
          >
            {marketOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={!option.hasWebsocket}
              >
                {option.label} {!option.hasWebsocket && "(준비중)"}
              </option>
            ))}
          </MarketSelect>
        </MarketSelectorGroup>
      </MarketSelectorContainer>

      <Search onSearch={handleSearch} />

      {!initialLoading && tokenFirstList && tokenFirstList.length > 0 && (
        <Row
          firstTokenNameList={tokenFirstList}
          firstTokenDataList={displayFirstDataset}
          secondTokenDataList={displaySecondDataset}
          firstDataset={displayFirstDataset}
          secondDataset={displaySecondDataset}
          filteredTokens={filteredTokens}
        />
      )}
    </RowContainer>
  );
};

export default RowPageClient;
