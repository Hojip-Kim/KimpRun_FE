export enum marketEnum {
  BINANCE = 'BINANCE',
  UPBIT = 'UPBIT',
  COINONE = 'COINONE',
  BITHUMB = 'BITHUMB',
}

export type noticeData = {
  title: string;
  alink: string;
  date: Date;
};

export type noticeWebsocketData = {
  type: 'notice';
  exchange_name: string;
  absoluteUrl: string;
  noticeDataList: noticeData[];
};

export type marketWebsocketData = {
  type: 'market';
  userData: {
    userCount: number;
  };
  marketData: {
    dollar: number;
    tether: number;
  };
};
