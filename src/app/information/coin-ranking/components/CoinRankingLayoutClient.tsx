'use client';

import React from 'react';
import InformationLayout from '../../client/InformationLayout';
import InformationSubNav from '../../client/InformationSubNav';
import ErrorBoundary from './ErrorBoundary';
import CoinRankingClientPage from './CoinRankingClientPage';
import { CoinRankingResponse } from '@/types/coinRanking';

interface CoinRankingLayoutClientProps {
  initialData: CoinRankingResponse | null;
  initialError: string | null;
  initialPage: number;
  initialSize: number;
  searchSymbol?: string;
}

/**
 * 클라이언트 컴포넌트: 레이아웃과 UI 렌더링
 * 서버에서 가져온 데이터를 받아서 렌더링
 */
export default function CoinRankingLayoutClient({
  initialData,
  initialError,
  initialPage,
  initialSize,
  searchSymbol,
}: CoinRankingLayoutClientProps) {
  return (
    <InformationLayout>
      <InformationSubNav currentPath="/information/coin-ranking" />
      <ErrorBoundary>
        <CoinRankingClientPage
          initialData={initialData}
          initialError={initialError}
          initialPage={initialPage}
          initialSize={initialSize}
          searchSymbol={searchSymbol}
        />
      </ErrorBoundary>
    </InformationLayout>
  );
}
