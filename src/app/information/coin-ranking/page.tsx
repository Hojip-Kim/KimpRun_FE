import React from 'react';
import { Metadata } from 'next';
import { CoinRankingService } from './services/coinRankingService';
import { CoinRankingResponse } from '@/types/coinRanking';
import CoinRankingLayoutClient from './components/CoinRankingLayoutClient';

interface CoinRankingPageProps {
  searchParams: {
    page?: string;
    size?: string;
  };
}

/**
 * 서버 컴포넌트: 데이터 페칭 및 SEO 최적화
 */
export default async function CoinRankingPage({
  searchParams,
}: CoinRankingPageProps) {
  const page = Number(searchParams.page) || 1;
  const size = Number(searchParams.size) || 100;

  let initialData: CoinRankingResponse | null = null;
  let error: string | null = null;

  try {
    // 서버에서 초기 데이터 로딩 (SSR)
    initialData = await CoinRankingService.getCoinRanking(page, size);
  } catch (err) {
    console.error('서버에서 코인 순위 데이터 로딩 실패:', err);
    error =
      err instanceof Error
        ? err.message
        : '데이터를 불러오는 중 오류가 발생했습니다.';
  }

  // 클라이언트 컴포넌트로 데이터 전달
  return (
    <CoinRankingLayoutClient
      initialData={initialData}
      initialError={error}
      initialPage={page}
      initialSize={size}
    />
  );
}

/**
 * SEO 메타데이터 생성 (서버 컴포넌트)
 */
export async function generateMetadata({
  searchParams,
}: CoinRankingPageProps): Promise<Metadata> {
  const page = Number(searchParams.page) || 1;

  try {
    const data = await CoinRankingService.getCoinRanking(page, 10);
    const totalCoins = data.data.totalElements;
    const totalPages = data.data.totalPages;

    return {
      title: `코인 순위 ${page}페이지 | 실시간 암호화폐 시가총액 순위 | 김프런(kimprun)`,
      description: `${totalCoins.toLocaleString()}개 암호화폐의 실시간 시가총액 순위를 확인하세요. 비트코인, 이더리움 등 주요 코인들의 가격, 변동률, 시가총액 정보를 제공합니다. (${page}/${totalPages} 페이지)`,
      keywords: [
        '암호화폐',
        '코인 순위',
        '시가총액',
        '비트코인',
        '이더리움',
        '알트코인',
        '가격',
        '차트',
        '투자',
        '블록체인',
      ],
      openGraph: {
        title: `코인 순위 ${page}페이지 | 실시간 암호화폐 시가총액`,
        description: `${totalCoins.toLocaleString()}개 암호화폐의 실시간 순위 정보`,
        type: 'website',
        url: `/information/coin-ranking?page=${page}`,
        images: [
          {
            url: '/logo.png',
            width: 1200,
            height: 630,
            alt: '코인 순위 페이지',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `코인 순위 ${page}페이지`,
        description: `${totalCoins.toLocaleString()}개 암호화폐의 실시간 순위`,
        images: ['/logo.png'],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      alternates: {
        canonical: `/information/coin-ranking?page=${page}`,
      },
    };
  } catch (error) {
    // 메타데이터 생성 실패 시 기본값 반환
    return {
      title: '코인 순위 | 실시간 암호화폐 시가총액 순위',
      description:
        '실시간 암호화폐 시가총액 순위를 확인하세요. 비트코인, 이더리움 등 주요 코인들의 가격과 시장 정보를 제공합니다.',
      keywords: ['암호화폐', '코인 순위', '시가총액', '비트코인', '이더리움'],
    };
  }
}
