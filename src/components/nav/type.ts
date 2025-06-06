export enum marketEnum {
  BINANCE = 'BINANCE',
  UPBIT = 'UPBIT',
  COINONE = 'COINONE',
  BITHUMB = 'BITHUMB',
}

export interface noticeData {
  title: string;
  alink: string;
  date: Date;
}

export interface noticeWebsocketData {
  type: 'notice';
  exchange_name: string;
  absoluteUrl: string;
  noticeDataList: noticeData[];
}

export interface marketWebsocketData {
  type: 'market';
  userData: {
    userCount: number;
  };
  marketData: {
    dollar: number;
    tether: number;
  };
};
