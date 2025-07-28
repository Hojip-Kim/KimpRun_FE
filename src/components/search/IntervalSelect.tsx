import React from 'react';
import { StyledSelect } from './style';

interface IntervalSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

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
