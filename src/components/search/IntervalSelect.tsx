import React from 'react';
import styled, { keyframes } from 'styled-components';

interface IntervalSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

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

const StyledSelect = styled.select`
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

const IntervalSelect: React.FC<IntervalSelectProps> = ({ value, onChange }) => {
  return (
    <StyledSelect value={value} onChange={onChange}>
      <option value="5">5분봉</option>
      <option value="15">15분봉</option>
      <option value="30">30분봉</option>
      <option value="60">1시간봉</option>
      <option value="240">4시간봉</option>
      <option value="1440">1일봉</option>
    </StyledSelect>
  );
};

export default IntervalSelect;
