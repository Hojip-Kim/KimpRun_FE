'use client';
import {
  setCurrency,
  setInterval,
  setToken,
} from '@/redux/reducer/widgetReduce';
import { RootState } from '@/redux/store';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import CurrencySelect from './CurrencySelect';
import IntervalSelect from './IntervalSelect';

interface SearchProps {
  onSearch: (searchTerm: string) => void;
}

function debounce<F extends (...args: any[]) => any>(func: F, wait: number) {
  let timeout: NodeJS.Timeout | null = null;
  return function (this: any, ...args: Parameters<F>) {
    const context = this;
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useDispatch();

  const currency = useSelector((state: RootState) => state.widget.currency);
  const interval = useSelector((state: RootState) => state.widget.interval);

  const updateWidgetToken = useCallback(() => {
    dispatch(setToken(searchTerm.toUpperCase()));
    onSearch(searchTerm);
  }, [searchTerm, onSearch, dispatch]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        updateWidgetToken();
      }
    },
    [updateWidgetToken]
  );

  const handleCurrencyChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setCurrency(e.target.value as 'KRW' | 'USDT'));
    },
    [dispatch]
  );

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      onSearch(term);
    }, 300),
    [onSearch]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTerm = e.target.value;
      setSearchTerm(newTerm);
      debouncedSearch(newTerm);
    },
    [debouncedSearch]
  );

  const handleIntervalChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setInterval(e.target.value));
    },
    [dispatch]
  );

  return (
    <SearchContainer>
      <CurrencySelect value={currency} onChange={handleCurrencyChange} />
      <IntervalSelect value={interval} onChange={handleIntervalChange} />
      아래에 모든 코인 중 하나를 입력후 엔터를 쳐보세요
      <SearchInput
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="코인 이름을 입력하세요 (예: btc , BTC)"
        onKeyDown={handleKeyPress}
      />
      <SearchButton onClick={updateWidgetToken}>검색</SearchButton>
    </SearchContainer>
  );
};

export default Search;

const SearchContainer = styled.div`
  margin-bottom: 20px;
  color: #e0e0e0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #333;
  border-radius: 4px;
  background-color: #2c2c2c;
  color: #e0e0e0;
  margin-top: 10px;
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #3a7bc8;
  }
`;
