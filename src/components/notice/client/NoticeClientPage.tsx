'use client';

import React, { useState } from 'react';
import { Notice, NoticeResponse } from '../type';
import { MarketType } from '@/types/marketType';
import { fetchClientNotice } from '../api/clientDataFetch';
import {
  NoticeContainer,
  NoticeHeader,
  NoticeTitle,
  NoticeList,
  NoticeItem,
  NoticeItemHeader,
  ExchangeBadge,
  NoticeDate,
  NoticeItemTitle,
  NoticeUrl,
  EmptyNotice,
  LoadingSpinner,
  ExchangeSelector,
  SelectorWrapper,
} from './style';

interface NoticeClientProps {
  initialNoticeData: NoticeResponse;
}

const NoticeClientPage = ({ initialNoticeData }: NoticeClientProps) => {
  const [noticeData, setNoticeData] = useState<Notice[]>(
    initialNoticeData.data.content
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<MarketType>(
    initialNoticeData.marketType || MarketType.ALL
  );

  const formatDate = (date: Date) => {
    const now = new Date();
    const noticeDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - noticeDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return '오늘';
    } else if (diffDays === 2) {
      return '어제';
    } else if (diffDays <= 7) {
      return `${diffDays - 1}일 전`;
    } else {
      return noticeDate.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const handleNoticeClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 거래소 변경 핸들러
  const handleMarketChange = async (marketType: MarketType) => {
    setSelectedMarket(marketType);
    setIsLoading(true);

    try {
      const response = await fetchClientNotice({
        marketType,
        page: 0,
        size: 15,
      });

      if (response.success && response.data?.data) {
        setNoticeData(response.data.data.content);
      } else {
        console.error('공지사항 로딩 실패:', response.error);
        setNoticeData([]);
      }
    } catch (error) {
      console.error('공지사항 로딩 중 오류:', error);
      setNoticeData([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <NoticeContainer>
        <NoticeHeader>
          <NoticeTitle>공지사항</NoticeTitle>
          <SelectorWrapper>
            <ExchangeSelector
              value={selectedMarket}
              onChange={(e) =>
                handleMarketChange(Number(e.target.value) as MarketType)
              }
            >
              <option value={MarketType.ALL}>전체</option>
              <option value={MarketType.UPBIT}>UPBIT</option>
              <option value={MarketType.BINANCE}>BINANCE</option>
              <option value={MarketType.COINONE}>COINONE</option>
              <option value={MarketType.BITHUMB}>BITHUMB</option>
            </ExchangeSelector>
          </SelectorWrapper>
        </NoticeHeader>
        <LoadingSpinner>로딩 중...</LoadingSpinner>
      </NoticeContainer>
    );
  }

  return (
    <NoticeContainer>
      <NoticeHeader>
        <NoticeTitle>공지사항</NoticeTitle>
        <SelectorWrapper>
          <ExchangeSelector
            value={selectedMarket}
            onChange={(e) =>
              handleMarketChange(Number(e.target.value) as MarketType)
            }
          >
            <option value={MarketType.ALL}>전체</option>
            <option value={MarketType.UPBIT}>UPBIT</option>
            <option value={MarketType.BINANCE}>BINANCE</option>
            <option value={MarketType.COINONE}>COINONE</option>
            <option value={MarketType.BITHUMB}>BITHUMB</option>
          </ExchangeSelector>
        </SelectorWrapper>
      </NoticeHeader>
      <NoticeList>
        {noticeData.length === 0 ? (
          <EmptyNotice>
            {selectedMarket === MarketType.ALL
              ? '공지사항이 없습니다.'
              : `${selectedMarket} 공지사항이 없습니다.`}
          </EmptyNotice>
        ) : (
          noticeData.map((notice) => (
            <NoticeItem
              key={notice.id}
              onClick={() => handleNoticeClick(notice.url)}
            >
              <NoticeItemHeader>
                <ExchangeBadge exchangeType={notice.exchangeType}>
                  {notice.exchangeType}
                </ExchangeBadge>
                <NoticeDate>{formatDate(notice.createdAt)}</NoticeDate>
              </NoticeItemHeader>
              <NoticeItemTitle>{notice.title}</NoticeItemTitle>
              <NoticeUrl
                href={notice.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                자세히 보기
              </NoticeUrl>
            </NoticeItem>
          ))
        )}
      </NoticeList>
    </NoticeContainer>
  );
};

export default NoticeClientPage;
