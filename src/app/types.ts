export interface TokenNameList {
  firstMarketData: any;
  secondMarketData: any;
}

export interface tokenNameList {
  firstMarketList: string[];
  secondMarketList: string[];
}

export interface firstDataSet {
  acc_trade_price24: number;
  change_rate: number;
  highest_price: number;
  lowest_price: number;
  opening_price: number;
  rate_change: string;
  token: string;
  trade_price: number;
  trade_volume: number;
}

export interface secondDataSet {
  token: string;
  trade_price: number;
}

export interface MainPageProps {
  initialTokenNames: tokenNameList | null;
  initialCombinedData: {
    firstMarketDataList: { [key: string]: firstDataSet };
    secondMarketDataList: { [key: string]: secondDataSet };
  } | null;
}
