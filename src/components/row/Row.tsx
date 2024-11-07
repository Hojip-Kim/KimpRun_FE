'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setTether } from '@/redux/reducer/infoReducer';
import { setToken } from '@/redux/reducer/widgetReduce';
import { firstDataSet, secondDataSet } from '@/app/page';
import {
  getRowData,
  updateRowData,
  updateRowDataFirstRender,
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

interface RowType {
  firstTokenNameList: string[];
  firstTokenDataList: any;
  secondTokenDataList: any;
  firstDataset: { [key: string]: firstDataSet };
  secondDataset: { [key: string]: secondDataSet };
  filteredTokens: string[];
}

export type dataListType = {
  acc_trade_price24: number;
  change_rate: number;
  highest_price: number;
  lowest_price: number;
  opening_price: number;
  rate_change: number;
  token: string;
  trade_price: number;
  trade_volume: number;
  secondPrice: number | undefined;
  kimp: number | undefined;
};

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
    key: '',
    direction: '',
  });
  const [fadeOutClass, setFadeOutClass] = useState({});
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const dispatch: AppDispatch = useDispatch();
  const tether = useSelector((state: RootState) => state.info.tether);
  const dollar = useSelector((state: RootState) => state.info.dollar);

  const updateTether = (tether) => {
    dispatch(setTether(tether));
  };

  const updateWidgetToken = (token) => {
    dispatch(setToken(token));
  };

  const sortDataByConfig = (
    data: { [key: string]: dataListType },
    key: string,
    direction: string
  ) => {
    return Object.entries(data).sort((a, b) => {
      const valueA = a[1][key];
      const valueB = b[1][key];

      if (key === 'kimp') {
        const kimpA = valueA === -100 || !isFinite(valueA) ? -Infinity : valueA;
        const kimpB = valueB === -100 || !isFinite(valueB) ? -Infinity : valueB;

        return direction === 'asc' ? kimpA - kimpB : kimpB - kimpA;
      }

      if (!isFinite(valueA)) return 1;
      if (!isFinite(valueB)) return -1;

      return direction === 'asc' ? valueA - valueB : valueB - valueA;
    });
  };

  const sortData = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = sortDataByConfig(rowData, key, direction);
    setRowData(
      Object.fromEntries(sortedData) as { [key: string]: dataListType }
    );
    setSortConfig({ key, direction });
  };

  const rowClick = async (token: string) => {
    if (expandedRow === token) {
      setExpandedRow(null);
    } else {
      updateWidgetToken(token);
      setExpandedRow(token);
    }
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
      dataList.length > 0 &&
      !Object.keys(rowData).length
    ) {
      getRowData(nameList, dataList).then((initialRowData) => {
        updateRowDataFirstRender(
          initialRowData,
          firstTokenDataList,
          secondTokenDataList,
          dollar
        ).then((updatedData) => {
          setRowData(updatedData);
        });
      });
    }
  }, [nameList, dataList]);

  // 실시간 업데이트를 위한 useEffect
  useEffect(() => {
    if (rowData && firstDataset && secondTokenDataList) {
      setPrevRowData(rowData);
      updateRowData(rowData, firstDataset, secondDataset, dollar).then(
        (updatedData) => {
          setRowData(updatedData);
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
            setFadeOutClass({});
          }, 200);
        }
      );
    }
  }, [firstDataset]);

  return (
    <RowContainer>
      <TableWrapper>
        <HeaderTable>
          <thead>
            <HeaderRow>
              <TableHeader>
                <HeaderContent>코인</HeaderContent>
              </TableHeader>
              <TableHeader>
                <HeaderContent>현재가격</HeaderContent>
                <SortButton
                  className={sortConfig.key === 'trade_price' ? 'active' : ''}
                  onClick={() => sortData('trade_price')}
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
              <TableHeader>
                <HeaderContent>김프</HeaderContent>
                <SortButton
                  className={sortConfig.key === 'kimp' ? 'active' : ''}
                  onClick={() => sortData('kimp')}
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
              <TableHeader>
                <HeaderContent>변동률</HeaderContent>
                <SortButton
                  className={sortConfig.key === 'change_rate' ? 'active' : ''}
                  onClick={() => sortData('change_rate')}
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
              <TableHeader>
                <HeaderContent>52주 고가</HeaderContent>
              </TableHeader>
              <TableHeader>
                <HeaderContent>52주 저가</HeaderContent>
              </TableHeader>
              <TableHeader>
                <HeaderContent>장 시작가</HeaderContent>
              </TableHeader>
              <TableHeader>
                <HeaderContent>누적 거래액</HeaderContent>
                <SortButton
                  className={
                    sortConfig.key === 'acc_trade_price24' ? 'active' : ''
                  }
                  onClick={() => sortData('acc_trade_price24')}
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
              {Object.entries(rowData)
                .filter(([token]) => filteredTokens.includes(token))
                .map(([token, data]) => (
                  <TableRowComponent
                    key={token}
                    token={token}
                    data={data}
                    secondPrice={data.secondPrice}
                    secondData={{
                      token: token,
                      trade_price: secondDataset[token]
                        ? secondDataset[token].trade_price * dollar
                        : 0,
                    }}
                    prevData={prevRowData[token]}
                    expandedRow={expandedRow}
                    fadeOutClass={fadeOutClass[token]}
                    onRowClick={rowClick}
                  />
                ))}
            </tbody>
          </BodyTable>
        </TableBody>
      </TableWrapper>
    </RowContainer>
  );
};

export default Row;
