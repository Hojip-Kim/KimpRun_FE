'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { palette } from '@/styles/palette';
import { FaSearch } from 'react-icons/fa';

interface CoinSearchProps {
  onSearch: (symbol: string) => void;
  placeholder?: string;
  initialValue?: string;
}

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
`;

const SearchInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: ${palette.input};
  border: 2px solid ${palette.border};
  border-radius: 12px;
  transition: all 0.3s ease;
  overflow: hidden;

  &:focus-within {
    border-color: ${palette.accent};
    box-shadow: 0 0 0 3px ${palette.accentRing};
  }

  @media (max-width: 768px) {
    border-radius: 8px;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.875rem 1rem;
  background: transparent;
  border: none;
  color: ${palette.textPrimary};
  font-size: 0.9rem;
  font-weight: 500;
  outline: none;
  
  &::placeholder {
    color: ${palette.textMuted};
    font-weight: 400;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 0.875rem;
    font-size: 0.85rem;
  }
`;

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.25rem;
  background: ${palette.accent};
  color: ${palette.textPrimary};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  font-size: 0.9rem;
  gap: 0.5rem;
  
  &:hover {
    opacity: 0.8;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    
    span {
      display: none;
    }
  }
`;


const CoinSearch: React.FC<CoinSearchProps> = ({
  onSearch,
  placeholder = "코인 심볼 입력 (예: BTC, ETH)",
  initialValue = "",
}) => {
  const [searchValue, setSearchValue] = useState(initialValue);

  const handleSearch = () => {
    const trimmedValue = searchValue.trim().toUpperCase();
    if (trimmedValue) {
      onSearch(trimmedValue);
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
          <FaSearch size={14} />
          <span>검색</span>
        </SearchButton>
      </SearchInputContainer>
    </SearchContainer>
  );
};

export default CoinSearch;