import { Notice } from '../notice/type';

export interface MarketData {
  dollar: number;
  tether: number;
}

export interface UserData {
  userCount: number;
}

export interface MarketWebsocketPayload {
  userData: UserData;
  marketData: MarketData;
}

export type MarketWebsocketData =
  | {
      type: 'market';
      data: MarketWebsocketPayload;
    }
  | {
      type: 'notice';
      data: Notice[];
    };
