import { firstDataSet, secondDataSet } from '@/app/types';

export interface RowType {
  firstTokenNameList: string[];
  firstTokenDataList: any;
  secondTokenDataList: any;
  firstDataset: { [key: string]: firstDataSet };
  secondDataset: { [key: string]: secondDataSet };
  filteredTokens: string[];
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
