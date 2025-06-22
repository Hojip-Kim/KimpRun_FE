"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setKimp, setToken, setTokenPrice } from "@/redux/reducer/widgetReduce";
import { setTokenFirstList } from "@/redux/reducer/tokenReducer";
import {
  getRowData,
  updateRowData,
  updateRowDataFirstRender,
} from "./rowDataFetch";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
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
} from "./styled";
import TableRowComponent from "./TableRowComponent";
import { RowType, dataListType } from "./types";
import { sortDataByConfig } from "./util";
const Row = ({
  firstTokenNameList,
  firstTokenDataList,
  secondTokenDataList,
  firstDataset,
  secondDataset,
  filteredTokens,
}: RowType) => {
  const [nameList, setNameList] = useState<string[]>([]);
  const [dataList, setDataList] = useState<dataListType[]>([]);
  const [prevRowData, setPrevRowData] = useState<{
    [key: string]: dataListType;
  }>({});
  const [rowData, setRowData] = useState<{ [key: string]: dataListType }>({});
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "",
  });
  const [fadeOutClass, setFadeOutClass] = useState({});
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const dispatch: AppDispatch = useDispatch();
  const dollar = useSelector((state: RootState) => state.info.dollar);
  const tether = useSelector((state: RootState) => state.info.tether);
  const selectedCompareMarket = useSelector(
    (state: RootState) => state.market.selectedCompareMarket
  );

  const tokenOrderList = useSelector(
    (state: RootState) => state.token.tokenList.first
  );

  const token = useSelector((state: RootState) => state.widget.token);

  const updateWidgetToken = (token: string) => {
    dispatch(setToken(token));
    updateTokenPrice(token);
    updateKimp(token);
  };

  const sortData = (key: string) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }

    // 정렬 상태만 업데이트 (실제 정렬은 useEffect에서 처리)
    setSortConfig({ key, direction });
  };

  // 정렬 적용 함수 분리
  const applySorting = (
    dataToSort: { [key: string]: dataListType },
    config: { key: string; direction: string }
  ) => {
    if (!config.key || !config.direction) return;

    // 현재 필터링된 토큰들만 대상으로 정렬
    const filteredRowData = {};
    filteredTokens.forEach((token) => {
      if (dataToSort[token]) {
        filteredRowData[token] = dataToSort[token];
      }
    });

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
    const currentOrderString = tokenOrderList.join(",");
    const newOrderString = newTokenOrder.join(",");
    if (currentOrderString !== newOrderString) {
      dispatch(setTokenFirstList(newTokenOrder));
    }
  };

  // 정렬 상태가 변경될 때 정렬 적용
  useEffect(() => {
    if (
      sortConfig.key &&
      sortConfig.direction &&
      rowData &&
      Object.keys(rowData).length > 0
    ) {
      applySorting(rowData, sortConfig);
    }
  }, [sortConfig, filteredTokens]);

  const rowClick = async (token: string) => {
    if (expandedRow === token) {
      setExpandedRow(null);
    } else {
      updateWidgetToken(token);
      updateKimp(token);
      updateTokenPrice(token);
      setExpandedRow(token);
    }
  };

  const updateTokenPrice = (token: string) => {
    const tokenPrice = rowData[token]?.trade_price.toFixed(2);
    dispatch(setTokenPrice(tokenPrice));
  };

  const updateKimp = (token: string) => {
    const kimp = rowData[token]?.kimp;
    dispatch(setKimp(kimp));
  };

  useEffect(() => {
    if (firstTokenNameList && firstTokenDataList) {
      setNameList(firstTokenNameList);
      setDataList(firstTokenDataList);
    }
  }, [firstTokenNameList, firstTokenDataList]);

  useEffect(() => {
    if (
      nameList.length > 0 &&
      firstTokenDataList &&
      Object.keys(firstTokenDataList).length > 0 &&
      !Object.keys(rowData).length
    ) {
      getRowData(nameList, firstTokenDataList).then((initialRowData) => {
        updateRowDataFirstRender(
          initialRowData,
          firstTokenDataList,
          secondTokenDataList
        ).then((updatedData) => {
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
    if (
      nameList.length > 0 &&
      firstTokenDataList &&
      secondTokenDataList &&
      Object.keys(firstTokenDataList).length > 0
    ) {
      getRowData(nameList, firstTokenDataList).then((initialRowData) => {
        updateRowDataFirstRender(
          initialRowData,
          firstTokenDataList,
          secondTokenDataList
        ).then((updatedData) => {
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
    if (rowData && firstDataset && secondTokenDataList) {
      setPrevRowData(rowData);
      updateRowData(rowData, firstDataset, secondDataset).then(
        (updatedData) => {
          setRowData(updatedData);

          // 현재 정렬 상태가 있다면 웹소켓 데이터 업데이트 후에도 다시 정렬
          if (sortConfig.key && sortConfig.direction) {
            applySorting(updatedData, sortConfig);
          }

          const newFadeOutClass = {};
          Object.keys(firstDataset).forEach((token) => {
            const prev = prevRowData[token]?.trade_price;
            const cur = firstDataset[token].trade_price;
            if (prev !== undefined && prev !== cur) {
              newFadeOutClass[token] = "fade-out";
            }
          });
          setFadeOutClass(newFadeOutClass);

          setTimeout(() => {
            setFadeOutClass({});
          }, 200);
        }
      );
    }
    updateTokenPrice(token);
    updateKimp(token);
  }, [firstDataset, dollar, tether, selectedCompareMarket]);

  return (
    <RowContainer>
      <TableWrapper>
        <HeaderTable>
          <thead>
            <HeaderRow>
              <TableHeader>
                <HeaderContent>코인</HeaderContent>
              </TableHeader>
              <TableHeader onClick={() => sortData("trade_price")}>
                <HeaderContent>현재가격</HeaderContent>
                <SortButton
                  className={sortConfig.key === "trade_price" ? "active" : ""}
                >
                  {sortConfig.key === "trade_price" ? (
                    sortConfig.direction === "asc" ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )
                  ) : (
                    <FaSort />
                  )}
                </SortButton>
              </TableHeader>
              <TableHeader onClick={() => sortData("kimp")}>
                <HeaderContent>김프</HeaderContent>
                <SortButton
                  className={sortConfig.key === "kimp" ? "active" : ""}
                >
                  {sortConfig.key === "kimp" ? (
                    sortConfig.direction === "asc" ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )
                  ) : (
                    <FaSort />
                  )}
                </SortButton>
              </TableHeader>
              <TableHeader onClick={() => sortData("change_rate")}>
                <HeaderContent>변동률</HeaderContent>
                <SortButton
                  className={sortConfig.key === "change_rate" ? "active" : ""}
                >
                  {sortConfig.key === "change_rate" ? (
                    sortConfig.direction === "asc" ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )
                  ) : (
                    <FaSort />
                  )}
                </SortButton>
              </TableHeader>
              <TableHeader onClick={() => sortData("highest_price")}>
                <HeaderContent>52주 고가</HeaderContent>
                <SortButton
                  className={sortConfig.key === "highest_price" ? "active" : ""}
                >
                  {sortConfig.key === "highest_price" ? (
                    sortConfig.direction === "asc" ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )
                  ) : (
                    <FaSort />
                  )}
                </SortButton>
              </TableHeader>
              <TableHeader onClick={() => sortData("lowest_price")}>
                <HeaderContent>52주 저가</HeaderContent>
                <SortButton
                  className={sortConfig.key === "lowest_price" ? "active" : ""}
                >
                  {sortConfig.key === "lowest_price" ? (
                    sortConfig.direction === "asc" ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )
                  ) : (
                    <FaSort />
                  )}
                </SortButton>
              </TableHeader>
              <TableHeader onClick={() => sortData("acc_trade_price24")}>
                <HeaderContent>누적 거래액</HeaderContent>
                <SortButton
                  className={
                    sortConfig.key === "acc_trade_price24" ? "active" : ""
                  }
                >
                  {sortConfig.key === "acc_trade_price24" ? (
                    sortConfig.direction === "asc" ? (
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

                console.log("🎨 렌더링할 토큰들:", renderTokens);
                console.log("🎨 현재 filteredTokens:", filteredTokens);
                console.log(
                  "🎨 현재 tokenOrderList:",
                  tokenOrderList.slice(0, 10)
                );

                return renderTokens.map((token) => (
                  <TableRowComponent
                    key={token}
                    token={token}
                    data={rowData[token]}
                    prevData={prevRowData[token]}
                    expandedRow={expandedRow}
                    fadeOutClass={fadeOutClass[token]}
                    onRowClick={rowClick}
                  />
                ));
              })()}
            </tbody>
          </BodyTable>
        </TableBody>
      </TableWrapper>
    </RowContainer>
  );
};

export default Row;
