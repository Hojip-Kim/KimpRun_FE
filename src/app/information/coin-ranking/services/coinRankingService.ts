import { CoinRankingResponse } from '@/types/coinRanking';
import { clientEnv } from '@/utils/env';

export class CoinRankingService {
  /**
   * 코인 순위 데이터를 가져옵니다
   * @param page 페이지 번호 (1부터 시작)
   * @param size 페이지당 항목 수
   * @returns 코인 순위 응답 데이터
   */
  static async getCoinRanking(
    page: number = 1,
    size: number = 100
  ): Promise<CoinRankingResponse> {
    try {
      const response = await fetch(
        `${clientEnv.API_BASE_URL}/api/cmc/coin/all?page=${page}&size=${size}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // SSR에서 캐싱 전략
          next: {
            revalidate: 60, // 60초마다 재검증
            tags: ['coin-ranking'], // 캐시 태그
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `API 요청 실패: ${response.status} ${response.statusText}`
        );
      }

      const data: CoinRankingResponse = await response.json();

      // 데이터 유효성 검증
      if (!data || !data.data || !Array.isArray(data.data.content)) {
        throw new Error('잘못된 API 응답 형식');
      }

      return data;
    } catch (error) {
      console.error('코인 순위 데이터 조회 중 오류:', error);
      throw error;
    }
  }

  /**
   * 클라이언트 사이드에서 사용하는 코인 순위 데이터 조회
   * @param page 페이지 번호
   * @param size 페이지당 항목 수
   * @returns 코인 순위 응답 데이터
   */
  static async getCoinRankingClient(
    page: number = 1,
    size: number = 100
  ): Promise<CoinRankingResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/cmc/coin/all?page=${page}&size=${size}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // 클라이언트에서는 캐시하지 않음 (실시간 데이터)
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error(
          `API 요청 실패: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('클라이언트 코인 순위 데이터 조회 중 오류:', error);
      throw error;
    }
  }
}
