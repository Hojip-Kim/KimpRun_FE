import { CoinRankingResponse } from '@/types/coinRanking';
import { clientEnv, serverEnv } from '@/utils/env';
import { serverRequest, clientRequest } from '@/server/fetch';

/**
 * 코인 순위 데이터를 가져옵니다 (SSR용)
 * @param page 페이지 번호 (1부터 시작)
 * @param size 페이지당 항목 수
 * @returns 코인 순위 응답 데이터
 */
export const getCoinRanking = async (
  page: number = 1,
  size: number = 100
): Promise<CoinRankingResponse> => {
  try {
    const response = await serverRequest.get<CoinRankingResponse>(
      `/cmc/coin/all?page=${page}&size=${size}`,
      {
        next: {
          revalidate: 60, // 60초마다 재검증
          tags: ['coin-ranking'], // 캐시 태그
        },
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'API 요청 실패');
    }

    // 데이터 유효성 검증
    if (!response.data || !Array.isArray(response.data.content)) {
      throw new Error('잘못된 API 응답 형식');
    }

    return response.data;
  } catch (error) {
    console.error('코인 순위 데이터 조회 중 오류:', error);
    throw error;
  }
};

/**
 * 클라이언트 사이드에서 사용하는 코인 순위 데이터 조회
 * @param page 페이지 번호
 * @param size 페이지당 항목 수
 * @returns 코인 순위 응답 데이터
 */
export const getCoinRankingClient = async (
  page: number = 1,
  size: number = 100
): Promise<CoinRankingResponse> => {
  try {
    const response = await clientRequest.get<CoinRankingResponse>(
      `${clientEnv.API_BASE_URL}/cmc/coin/all?page=${page}&size=${size}`,
      {
        cache: 'no-store',
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'API 요청 실패');
    }

    return response.data;
  } catch (error) {
    console.error('클라이언트 코인 순위 데이터 조회 중 오류:', error);
    throw error;
  }
};

/**
 * 심볼로 코인을 검색합니다 (SSR용)
 * @param symbol 코인 심볼 (예: BTC, ETH)
 * @param page 페이지 번호
 * @param size 페이지당 항목 수
 * @returns 검색된 코인 순위 응답 데이터
 */
export const searchCoinBySymbol = async (
  symbol: string,
  page: number = 1,
  size: number = 100
): Promise<CoinRankingResponse> => {
  try {
    const response = await serverRequest.get<CoinRankingResponse>(
      `/cmc/coin/${symbol}?page=${page}&size=${size}`,
      {
        cache: 'no-store',
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || '코인 검색 실패');
    }

    // 데이터 유효성 검증
    if (!response.data || !Array.isArray(response.data.content)) {
      throw new Error('잘못된 검색 응답 형식');
    }

    return response.data;
  } catch (error) {
    console.error('코인 검색 중 오류:', error);
    throw error;
  }
};

/**
 * 클라이언트 사이드에서 심볼로 코인을 검색합니다
 * @param symbol 코인 심볼
 * @param page 페이지 번호
 * @param size 페이지당 항목 수
 * @returns 검색된 코인 순위 응답 데이터
 */
export const searchCoinBySymbolClient = async (
  symbol: string,
  page: number = 1,
  size: number = 100
): Promise<CoinRankingResponse> => {
  try {
    const response = await clientRequest.get<CoinRankingResponse>(
      `${clientEnv.API_BASE_URL}/cmc/coin/${symbol}?page=${page}&size=${size}`,
      {
        cache: 'no-store',
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || '코인 검색 실패');
    }

    return response.data;
  } catch (error) {
    console.error('클라이언트 코인 검색 중 오류:', error);
    throw error;
  }
};
