import React from 'react';
import styled, { keyframes } from 'styled-components';

interface CurrencySelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const popIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  70% {
    transform: translateY(2px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const StyledSelect = styled.select`
  transition: all 0.3s ease;
  transform-origin: center;

  &:focus {
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  &:hover {
    background-color: #f0f0f0;
    border-color: #999;
  }

  option {
    animation: ${popIn} 0.3s ease-out;
  }
`;

const CurrencySelect: React.FC<CurrencySelectProps> = ({ value, onChange }) => {
  return (
    <StyledSelect value={value} onChange={onChange}>
      <option value="KRW">KRW</option>
      <option value="USDT">USDT</option>
    </StyledSelect>
  );
};

export default CurrencySelect;
