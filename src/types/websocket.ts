// 웹소켓 공통 래퍼
export interface MarketInfoWebsocketDto<T> {
  type: string;
  data: T;
}

// 공지사항 데이터
export interface NoticeDto {
  id: number;
  exchangeType: string; // MarketType enum
  title: string;
  url: string;
  createdAt: string; // LocalDateTime -> string
  exchangeUrl?: string;
}

// 시장 정보 응답
export interface InfoResponseDto {
  type: string;
  userData: UserWebsocketResponseDto;
  marketData: MarketWebsocketResponseDto;
}

export interface UserWebsocketResponseDto {
  userCount: number;
}

export interface MarketWebsocketResponseDto {
  dollar: number;
  tether: number;
}
