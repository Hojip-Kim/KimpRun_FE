import {
  ExchangeRankingResponse,
  ExchangeRankingParams,
  ExchangeRankingError,
} from '@/types/exchangeRanking';
import { serverGet } from '@/server/fetch/server';
import { clientRequest } from '@/server/fetch/client';
import { clientEnv } from '@/utils/env';

// 서버 컴포넌트용 fetch (SSR) - 1-based 페이지
export async function fetchExchangeRankingServer(
  params: ExchangeRankingParams = {}
): Promise<ExchangeRankingResponse> {
  const { page = 1, size = 100 } = params;

  const searchParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  const API_BASE_URL = clientEnv.API_BASE_URL;
  const url = `${API_BASE_URL}/api/cmc/exchange/all?${searchParams.toString()}`;

  try {
    const response = await serverGet<ExchangeRankingResponse>(url, {
      next: { revalidate: 300 }, // 5분마다 재검증
    });

    if (!response.success || !response.data || response.status !== 200) {
      throw new Error(
        response.error || 'Failed to fetch exchange ranking data'
      );
    }

    return response.data;
  } catch (error) {
    const exchangeError: ExchangeRankingError = {
      message:
        error instanceof Error ? error.message : 'Unknown error occurred',
      status:
        error instanceof Error && 'status' in error
          ? (error as any).status
          : undefined,
    };
    throw exchangeError;
  }
}

// 클라이언트 컴포넌트용 fetch (CSR) - 1-based 페이지
export async function fetchExchangeRankingClient(
  params: ExchangeRankingParams = {}
): Promise<ExchangeRankingResponse> {
  const { page = 1, size = 100 } = params;

  const searchParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  const API_BASE_URL = clientEnv.API_BASE_URL;
  const url = `${API_BASE_URL}/api/cmc/exchange/all?${searchParams.toString()}`;

  try {
    const response = await clientRequest.get<ExchangeRankingResponse>(url);

    if (!response.success || !response.data || response.status !== 200) {
      throw new Error(
        response.error || 'Failed to fetch exchange ranking data'
      );
    }

    return response.data;
  } catch (error) {
    const exchangeError: ExchangeRankingError = {
      message:
        error instanceof Error ? error.message : 'Unknown error occurred',
      status:
        error instanceof Error && 'status' in error
          ? (error as any).status
          : undefined,
    };
    throw exchangeError;
  }
}
