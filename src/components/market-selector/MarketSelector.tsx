"use client";

import React from "react";
import { MarketType } from "@/types/marketType";
import {
  MarketSelectorContainer,
  MarketSelectorGroup,
  MarketSelectorLabel,
  MarketSelect,
} from "./style";

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
  return (
    <MarketSelectorContainer>
      <MarketSelectorGroup>
        <MarketSelectorLabel>메인 거래소</MarketSelectorLabel>
        <MarketSelect
          value={selectedMainMarket}
          onChange={(e) => onMarketChange("main", e.target.value as MarketType)}
          disabled={disabled}
        >
          {marketOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={
                !option.hasWebsocket || option.value === selectedCompareMarket
              }
            >
              {option.label} {!option.hasWebsocket && "(준비중)"}
            </option>
          ))}
        </MarketSelect>
      </MarketSelectorGroup>

      <MarketSelectorGroup>
        <MarketSelectorLabel>비교 거래소</MarketSelectorLabel>
        <MarketSelect
          value={selectedCompareMarket}
          onChange={(e) =>
            onMarketChange("compare", e.target.value as MarketType)
          }
          disabled={disabled}
        >
          {marketOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={
                !option.hasWebsocket || option.value === selectedMainMarket
              }
            >
              {option.label} {!option.hasWebsocket && "(준비중)"}
            </option>
          ))}
        </MarketSelect>
      </MarketSelectorGroup>
    </MarketSelectorContainer>
  );
};

export default MarketSelector;
