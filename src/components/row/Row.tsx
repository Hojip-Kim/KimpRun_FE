'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setKimp, setToken, setTokenPrice } from '@/redux/reducer/widgetReduce';
import { setTokenFirstList } from '@/redux/reducer/tokenReducer';
import {
  getRowData,
  updateRowData,
  updateRowDataFirstRender,
  getCoinDetail,
} from './rowDataFetch';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import {
  RowContainer,
  TableWrapper,
  HeaderRow,
  TableHeader,
  SortButton,
  HeaderContent,
  TableBody,
  BodyTable,
  HeaderTable,
} from './styled';
import TableRowComponent from './TableRowComponent';
import { RowType, dataListType, CoinDetail } from './types';
import { sortDataByConfig } from './util';
const Row = ({
  firstTokenNameList,
  firstTokenDataList,
  secondTokenDataList,
  firstDataset,
  secondDataset,
  filteredTokens,
  tokenMapping,
}: RowType) => {
  const [nameList, setNameList] = useState<string[]>([]);
  const [dataList, setDataList] = useState<dataListType[]>([]);
  const [prevRowData, setPrevRowData] = useState<{
    [key: string]: dataListType;
  }>({});
  const [currentExchange, setCurrentExchange] = useState<string>('');
  const [rowData, setRowData] = useState<{ [key: string]: dataListType }>({});
  const [sortConfig, setSortConfig] = useState({
    key: 'acc_trade_price24',
    direction: 'desc',
  });
  const [fadeOutClass, setFadeOutClass] = useState({});
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [coinDetails, setCoinDetails] = useState<{ [key: string]: CoinDetail }>(
    {}
  );
  const [loadingCoinDetail, setLoadingCoinDetail] = useState<string | null>(
    null
  );

  const isMountedRef = useRef(true);

  const dispatch: AppDispatch = useDispatch();
  const dollar = useSelector((state: RootState) => state.info.dollar);
  const tether = useSelector((state: RootState) => state.info.tether);
  const selectedCompareMarket = useSelector(
    (state: RootState) => state.market.selectedCompareMarket
  );
  const selectedMainMarket = useSelector(
    (state: RootState) => state.market.selectedMainMarket
  );

  const tokenOrderList = useSelector(
    (state: RootState) => state.token.tokenList.first
  );

  const token = useSelector((state: RootState) => state.widget.token);

  const updateTokenPrice = useCallback(
    (token: string) => {
      setRowData((currentRowData) => {
        const tokenPrice = currentRowData[token]?.trade_price.toFixed(2);
        dispatch(setTokenPrice(tokenPrice));
        return currentRowData;
      });
    },
    [dispatch]
  );

  const updateKimp = useCallback(
    (token: string) => {
      setRowData((currentRowData) => {
        const kimp = currentRowData[token]?.kimp;
        dispatch(setKimp(kimp));
        return currentRowData;
      });
    },
    [dispatch]
  );

  const updateWidgetToken = useCallback(
    (token: string) => {
      dispatch(setToken(token));
      updateTokenPrice(token);
      updateKimp(token);
    },
    [dispatch, updateTokenPrice, updateKimp]
  );

  const sortData = (key: string) => {
    if (!isMountedRef.current) return;

    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }

    // 정렬 상태만 업데이트 (실제 정렬은 useEffect에서 처리)
    setSortConfig({ key, direction });
  };

  // 정렬 적용 함수 분리
  const applySorting = (
    dataToSort: { [key: string]: dataListType },
    config: { key: string; direction: string }
  ) => {
    // 컴포넌트 언마운트 체크
    if (!isMountedRef.current) return;

    if (!config.key || !config.direction) return;

    // filteredTokens가 비어있으면 정렬하지 않음 (거래소 변경 중일 수 있음)
    if (!filteredTokens || filteredTokens.length === 0) {
      return;
    }

    // dataToSort가 비어있으면 정렬하지 않음
    if (!dataToSort || Object.keys(dataToSort).length === 0) {
      return;
    }

    // 현재 필터링된 토큰들만 대상으로 정렬
    const filteredRowData = {};
    filteredTokens.forEach((token) => {
      if (dataToSort[token]) {
        filteredRowData[token] = dataToSort[token];
      }
    });

    // 필터링된 데이터가 없으면 정렬하지 않음
    if (Object.keys(filteredRowData).length === 0) {
      return;
    }

    const sortedData = sortDataByConfig(
      filteredRowData,
      config.key,
      config.direction
    );

    // 정렬된 필터링 토큰들의 순서만 업데이트
    const sortedFilteredTokenOrder = sortedData.map(([token, data]) => token);

    // 기존 리덕스 토큰 순서에서 필터링되지 않은 토큰들은 유지하고, 필터링된 토큰들만 정렬된 순서로 교체
    const currentTokenOrder = [...tokenOrderList];
    const nonFilteredTokens = currentTokenOrder.filter(
      (token) => !filteredTokens.includes(token)
    );
    const newTokenOrder = [...sortedFilteredTokenOrder, ...nonFilteredTokens];

    // 순서가 실제로 변경된 경우에만 업데이트
    const currentOrderString = tokenOrderList.join(',');
    const newOrderString = newTokenOrder.join(',');
    if (currentOrderString !== newOrderString && isMountedRef.current) {
      dispatch(setTokenFirstList(newTokenOrder));
    }
  };

  // 정렬 상태가 변경될 때 정렬 적용
  useEffect(() => {
    if (!isMountedRef.current) return;

    if (
      sortConfig.key &&
      sortConfig.direction &&
      rowData &&
      Object.keys(rowData).length > 0 &&
      filteredTokens &&
      filteredTokens.length > 0
    ) {
      applySorting(rowData, sortConfig);
    }
  }, [sortConfig, filteredTokens]);

  // Symbol을 ID로 변환하는 헬퍼 함수
  const getTokenId = useCallback(
    (symbol: string): number | null => {
      if (!tokenMapping) {
        return null;
      }

      // firstMarketList에서 먼저 찾기
      const tokenInFirst = tokenMapping.firstMarketList?.find(
        (token) => token.symbol === symbol
      );

      if (tokenInFirst) return tokenInFirst.id;

      // secondMarketList에서 찾기
      const tokenInSecond = tokenMapping.secondMarketList?.find(
        (token) => token.symbol === symbol
      );

      if (tokenInSecond) return tokenInSecond.id;

      return null;
    },
    [tokenMapping, selectedMainMarket, selectedCompareMarket]
  );

  const rowClick = useCallback(
    async (token: string) => {
      if (expandedRow === token) {
        setExpandedRow(null);
        return;
      }

      // 1. 즉시 UI 상태 변경 (빠른 반응성)
      setExpandedRow(token);
      updateWidgetToken(token);

      // 2. 코인 상세 정보 로딩 (비동기 처리)
      // coinDetails는 함수 내부에서 최신 상태를 참조
      setTimeout(async () => {
        // 컴포넌트가 언마운트되었는지 확인
        if (!isMountedRef.current) {
          return;
        }

        setCoinDetails((currentCoinDetails) => {
          // 이미 있으면 로딩하지 않음
          if (currentCoinDetails[token]) {
            return currentCoinDetails;
          }

          // 없으면 로딩 시작
          if (isMountedRef.current) {
            setLoadingCoinDetail(token);
          }

          // 비동기 로딩
          (async () => {
            try {
              const coinId = getTokenId(token);
              if (coinId && isMountedRef.current) {
                const coinDetail = await getCoinDetail(coinId.toString());

                // API 요청 후에도 컴포넌트가 마운트되어 있는지 재확인
                if (coinDetail && isMountedRef.current) {
                  setCoinDetails((prev) => ({
                    ...prev,
                    [token]: coinDetail,
                  }));
                } else {
                  console.warn('❌ Failed to get coin detail for:', token);
                }
              } else {
                console.warn(`❌ 토큰 ${token}의 ID를 찾을 수 없습니다.`);
              }
            } catch (error) {
              console.error('❌ 코인 정보 로딩 실패:', error);
            } finally {
              if (isMountedRef.current) {
                setLoadingCoinDetail(null);
              }
            }
          })();

          return currentCoinDetails;
        });
      }, 0);
    },
    [expandedRow, updateWidgetToken, getTokenId] // coinDetails 의존성 제거
  );

  // 컴포넌트 언마운트 시 cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // 거래소 변경 시 모든 상태 완전 초기화
  useEffect(() => {
    if (isMountedRef.current) {
      const newExchangeKey = `${selectedMainMarket}-${selectedCompareMarket}`;
      setCurrentExchange(newExchangeKey);
      
      // 정렬 상태를 기본값(누적 거래액 desc)으로 초기화
      setSortConfig({ key: 'acc_trade_price24', direction: 'desc' });

      // 모든 데이터 상태 완전 초기화 (이전 SSR 데이터 제거)
      setNameList([]);
      setDataList([]);
      setPrevRowData({});
      setRowData({});
      setFadeOutClass({});
      setExpandedRow(null);
      setCoinDetails({});
      setLoadingCoinDetail(null);
    }
  }, [selectedMainMarket, selectedCompareMarket]);

  useEffect(() => {
    if (!isMountedRef.current) return;

    if (firstTokenNameList && firstTokenDataList) {
      setNameList(firstTokenNameList);
      setDataList(firstTokenDataList);
    }
  }, [firstTokenNameList, firstTokenDataList]);

  useEffect(() => {
    if (!isMountedRef.current) return;

    if (
      nameList.length > 0 &&
      firstTokenDataList &&
      Object.keys(firstTokenDataList).length > 0 &&
      !Object.keys(rowData).length
    ) {
      getRowData(nameList, firstTokenDataList).then((initialRowData) => {
        if (!isMountedRef.current) return;

        updateRowDataFirstRender(
          initialRowData,
          firstTokenDataList,
          secondTokenDataList
        ).then((updatedData) => {
          if (!isMountedRef.current) return;
          setRowData(updatedData);
        });
      });
    }
  }, [
    nameList,
    firstTokenDataList,
    secondTokenDataList,
    dollar,
    tether,
    selectedCompareMarket,
  ]);

  // firstTokenDataList 또는 secondTokenDataList가 변경될 때 데이터 새로 로드
  useEffect(() => {
    if (!isMountedRef.current) return;

    if (
      nameList.length > 0 &&
      firstTokenDataList &&
      secondTokenDataList &&
      Object.keys(firstTokenDataList).length > 0
    ) {
      getRowData(nameList, firstTokenDataList).then((initialRowData) => {
        if (!isMountedRef.current) return;

        updateRowDataFirstRender(
          initialRowData,
          firstTokenDataList,
          secondTokenDataList
        ).then((updatedData) => {
          if (!isMountedRef.current) return;
          setRowData(updatedData);
        });
      });
    }
  }, [
    firstTokenDataList,
    secondTokenDataList,
    nameList,
    dollar,
    tether,
    selectedCompareMarket,
  ]);

  useEffect(() => {
    if (!isMountedRef.current) return;

    if (rowData && firstDataset && secondTokenDataList) {
      const exchangeKey = `${selectedMainMarket}-${selectedCompareMarket}`;
      
      // 같은 거래소에서만 이전 데이터로 설정 (cross-exchange 비교 방지)
      if (currentExchange === exchangeKey && Object.keys(rowData).length > 0) {
        setPrevRowData(rowData);
      }
      
      updateRowData(rowData, firstDataset, secondDataset).then(
        (updatedData) => {
          if (!isMountedRef.current) return;
          setRowData(updatedData);

          // 현재 정렬 상태가 있다면 웹소켓 데이터 업데이트 후에도 다시 정렬
          if (
            sortConfig.key &&
            sortConfig.direction &&
            filteredTokens &&
            filteredTokens.length > 0
          ) {
            applySorting(updatedData, sortConfig);
          }

          // 같은 거래소에서만 애니메이션 효과 적용
          if (currentExchange === exchangeKey) {
            const newFadeOutClass = {};
            Object.keys(firstDataset).forEach((token) => {
              const prev = prevRowData[token]?.trade_price;
              const cur = firstDataset[token].trade_price;
              if (prev !== undefined && prev !== cur) {
                newFadeOutClass[token] = 'fade-out';
              }
            });
            setFadeOutClass(newFadeOutClass);

            setTimeout(() => {
              if (!isMountedRef.current) return;
              setFadeOutClass({});
            }, 200);
          }
        }
      );
    }

    if (isMountedRef.current) {
      updateTokenPrice(token);
      updateKimp(token);
    }
  }, [firstDataset, dollar, tether, selectedCompareMarket, currentExchange]);

  return (
    <RowContainer>
      <TableWrapper>
        <HeaderTable>
          <thead>
            <HeaderRow>
              <TableHeader>
                <HeaderContent>코인</HeaderContent>
              </TableHeader>
              <TableHeader onClick={() => sortData('trade_price')}>
                <HeaderContent>현재가격</HeaderContent>
                <SortButton
                  className={sortConfig.key === 'trade_price' ? 'active' : ''}
                >
                  {sortConfig.key === 'trade_price' ? (
                    sortConfig.direction === 'asc' ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )
                  ) : (
                    <FaSort />
                  )}
                </SortButton>
              </TableHeader>
              <TableHeader onClick={() => sortData('kimp')}>
                <HeaderContent>김프</HeaderContent>
                <SortButton
                  className={sortConfig.key === 'kimp' ? 'active' : ''}
                >
                  {sortConfig.key === 'kimp' ? (
                    sortConfig.direction === 'asc' ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )
                  ) : (
                    <FaSort />
                  )}
                </SortButton>
              </TableHeader>
              <TableHeader onClick={() => sortData('change_rate')}>
                <HeaderContent>변동률</HeaderContent>
                <SortButton
                  className={sortConfig.key === 'change_rate' ? 'active' : ''}
                >
                  {sortConfig.key === 'change_rate' ? (
                    sortConfig.direction === 'asc' ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )
                  ) : (
                    <FaSort />
                  )}
                </SortButton>
              </TableHeader>
              <TableHeader onClick={() => sortData('highest_price')}>
                <HeaderContent>52주 고가</HeaderContent>
                <SortButton
                  className={sortConfig.key === 'highest_price' ? 'active' : ''}
                >
                  {sortConfig.key === 'highest_price' ? (
                    sortConfig.direction === 'asc' ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )
                  ) : (
                    <FaSort />
                  )}
                </SortButton>
              </TableHeader>
              <TableHeader onClick={() => sortData('lowest_price')}>
                <HeaderContent>52주 저가</HeaderContent>
                <SortButton
                  className={sortConfig.key === 'lowest_price' ? 'active' : ''}
                >
                  {sortConfig.key === 'lowest_price' ? (
                    sortConfig.direction === 'asc' ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )
                  ) : (
                    <FaSort />
                  )}
                </SortButton>
              </TableHeader>
              <TableHeader onClick={() => sortData('acc_trade_price24')}>
                <HeaderContent>누적 거래액</HeaderContent>
                <SortButton
                  className={
                    sortConfig.key === 'acc_trade_price24' ? 'active' : ''
                  }
                >
                  {sortConfig.key === 'acc_trade_price24' ? (
                    sortConfig.direction === 'asc' ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )
                  ) : (
                    <FaSort />
                  )}
                </SortButton>
              </TableHeader>
            </HeaderRow>
          </thead>
        </HeaderTable>

        <TableBody>
          <BodyTable>
            <tbody>
              {(() => {
                const renderTokens = tokenOrderList.filter(
                  (token) => filteredTokens.includes(token) && rowData[token]
                );
                return renderTokens.map((token) => {
                  const exchangeKey = `${selectedMainMarket}-${selectedCompareMarket}`;
                  const shouldUsePrevData = currentExchange === exchangeKey;
                  
                  return (
                    <TableRowComponent
                      key={token}
                      token={token}
                      data={rowData[token]}
                      prevData={shouldUsePrevData ? prevRowData[token] : undefined}
                      expandedRow={expandedRow}
                      fadeOutClass={fadeOutClass[token]}
                      onRowClick={rowClick}
                      coinDetail={coinDetails[token]}
                      loadingCoinDetail={loadingCoinDetail === token}
                    />
                  );
                });
              })()}
            </tbody>
          </BodyTable>
        </TableBody>
      </TableWrapper>
    </RowContainer>
  );
};

export default Row;
