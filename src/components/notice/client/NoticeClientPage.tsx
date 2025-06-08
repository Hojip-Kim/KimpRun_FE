'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  LoadingIndicator,
  NoticeLoadingSpinner,
  LoadingText,
} from './style';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setIsNewNoticeGenerated } from '@/redux/reducer/noticeReducer';
import { formatNoticeDate } from '@/method/common_method';

interface NoticeClientProps {
  initialNoticeData: NoticeResponse;
}

const NoticeClientPage = ({ initialNoticeData }: NoticeClientProps) => {
  const [noticeData, setNoticeData] = useState<Notice[]>(
    initialNoticeData.data.content
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<MarketType>(
    initialNoticeData.marketType || MarketType.ALL
  );

  // 무한스크롤을 위한 상태 제공
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(!initialNoticeData.data.last);
  const [pageSize] = useState(15);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isNewNoticeGenerated = useSelector(
    (state: RootState) => state.notice.isNewNoticeGenerated
  );

  const dispatch = useDispatch<AppDispatch>();

  const newNoticeData = useSelector((state: RootState) => state.notice.notice);

  useEffect(() => {
    if (isNewNoticeGenerated) {
      setNoticeData([...newNoticeData, ...noticeData]);
    }
    dispatch(setIsNewNoticeGenerated(false));
  }, [isNewNoticeGenerated, newNoticeData]);

  const handleNoticeClick = (exchangeUrl: string, url: string) => {
    window.open(exchangeUrl + url, '_blank', 'noopener,noreferrer');
  };

  // 첫 페이지 데이터 로딩 (거래소 변경 시)
  const loadInitialData = async (marketType: MarketType) => {
    setIsLoading(true);

    try {
      const requestParams = {
        marketType,
        page: 0,
        size: pageSize,
      };

      const response = await fetchClientNotice(requestParams);

      if (response.success && response.data?.data) {
        setNoticeData(response.data.data.content);
        setCurrentPage(0);
        const hasMoreData = !response.data.data.last;
        setHasMore(hasMoreData);
      } else {
        console.error('❌ 공지사항 로딩 실패:', response.error);
        setNoticeData([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('❌ 공지사항 로딩 중 오류:', error);
      setNoticeData([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 추가 데이터 로딩 (무한스크롤)
  const loadMoreData = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const requestParams = {
        marketType: selectedMarket,
        page: nextPage,
        size: pageSize,
      };

      const response = await fetchClientNotice(requestParams);

      if (response.success && response.data?.data) {
        const newContent = response.data.data.content;
        setNoticeData((prev) => {
          return [...prev, ...newContent];
        });
        setCurrentPage(nextPage);
        setHasMore(!response.data.data.last);
      } else {
        console.error('❌ 추가 공지사항 로딩 실패:', response.error);
        setHasMore(false);
      }
    } catch (error) {
      console.error('❌ 추가 공지사항 로딩 중 오류:', error);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [selectedMarket, currentPage, pageSize, isLoadingMore, hasMore]);

  // 스크롤 이벤트 핸들러
  // 무한스크롤 로딩 조건 충족 시 추가 데이터 로딩
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || isLoadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const threshold = 100;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceFromBottom < threshold) {
      loadMoreData();
    }
  }, [loadMoreData, isLoadingMore, hasMore]);

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // 거래소 변경 핸들러 등록
  const handleMarketChange = async (marketType: MarketType) => {
    setSelectedMarket(marketType);
    await loadInitialData(marketType);
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

      <NoticeList ref={scrollContainerRef}>
        {noticeData.length === 0 ? (
          <EmptyNotice>
            {selectedMarket === MarketType.ALL
              ? '공지사항이 없습니다.'
              : `${selectedMarket} 공지사항이 없습니다.`}
          </EmptyNotice>
        ) : (
          <>
            {noticeData.map((notice, index) => (
              <NoticeItem
                key={`${notice.id}-${index}`}
                onClick={() =>
                  handleNoticeClick(notice.exchangeUrl, notice.url)
                }
              >
                <NoticeItemHeader>
                  <ExchangeBadge exchangeType={notice.exchangeType}>
                    {notice.exchangeType}
                  </ExchangeBadge>
                  <NoticeDate>{formatNoticeDate(notice.createdAt)}</NoticeDate>
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
            ))}

            {/* 무한스크롤 로딩 인디케이터 */}
            {isLoadingMore && (
              <LoadingIndicator>
                <LoadingText>
                  <NoticeLoadingSpinner />더 많은 공지사항을 불러오는 중...
                </LoadingText>
              </LoadingIndicator>
            )}

            {/* 더 이상 로드할 데이터가 없을 때 */}
            {!hasMore && noticeData.length > 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: '#666',
                  fontSize: '14px',
                  borderTop: '1px solid #333',
                  marginTop: '10px',
                }}
              >
                모든 공지사항을 확인했습니다.
              </div>
            )}
          </>
        )}
      </NoticeList>
    </NoticeContainer>
  );
};

export default NoticeClientPage;
