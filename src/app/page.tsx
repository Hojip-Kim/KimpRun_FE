import RowPageClient from './components/RowPageClient';
import NoticeServerPage from '@/components/notice/server/NoticeServerPage';
import { MarketType } from '@/types/marketType';
import TradingViewWidget from '@/components/tradingview/TradingViewWidget';
import './page.css';
import Chat from '@/components/chat/Chat';
import React, { Suspense } from 'react';
import { NoticeSkeleton, ChatSkeleton, ChartSkeleton } from '@/components/skeleton/Skeleton';

export const dynamic = 'force-dynamic';

const MainPage = async () => {
  return (
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
  );
};

export default MainPage;
