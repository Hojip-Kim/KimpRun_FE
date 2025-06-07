'use client';
import {
  setCurrency,
  setInterval,
  setToken,
} from '@/redux/reducer/widgetReduce';
import { RootState } from '@/redux/store';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CurrencySelect from './CurrencySelect';
import IntervalSelect from './IntervalSelect';
import { BiSearch } from 'react-icons/bi';
import { SearchProps } from './types';
import {
  SearchContainer,
  SelectContainer,
  SelectWrapper,
  SearchInputContainer,
  SearchInput,
  SearchButton,
  StyledArrowIcon,
} from './style';
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
