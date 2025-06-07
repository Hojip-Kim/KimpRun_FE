import styled, { keyframes } from 'styled-components';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
const popIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const StyledSelect = styled.select`
  padding: 8px 12px;
  padding-right: 32px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #333;
  border-radius: 4px;
  background-color: #1e1e1e;
  color: #fff;
  cursor: pointer;
  height: 36px;
  appearance: none;
  width: 100px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #444;
    transform: scale(1.02);
  }

  &:hover {
    background-color: #2c2c2c;
  }

  option {
    background-color: #1e1e1e;
    color: #fff;
    padding: 8px;
    font-weight: 500;
    animation: ${popIn} 0.2s ease-out;

    &:hover {
      background-color: #2c2c2c;
    }
  }
`;

// search

export const SearchContainer = styled.div`
  margin-bottom: 5px;
  color: #e0e0e0;
`;

export const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
`;

export const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const SearchInputContainer = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;
`;

export const SearchInput = styled.input`
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

export const StyledArrowIcon = styled(MdOutlineKeyboardArrowDown)`
  position: absolute;
  right: 8px;
  pointer-events: none;
  color: #888;
  width: 20px;
  height: 20px;
`;

export const SearchButton = styled.button`
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
