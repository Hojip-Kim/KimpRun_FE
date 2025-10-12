import React from 'react';
import Dropdown, { DropdownOption } from '@/components/common/Dropdown';

interface IntervalSelectProps {
  value: string;
  onChangeValue: (value: string) => void;
  usePortal?: boolean;
}

const options: DropdownOption<string>[] = [
  { value: '5', label: '5m' },
  { value: '15', label: '15m' },
  { value: '30', label: '30m' },
  { value: '60', label: '1h' },
  { value: '240', label: '4h' },
  { value: '1440', label: '1d' },
];

const IntervalSelect: React.FC<IntervalSelectProps> = ({
  value,
  onChangeValue,
  usePortal = false,
}) => {
  return (
    <Dropdown
      value={value}
      options={options}
      onChange={(v) => onChangeValue(String(v))}
      ariaLabel="봉 간격 선택"
      usePortal={usePortal}
    />
  );
};

export default IntervalSelect;
