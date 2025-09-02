import React from 'react';
import Dropdown, { DropdownOption } from '@/components/common/Dropdown';

interface CurrencySelectProps {
  value: string;
  onChangeValue: (value: string) => void;
  usePortal?: boolean;
}

const options: DropdownOption<string>[] = [
  { value: 'USDT', label: 'USDT' },
  { value: 'KRW', label: 'KRW' },
  { value: 'BTC', label: 'BTC' },
];

const CurrencySelect: React.FC<CurrencySelectProps> = ({
  value,
  onChangeValue,
  usePortal = false,
}) => {
  return (
    <Dropdown
      value={value}
      options={options}
      onChange={(v) => onChangeValue(String(v))}
      ariaLabel="통화 선택"
      usePortal={usePortal}
    />
  );
};

export default CurrencySelect;
