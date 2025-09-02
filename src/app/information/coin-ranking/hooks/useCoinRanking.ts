'use client';

import { useState, useCallback } from 'react';
import { CoinRankingResponse } from '@/types/coinRanking';
import { CoinRankingService } from '../services/coinRankingService';

export interface UseCoinRankingReturn {
  data: CoinRankingResponse | null;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * 코인 순위 데이터 관리 훅
 * @param initialData 초기 데이터
 * @param initialError 초기 에러
 * @returns 코인 순위 상태와 액션들
 */
export function useCoinRanking(
  initialData: CoinRankingResponse | null = null,
  initialError: string | null = null
): UseCoinRankingReturn {
  const [data, setData] = useState<CoinRankingResponse | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    clearError,
  };
}
