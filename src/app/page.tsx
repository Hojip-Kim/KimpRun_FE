import { Metadata } from 'next';
import RowPageClient from './components/RowPageClient';
import NoticeServerPage from '@/components/notice/server/NoticeServerPage';
import { MarketType } from '@/types/marketType';
import './page.css';
import Chat from '@/components/chat/Chat';
import React, { Suspense } from 'react';
import nextDynamic from 'next/dynamic';

const TradingViewWidget = nextDynamic(() => import('@/components/tradingview/TradingViewWidget'), { ssr: false });
import {
  NoticeSkeleton,
  ChatSkeleton,
  ChartSkeleton,
} from '@/components/skeleton/Skeleton';
import StructuredData, {
  financialServiceStructuredData,
  websiteStructuredData,
} from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: '김프런(Kimprun) - 김치프리미엄(kimchi premium) - kimprun.com',
  description:
    '업비트, 바이낸스, 코인원, 빗썸 등 주요 암호화폐 거래소의 비트코인, 이더리움 등 코인 가격을 실시간으로 비교하고 김치프리미엄 정보를 확인하세요. KIMPRUN에서 최적의 거래 타이밍을 찾으세요. 김프 역프 김프런',
  keywords: [
    '비트코인 가격',
    '이더리움 가격',
    '암호화폐 실시간 시세',
    '업비트 가격',
    '바이낸스 가격',
    '김치프리미엄',
    '코인 가격 비교',
    '암호화폐 거래소 비교',
    '실시간 차트',
    '코인 시장',
    '김프런',
    '김프 역프',
    '김프 역프 김프런',
    '김프 역프 김프런 김프런',
    '김프 역프 김프런 김프런',
    'kimprun',
    'kimchi premium',
    'kimchi premium kimprun',
  ],
  openGraph: {
    title: 'KIMPRUN - 실시간 암호화폐 가격 비교',
    description:
      '업비트, 바이낸스 등 주요 거래소 가격을 실시간으로 비교하고 김치프리미엄 정보를 확인하세요.',
    url: 'https://kimprun.com',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KIMPRUN 암호화폐 가격 비교 대시보드',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KIMPRUN - 실시간 암호화폐 가격 비교',
    description: '업비트, 바이낸스 등 주요 거래소 가격을 실시간으로 비교',
  },
  alternates: {
    canonical: 'https://kimprun.com',
  },
};

export const dynamic = 'force-dynamic';

const MainPage = async () => {
  return (
    <>
      {/* SEO를 위한 구조화된 데이터 */}
      <StructuredData data={websiteStructuredData} />
      <StructuredData data={financialServiceStructuredData} />

      <div className="main-page-container">
        <div className="left-aside-container">
          <div className="chart-container">
            <Suspense
              fallback={
                <div style={{ marginTop: 2 }}>
                  <ChartSkeleton height={200} />
                </div>
              }
            >
              <TradingViewWidget containerId="desktop-chart" />
            </Suspense>
          </div>
          <div className="notice-container">
            <Suspense fallback={<NoticeSkeleton items={8} />}>
              <NoticeServerPage initialMarketType={MarketType.ALL} />
            </Suspense>
          </div>
        </div>
        <div className="center-aside-container">
          <RowPageClient />
        </div>
        <div className="right-aside-container">
          <Suspense fallback={<ChatSkeleton />}>
            <Chat />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default MainPage;
