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
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { BiSearch } from 'react-icons/bi';

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
      <SelectContainer>
        <SelectWrapper>
          <CurrencySelect value={currency} onChange={handleCurrencyChange} />
          <StyledArrowIcon />
        </SelectWrapper>
        <SelectWrapper>
          <IntervalSelect value={interval} onChange={handleIntervalChange} />
          <StyledArrowIcon />
        </SelectWrapper>
      </SelectContainer>
      <SearchInputContainer>
        <SearchInput
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="코인 이름을 입력하세요 (예: btc , BTC)"
          onKeyDown={handleKeyPress}
        />
        <SearchButton onClick={updateWidgetToken}>
          <BiSearch size={18} />
          검색
        </SearchButton>
      </SearchInputContainer>
    </SearchContainer>
  );
};

export default Search;

const SearchContainer = styled.div`
  margin-bottom: 5px;
  color: #e0e0e0;
`;

const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
`;

const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInputContainer = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #333;
  border-radius: 4px;
  background-color: #2c2c2c;
  color: #e0e0e0;
  height: 36px; // 고정된 높이 설정

  &:focus {
    outline: none;
    border-color: #333;
  }
`;

const StyledArrowIcon = styled(MdOutlineKeyboardArrowDown)`
  position: absolute;
  right: 8px;
  pointer-events: none;
  color: #888;
  width: 20px;
  height: 20px;
`;

const SearchButton = styled.button`
  padding: 0 16px;
  font-size: 14px;
  background-color: #2c2c2c;
  color: #e0e0e0;
  border: 1px solid #333;
  border-radius: 4px;
  cursor: pointer;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
  transition: all 0.2s ease;

  svg {
    margin-right: 2px;
  }

  &:hover {
    background-color: #333;
  }

  &:active {
    background-color: #2c2c2c;
  }
`;
