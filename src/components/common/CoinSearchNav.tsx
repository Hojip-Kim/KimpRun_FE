'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { palette } from '@/styles/palette';
import { FaSearch } from 'react-icons/fa';

interface CoinSearchNavProps {
  placeholder?: string;
}

const SearchContainer = styled.div`
  position: relative;
  width: 280px;
  height: 32px;

  @media (max-width: 1024px) {
    width: 220px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: ${palette.input};
  border: 1px solid ${palette.border};
  border-radius: 6px;
  transition: all 0.2s ease;
  overflow: hidden;
  height: 100%;

  &:focus-within {
    border-color: ${palette.accent};
    box-shadow: 0 0 0 2px ${palette.accentRing};
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.375rem 0.5rem;
  background: transparent;
  border: none;
  color: ${palette.textPrimary};
  font-size: 0.75rem;
  outline: none;
  height: 100%;
  
  &::placeholder {
    color: ${palette.textMuted};
    font-size: 0.7rem;
  }
`;

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.625rem;
  background: ${palette.accent};
  color: ${palette.textPrimary};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 100%;
  
  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CoinSearchNav: React.FC<CoinSearchNavProps> = ({
  placeholder = "코인 검색 (BTC, ETH...)",
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    const trimmedValue = searchValue.trim().toUpperCase();
    if (trimmedValue) {
      // 코인순위페이지로 완전 새로고침하여 이동 (SSR로 검색 데이터 로드)
      window.location.href = `/information/coin-ranking?symbol=${trimmedValue}&page=1&size=100`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <SearchContainer>
      <SearchInputContainer>
        <SearchInput
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        <SearchButton 
          onClick={handleSearch}
          disabled={!searchValue.trim()}
          type="button"
        >
          <FaSearch size={12} />
        </SearchButton>
      </SearchInputContainer>
    </SearchContainer>
  );
};

export default CoinSearchNav;