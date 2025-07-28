import { firstDataSet, secondDataSet } from '@/app/types';
import { TokenNameMapping } from '@/app/types';

export interface RowType {
  firstTokenNameList: string[];
  firstTokenDataList: any;
  secondTokenDataList: any;
  firstDataset: any;
  secondDataset: any;
  filteredTokens: string[];
  tokenMapping?: TokenNameMapping; // 추가: symbol-id 매핑 정보
}

export type dataListType = {
  acc_trade_price24: number;
  change_rate: number;
  highest_price: number;
  lowest_price: number;
  opening_price: number;
  rate_change: number;
  token: string;
  trade_price: number;
  trade_volume: number;
  secondPrice: number | undefined;
  kimp: number | undefined;
};

// Coin 상세 정보 타입
export interface CoinDetail {
  symbol: string;
  name: string;
  logo: string;
  maxSupply: string;
  totalSupply: string;
  circulatingSupply: string;
  marketCap: string;
  explorerUrl: string[];
  platforms: string[];
  rank: number;
  lastUpdated: string;
}
