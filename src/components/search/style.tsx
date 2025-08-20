import styled, { keyframes } from 'styled-components';
import { palette } from '@/styles/palette';
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
  border: 1px solid ${palette.border};
  border-radius: 10px;
  background-color: ${palette.input};
  color: ${palette.textPrimary};
  cursor: pointer;
  height: 36px;
  appearance: none;
  width: 100px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: rgba(255, 215, 0, 0.45);
    box-shadow: 0 0 0 3px ${palette.accentRing};
    transform: scale(1.02);
  }

  &:hover {
    background-color: #131722;
  }

  option {
    background-color: ${palette.input};
    color: ${palette.textPrimary};
    padding: 8px;
    font-weight: 500;
    animation: ${popIn} 0.2s ease-out;

    &:hover {
      background-color: #131722;
    }
  }
`;

// search

export const SearchContainer = styled.div`
  margin-bottom: 5px;
  color: ${palette.textPrimary};
  @media (max-width: 768px) {
    margin-bottom: 8px;
  }
`;

export const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 8px;
  }
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
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 6px;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid ${palette.border};
  border-radius: 10px;
  background-color: ${palette.input};
  color: ${palette.textPrimary};
  height: 36px; // 고정된 높이 설정

  &:focus {
    outline: none;
    border-color: rgba(255, 215, 0, 0.45);
    box-shadow: 0 0 0 3px ${palette.accentRing};
  }
  @media (max-width: 768px) {
    height: 34px;
    font-size: 13px;
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
  background-color: ${palette.input};
  color: ${palette.textPrimary};
  border: 1px solid ${palette.border};
  border-radius: 10px;
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
    color: ${palette.accent};
    background-color: #131722;
  }

  &:active {
    background-color: ${palette.input};
  }
  @media (max-width: 768px) {
    height: 34px;
    font-size: 13px;
  }
`;
