import React from 'react';
import RowPageClient from './components/RowPageClient';
import NoticeServerPage from '@/components/notice/server/NoticeServerPage';
import { MarketType } from '@/types/marketType';
import TradingViewWidget from '@/components/tradingview/TradingViewWidget';
import './page.css';
import Chat from '@/components/chat/Chat';

export const dynamic = 'force-dynamic';

const MainPage = async () => {
  return (
    <div className="main-page-container">
      <div className="left-aside-container">
        <div className="chart-container">
          <TradingViewWidget />
        </div>
        <div className="notice-container">
          <NoticeServerPage initialMarketType={MarketType.ALL} />
        </div>
      </div>
      <div className="center-aside-container">
        <RowPageClient />
      </div>
      <div className="right-aside-container">
        <Chat />
      </div>
    </div>
  );
};

export default MainPage;
