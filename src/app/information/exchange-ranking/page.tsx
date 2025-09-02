import { Metadata } from 'next';
import { fetchExchangeRankingServer } from './services/exchangeRankingService';
import ExchangeRankingClientPage from './components/ExchangeRankingClientPage';
import InformationSubNav from '../client/InformationSubNav';
import {
  ExchangeRankingItem,
  ExchangeRankingError,
} from '@/types/exchangeRanking';

interface ExchangeRankingPageProps {
  searchParams: {
    page?: string;
    size?: string;
  };
}

export default async function ExchangeRankingPage({
  searchParams,
}: ExchangeRankingPageProps) {
  const page = parseInt(searchParams.page || '1', 10);
  const size = parseInt(searchParams.size || '100', 10);

  // API에 1-based 페이지 직접 전달 (코인랭킹과 동일)
  const apiPage = page;
  const apiSize = Math.min(Math.max(25, size), 200); // 25-200 범위로 제한

  let initialData: ExchangeRankingItem[] = [];
  let initialError: ExchangeRankingError | null = null;
  let initialTotalPages = 0;
  let initialTotalElements = 0;

  try {
    const response = await fetchExchangeRankingServer({
      page: apiPage,
      size: apiSize,
    });

    // 이제 response가 직접 백엔드 응답 구조
    initialData = response.content;
    initialTotalPages = response.totalPages;
    initialTotalElements = response.totalElements;
  } catch (error: any) {
    console.error('Failed to fetch exchange ranking data:', error);
    initialError = {
      message: error.message || 'Failed to fetch exchange ranking data',
      status: error.status,
    };
  }

  return (
    <>
      <InformationSubNav currentPath="/information/exchange-ranking" />
      <ExchangeRankingClientPage
        initialData={initialData}
        initialError={initialError}
        initialPage={page}
        initialSize={size}
        initialTotalPages={initialTotalPages}
        initialTotalElements={initialTotalElements}
      />
    </>
  );
}

export async function generateMetadata({
  searchParams,
}: ExchangeRankingPageProps): Promise<Metadata> {
  const page = parseInt(searchParams.page || '1', 10);
  const size = parseInt(searchParams.size || '100', 10);

  const title =
    page > 1 ? `거래소 랭킹 (${page}페이지) | 김프런` : '거래소 랭킹 | 김프런';

  const description = `전 세계 주요 암호화폐 거래소들의 실시간 거래량과 수수료 정보를 확인하세요. 페이지 ${page}, ${size}개 거래소 표시 중. 바이낸스, 업비트 등 주요 거래소의 상세 정보와 지원 법정화폐를 한눈에 비교해보세요.`;

  const canonical =
    page > 1 || size !== 100
      ? `https://kimprun.com/information/exchange-ranking?page=${page}&size=${size}`
      : 'https://kimprun.com/information/exchange-ranking';

  return {
    title,
    description,
    keywords: [
      '거래소 랭킹',
      '암호화폐 거래소',
      '거래량',
      '바이낸스',
      '업비트',
      '코인베이스',
      '거래소 수수료',
      '거래소 비교',
      '법정화폐 지원',
      '김프런',
      'cryptocurrency exchange',
      'trading volume',
      'exchange ranking',
    ].join(', '),
    authors: [{ name: '김프런' }],
    creator: '김프런',
    publisher: '김프런',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://kimprun.com'),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: '김프런',
      locale: 'ko_KR',
      type: 'website',
      images: [
        {
          url: '/logo.png',
          width: 800,
          height: 600,
          alt: '김프런 - 거래소 랭킹',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/logo.png'],
      creator: '@kimprun',
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION_CODE,
    },
    other: {
      'application-name': '김프런',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': '김프런',
      'format-detection': 'telephone=no',
    },
  };
}
