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

    const sortedData = sortDataByConfig(rowData, key, direction);

    // 정렬된 순서대로 토큰 이름 배열 생성
    const sortedTokenOrder = sortedData.map(([token, data]) => token);

    // 리덕스에 정렬된 토큰 순서 저장
    dispatch(setTokenFirstList(sortedTokenOrder));

    setSortConfig({ key, direction });
  };

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
            const sortedData = sortDataByConfig(
              updatedData,
              sortConfig.key,
              sortConfig.direction
            );
            // 정렬된 순서대로 토큰 순서 업데이트
            const sortedTokenOrder = sortedData.map(([token, data]) => token);
            dispatch(setTokenFirstList(sortedTokenOrder));
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
                return tokenOrderList
                  .filter(
                    (token) => filteredTokens.includes(token) && rowData[token]
                  )
                  .map((token) => (
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
