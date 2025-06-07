import React from 'react';
import NoticeClientPage from '../client/NoticeClientPage';
import { MarketType } from '@/types/marketType';
import { fetchServerNotice } from '../api/serverDataFetch';
import './NoticeServerPage.css';

interface NoticeServerProps {
  initialMarketType: MarketType;
}

const NoticeServerPage = async ({ initialMarketType }: NoticeServerProps) => {
  const initialNoticeData = await fetchServerNotice({
    marketType: initialMarketType,
    page: 0,
    size: 15,
  });

  if (!initialNoticeData.success) {
    const errorMessage =
      typeof initialNoticeData.error === 'string'
        ? initialNoticeData.error
        : '공지사항을 불러오는데 실패했습니다.';

    return (
      <div className="notice-error-container">
        <h3 className="notice-error-title">⚠️ 공지사항 로딩 실패</h3>
        <p className="notice-error-message">Error: {errorMessage}</p>
        <p className="notice-error-message">
          상태 코드: {initialNoticeData.status}
        </p>
      </div>
    );
  } else {
    return <NoticeClientPage initialNoticeData={initialNoticeData.data} />;
  }
};

export default NoticeServerPage;
