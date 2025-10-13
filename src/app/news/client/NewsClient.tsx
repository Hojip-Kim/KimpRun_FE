'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/components/common/Pagination';
import { NewsItem, NewsPageResponse, NewsSource, NEWS_SOURCES } from '../types';
import { clientRequest } from '@/server/fetch/client';
import { clientEnv } from '@/utils/env';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  NewsContainer,
  NewsHeader,
  NewsTitle,
  SourceTabs,
  SourceTab,
  NewsGrid,
  NewsCard,
  NewsThumbnail,
  PlaceholderIcon,
  NewsContent,
  NewsCardHeader,
  SourceBadge,
  NewsDate,
  NewsCardTitle,
  NewsDescription,
  NewsKeywords,
  Keyword,
  EmptyState,
  EmptyIcon,
  EmptyText,
  LoadingContainer,
  LoadingSpinner,
  HeadlineBadge,
  NewsActionButton,
} from './style';

interface NewsClientPageProps {
  initialData: NewsPageResponse;
  initialSource: NewsSource;
  initialPage: number;
}

const NewsClientPage: React.FC<NewsClientPageProps> = ({
  initialData,
  initialSource,
  initialPage,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [newsData, setNewsData] = useState<NewsPageResponse>(initialData);
  const [currentSource, setCurrentSource] = useState<NewsSource>(initialSource);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);

  const pageSize = 20;

  // 뉴스 데이터 가져오기
  const fetchNewsData = async (source: NewsSource, page: number) => {
    setIsLoading(true);

    try {
      let endpoint: string;

      if (source === 'All') {
        endpoint = `${clientEnv.API_BASE_URL}/news?page=${page}&size=${pageSize}`;
      } else {
        const sourceCode = NEWS_SOURCES[source].code;
        endpoint = `${clientEnv.API_BASE_URL}/news/source/${sourceCode}?page=${page}&size=${pageSize}`;
      }

      const response = await clientRequest.get<NewsPageResponse>(endpoint, {
        cache: 'no-store',
      });

      if (response.success && response.data) {
        setNewsData(response.data);
      } else {
        console.error('뉴스 데이터 가져오기 실패:', response.error);
      }
    } catch (error) {
      console.error('뉴스 데이터 요청 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 소스 변경 핸들러
  const handleSourceChange = (source: NewsSource) => {
    setCurrentSource(source);
    setCurrentPage(1);
    router.push(`/news?source=${source}&page=1`);
    fetchNewsData(source, 1);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`/news?source=${currentSource}&page=${page}`);
    fetchNewsData(currentSource, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 뉴스 카드 클릭 핸들러 (상세 페이지로 이동)
  const handleCardClick = (newsId: number) => {
    router.push(`/news/${newsId}`);
  };

  // 날짜 포맷팅
  const formatDate = (epochMillis: number) => {
    try {
      return formatDistanceToNow(new Date(epochMillis), {
        addSuffix: true,
        locale: ko,
      });
    } catch {
      return '방금 전';
    }
  };

  // 뉴스 아이템 렌더링
  const renderNewsItem = (news: NewsItem) => {
    return (
      <NewsCard
        key={news.id}
        onClick={() => handleCardClick(news.id)}
      >
        <NewsThumbnail hasImage={!!news.thumbnail}>
          {news.thumbnail ? (
            <img src={news.thumbnail} alt={news.title} />
          ) : (
            <PlaceholderIcon>📰</PlaceholderIcon>
          )}
        </NewsThumbnail>
        <NewsContent>
          <NewsCardHeader>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <SourceBadge source={news.newsSource}>
                {news.newsSource === 'BloomingBit' ? '블루밍비트' : '코인니스'}
              </SourceBadge>
              {news.isHeadline && <HeadlineBadge>헤드라인</HeadlineBadge>}
            </div>
            <NewsDate>{formatDate(news.createEpochMillis)}</NewsDate>
          </NewsCardHeader>
          <NewsCardTitle>{news.title}</NewsCardTitle>
          <NewsDescription>
            {news.shortContent}
          </NewsDescription>
          {news.keywords && news.keywords.length > 0 && (
            <NewsKeywords>
              {news.keywords.slice(0, 3).map((keyword, index) => (
                <Keyword key={index}>{keyword}</Keyword>
              ))}
            </NewsKeywords>
          )}
        </NewsContent>
      </NewsCard>
    );
  };

  const news = newsData?.content || [];
  const totalPages = newsData?.totalPages || 0;
  const totalElements = newsData?.totalElements || 0;

  return (
    <NewsContainer>
      <NewsHeader>
        <NewsTitle>📰 암호화폐 뉴스</NewsTitle>
        <SourceTabs>
          {(Object.keys(NEWS_SOURCES) as NewsSource[]).map((source) => (
            <SourceTab
              key={source}
              active={currentSource === source}
              onClick={() => handleSourceChange(source)}
              disabled={isLoading}
            >
              {NEWS_SOURCES[source].name}
            </SourceTab>
          ))}
        </SourceTabs>
      </NewsHeader>

      {isLoading ? (
        <LoadingContainer>
          <LoadingSpinner />
          <p style={{ marginTop: '1rem' }}>뉴스를 불러오는 중...</p>
        </LoadingContainer>
      ) : news.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📭</EmptyIcon>
          <EmptyText>표시할 뉴스가 없습니다.</EmptyText>
        </EmptyState>
      ) : (
        <>
          <NewsGrid>{news.map(renderNewsItem)}</NewsGrid>
          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showInfo={false}
            />
          )}
        </>
      )}
    </NewsContainer>
  );
};

export default NewsClientPage;
