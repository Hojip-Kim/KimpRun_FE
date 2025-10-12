// 코인순위 API 응답 타입 (직접 페이지네이션 객체 반환)
export interface CoinRankingResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: CoinRankingItem[];
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
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
