export interface MarketDataDto {
  token: string;
  trade_price: number;
  change_rate: number;
  rate_change: string;
  acc_trade_price24: number;
  highest_price: number;
  lowest_price: number;
  opening_price: number;
  trade_volume: number;
}

export interface UpbitDto extends MarketDataDto {}
export interface BinanceDto extends MarketDataDto {}
export interface CoinoneDto extends MarketDataDto {}
export interface BithumbDto extends MarketDataDto {}

export interface MultipleMarketDataResponse {
  upbitData: UpbitDto[];
  binanceData: BinanceDto[];
  coinoneData: CoinoneDto[];
  bithumbData: BithumbDto[];
}

export type MarketDataMap = {
  [token: string]: MarketDataDto;
};
