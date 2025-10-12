/**
 * 뉴스 응답 데이터 타입
 */
export interface NewsItem {
  /** 뉴스 ID */
  id: number;

  /** 뉴스 소스 (예: "BloomingBit", "Coinness") */
  newsSource: string;

  /** 뉴스 제목 */
  title: string;

  /** 썸네일 이미지 URL */
  thumbnail?: string;

  /** 짧은 내용 (리스트용 요약) */
  shortContent: string;

  /** 원본 뉴스 URL */
  sourceUrl: string;

  /** 뉴스 생성 시각 (epoch 밀리초) */
  createEpochMillis: number;

  /** 레코드 생성 시각 */
  createdAt: string;

  /** 뉴스 타입 (예: 속보, 일반기사) */
  newsType?: string;

  /** 뉴스 지역 (예: 국내, 해외) */
  region?: string;

  /** 감정 분석 결과 (예: POSITIVE, NEGATIVE, NEUTRAL) */
  sentiment?: string;

  /** 신규 뉴스 여부 */
  isNew?: boolean;

  /** 헤드라인 뉴스 여부 */
  isHeadline?: boolean;

  /** 뉴스 키워드 목록 */
  keywords?: string[];

  /** 뉴스 요약 목록 */
  summaries?: string[];

  /** 뉴스 인사이트 목록 */
  insights?: string[];
}

/**
 * 페이지네이션 뉴스 응답
 */
export interface NewsPageResponse {
  content: NewsItem[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * 뉴스 소스 타입
 */
export type NewsSource = 'BloomingBit' | 'Coinness' | 'All';

/**
 * 뉴스 소스 정보
 */
export interface NewsSourceInfo {
  code: string;
  name: string;
  description: string;
}

/**
 * 뉴스 소스 매핑
 */
export const NEWS_SOURCES: Record<NewsSource, NewsSourceInfo> = {
  All: {
    code: 'all',
    name: '전체',
    description: '모든 뉴스 소스',
  },
  BloomingBit: {
    code: 'BloomingBit',
    name: '블루밍비트',
    description: '블루밍비트 뉴스',
  },
  Coinness: {
    code: 'Coinness',
    name: '코인니스',
    description: '코인니스 뉴스',
  },
};
