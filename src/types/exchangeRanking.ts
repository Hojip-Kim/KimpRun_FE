export interface ExchangeRankingItem {
  name: string;
  slug: string;
  fiats: string[];
  description: string;
  logo: string;
  fee: number;
  spotVolumeUsd: number;
  url: string;
  isSupported: boolean;
  dateLaunched: string;
  updatedAt: string;
}

export interface ExchangeRankingResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: ExchangeRankingItem[];
}

export interface ExchangeRankingParams {
  page?: number;
  size?: number;
}

export interface ExchangeRankingError {
  message: string;
  status?: number;
}

export interface ExchangeRankingState {
  data: ExchangeRankingItem[];
  loading: boolean;
  error: ExchangeRankingError | null;
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}
