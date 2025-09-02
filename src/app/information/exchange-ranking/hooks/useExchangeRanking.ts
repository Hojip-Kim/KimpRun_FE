'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchExchangeRankingClient } from '../services/exchangeRankingService';
import {
  ExchangeRankingState,
  ExchangeRankingParams,
} from '@/types/exchangeRanking';

export function useExchangeRanking(initialParams: ExchangeRankingParams = {}) {
  const [state, setState] = useState<ExchangeRankingState>({
    data: [],
    loading: true,
    error: null,
    totalPages: 0,
    totalElements: 0,
    currentPage: initialParams.page || 1,
    pageSize: initialParams.size || 100,
  });

  const fetchData = useCallback(
    async (params?: ExchangeRankingParams) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // API에 1-based 페이지 직접 전달 (코인랭킹과 동일)
        const response = await fetchExchangeRankingClient({
          page: params?.page ?? state.currentPage,
          size: params?.size ?? state.pageSize,
        });

        console.log(response);

        setState((prev) => ({
          ...prev,
          data: response.content,
          loading: false,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          currentPage: params?.page ?? prev.currentPage,
          pageSize: params?.size ?? prev.pageSize,
        }));
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: {
            message: error.message || 'Failed to fetch exchange ranking data',
            status: error.status,
          },
        }));
      }
    },
    [state.currentPage, state.pageSize]
  );

  const setPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= state.totalPages) {
        fetchData({ page, size: state.pageSize });
      }
    },
    [fetchData, state.totalPages, state.pageSize]
  );

  const setPageSize = useCallback(
    (size: number) => {
      fetchData({ page: 1, size });
    },
    [fetchData]
  );

  const refresh = useCallback(() => {
    fetchData({ page: state.currentPage, size: state.pageSize });
  }, [fetchData, state.currentPage, state.pageSize]);

  useEffect(() => {
    fetchData(initialParams);
  }, []);

  return {
    ...state,
    setPage,
    setPageSize,
    refresh,
  };
}
