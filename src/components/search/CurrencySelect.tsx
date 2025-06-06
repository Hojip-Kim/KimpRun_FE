import React from 'react';
import { StyledSelect } from './style';

interface CurrencySelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({ value, onChange }) => {
  return (
    <StyledSelect value={value} onChange={onChange}>
      <option value="USDT">USDT</option>
      <option value="KRW">KRW</option>
      <option value="BTC">BTC</option>
    </StyledSelect>
  );
};

export default CurrencySelect;
