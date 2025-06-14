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
  NewNoticeContainer,
  AnimatedNoticeList,
  NewNoticeItem,
  NewBadge,
  NoticeItemHeaderLeft,
  NoticeCompleteBanner,
} from './style';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { formatNoticeDate, isNewNotice } from '@/method/common_method';

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

  const [isAnimating, setIsAnimating] = useState(false);

  const isNewNoticeGenerated = useSelector(
    (state: RootState) => state.notice.isNewNoticeGenerated
  );

  const dispatch = useDispatch<AppDispatch>();
  const newNoticeData = useSelector((state: RootState) => state.notice.notice);

  useEffect(() => {
    if (isNewNoticeGenerated) {
      handleNewNoticeAnimation();
    }
  }, [isNewNoticeGenerated, newNoticeData]);

  const handleNewNoticeAnimation = async () => {
    if (!Array.isArray(newNoticeData) || newNoticeData.length === 0) {
      return;
    }

    setNoticeData((prev) => [newNoticeData[0], ...prev]);
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  const handleNoticeClick = (exchangeUrl: string, url: string) => {
    const fullUrl = exchangeUrl ? exchangeUrl + url : url;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

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
            <AnimatedNoticeList isSliding={isAnimating}>
              {noticeData.map((notice, index) => {
                return (
                  <NewNoticeContainer
                    key={`${notice.id}-${index}`}
                    isNewItem={index > 0}
                    isAnimating={isAnimating}
                  >
                    <NewNoticeItem
                      isAnimating={isAnimating && index === 0}
                      onClick={() =>
                        handleNoticeClick(notice.exchangeUrl || '', notice.url)
                      }
                    >
                      <NoticeItemHeader>
                        <NoticeItemHeaderLeft>
                          <ExchangeBadge
                            exchangeType={notice.exchangeType.toString()}
                          >
                            {notice.exchangeType}
                          </ExchangeBadge>
                          {isNewNotice(notice.createdAt) && (
                            <NewBadge>NEW</NewBadge>
                          )}
                        </NoticeItemHeaderLeft>
                        <NoticeDate>
                          {formatNoticeDate(notice.createdAt)}
                        </NoticeDate>
                      </NoticeItemHeader>
                      <NoticeItemTitle>{notice.title}</NoticeItemTitle>
                      <NoticeUrl
                        href={
                          notice.exchangeUrl
                            ? notice.exchangeUrl + notice.url
                            : notice.url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        자세히 보기
                      </NoticeUrl>
                    </NewNoticeItem>
                  </NewNoticeContainer>
                );
              })}
            </AnimatedNoticeList>

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
              <NoticeCompleteBanner>
                모든 공지사항을 확인했습니다.
              </NoticeCompleteBanner>
            )}
          </>
        )}
      </NoticeList>
    </NoticeContainer>
  );
};

export default NoticeClientPage;
