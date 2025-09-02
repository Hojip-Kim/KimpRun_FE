// 코인순위 API 응답 타입
export interface CoinRankingResponse {
  status: number;
  message: string;
  data: {
    totalPages: number;
    totalElements: number;
    size: number;
    content: CoinRankingItem[];
  };
}

// 개별 코인 정보 타입
export interface CoinRankingItem {
  symbol: string;
  name: string;
  slug: string;
  logo: string;
  rank: string;
  description: string;
  dominance: number;
  maxSupply: string;
  totalSupply: string;
  circulatingSupply: string;
  marketCap: string;
  fullyDilutedMarektCap: string;
  selfReportedCirculatingSupply: string;
  selfReportedMarketCap: string;
  lastUpdated: string;
  dateAdded: string;
  platform: string[];
  explorerUrl: string[];
}

// 테이블 행 프롭스 타입
export interface CoinRankingRowProps {
  coin: CoinRankingItem;
  isExpanded: boolean;
  onClick: () => void;
}

// 페이지네이션 프롭스 타입
export interface CoinRankingPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// 확장된 행 상세정보 프롭스 타입
export interface CoinDetailExpandedProps {
  coin: CoinRankingItem;
}
