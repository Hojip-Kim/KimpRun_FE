"use client";

import React from "react";
import { MarketType } from "@/types/marketType";
import {
  MarketSelectorContainer,
  MarketSelectorGroup,
  MarketSelectorLabel,
} from "./style";
import Dropdown, { DropdownOption } from '@/components/common/Dropdown';

interface MarketOption {
  value: MarketType;
  label: string;
  hasWebsocket: boolean;
}

interface MarketSelectorProps {
  selectedMainMarket: MarketType;
  selectedCompareMarket: MarketType;
  onMarketChange: (type: "main" | "compare", market: MarketType) => void;
  disabled?: boolean;
  marketOptions?: MarketOption[];
}

const DEFAULT_MARKET_OPTIONS: MarketOption[] = [
  { value: MarketType.UPBIT, label: "UPBIT", hasWebsocket: true },
  { value: MarketType.BINANCE, label: "BINANCE", hasWebsocket: true },
  { value: MarketType.COINONE, label: "COINONE", hasWebsocket: true },
  { value: MarketType.BITHUMB, label: "BITHUMB", hasWebsocket: true },
];

const MarketSelector: React.FC<MarketSelectorProps> = ({
  selectedMainMarket,
  selectedCompareMarket,
  onMarketChange,
  disabled = false,
  marketOptions = DEFAULT_MARKET_OPTIONS,
}) => {
  const iconMap: Partial<Record<MarketType, string>> = {
    [MarketType.UPBIT]: '/upbit_logo.png',
    [MarketType.BINANCE]: '/binance_logo.png',
    [MarketType.COINONE]: '/coinone_logo.png',
    [MarketType.BITHUMB]: '/bithumb_logo.png',
    [MarketType.ALL]: '/logo.png',
  };

  const dropdownOptions: DropdownOption<MarketType>[] = marketOptions.map((o) => ({
    value: o.value,
    label: `${o.label}${o.hasWebsocket ? '' : ' (준비중)'}`,
    iconSrc: iconMap[o.value],
    iconAlt: `${o.label} logo`,
    disabled:
      !o.hasWebsocket ||
      o.value === selectedCompareMarket ||
      o.value === selectedMainMarket,
  }));

  return (
    <MarketSelectorContainer>
      <MarketSelectorGroup>
        <MarketSelectorLabel>메인 거래소</MarketSelectorLabel>
        <Dropdown
          value={selectedMainMarket}
          options={dropdownOptions.map((o) => ({
            ...o,
            disabled: !marketOptions.find((m) => m.value === o.value)?.hasWebsocket ||
              o.value === selectedCompareMarket,
          }))}
          onChange={(val) => onMarketChange('main', val as MarketType)}
          disabled={disabled}
          ariaLabel="메인 거래소 선택"
        />
      </MarketSelectorGroup>

      <MarketSelectorGroup>
        <MarketSelectorLabel>비교 거래소</MarketSelectorLabel>
        <Dropdown
          value={selectedCompareMarket}
          options={dropdownOptions.map((o) => ({
            ...o,
            disabled: !marketOptions.find((m) => m.value === o.value)?.hasWebsocket ||
              o.value === selectedMainMarket,
          }))}
          onChange={(val) => onMarketChange('compare', val as MarketType)}
          disabled={disabled}
          ariaLabel="비교 거래소 선택"
        />
      </MarketSelectorGroup>
    </MarketSelectorContainer>
  );
};

export default MarketSelector;
