import { MarketType } from '@/types/marketType';
import { PageResponse } from '@/types/page';

export interface Notice {
  id: number;
  exchangeType: MarketType;
  title: string;
  url: string;
  createdAt: Date;
}

export interface NoticeResponse {
  data: PageResponse<Notice>;
  absoluteUrl: string;
  marketType: MarketType;
}

export interface NoticeParameter {
  marketType: MarketType;
  page: number;
  size: number;
}
