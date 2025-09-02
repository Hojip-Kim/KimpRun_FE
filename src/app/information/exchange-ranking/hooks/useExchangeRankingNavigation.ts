'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export interface UseExchangeRankingNavigationReturn {
  currentPage: number;
  currentSize: number;
  navigateToPage: (page: number) => void;
  navigateToSize: (size: number) => void;
  navigateToPageAndSize: (page: number, size: number) => void;
}

export function useExchangeRankingNavigation(): UseExchangeRankingNavigationReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentSize = parseInt(searchParams.get('size') || '100', 10);

  const createUrl = useCallback((page: number, size: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (size !== 100) params.set('size', size.toString());

    const queryString = params.toString();
    return queryString
      ? `/information/exchange-ranking?${queryString}`
      : '/information/exchange-ranking';
  }, []);

  const navigateToPage = useCallback(
    (page: number) => {
      const url = createUrl(page, currentSize);
      router.push(url);
    },
    [router, createUrl, currentSize]
  );

  const navigateToSize = useCallback(
    (size: number) => {
      const url = createUrl(1, size);
      router.push(url);
    },
    [router, createUrl]
  );

  const navigateToPageAndSize = useCallback(
    (page: number, size: number) => {
      const url = createUrl(page, size);
      router.push(url);
    },
    [router, createUrl]
  );

  return {
    currentPage,
    currentSize,
    navigateToPage,
    navigateToSize,
    navigateToPageAndSize,
  };
}
