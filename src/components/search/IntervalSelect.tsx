import React from 'react';
import Dropdown, { DropdownOption } from '@/components/common/Dropdown';

interface IntervalSelectProps {
  value: string;
  onChangeValue: (value: string) => void;
}

const options: DropdownOption<string>[] = [
  { value: '5', label: '5분봉' },
  { value: '15', label: '15분봉' },
  { value: '30', label: '30분봉' },
  { value: '60', label: '1시간봉' },
  { value: '240', label: '4시간봉' },
  { value: '1440', label: '1일봉' },
];

const IntervalSelect: React.FC<IntervalSelectProps> = ({ value, onChangeValue }) => {
  return (
    <Dropdown
      value={value}
      options={options}
      onChange={(v) => onChangeValue(String(v))}
      ariaLabel="봉 간격 선택"
    />
  );
};

export default IntervalSelect;
