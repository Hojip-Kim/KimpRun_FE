'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { NewsItem } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  DetailContainer,
  BackButton,
  DetailHeader,
  DetailTitle,
  DetailMeta,
  SourceBadge,
  HeadlineBadge,
  NewsDate,
  ThumbnailContainer,
  ThumbnailImage,
  PlaceholderIcon,
  DetailContent,
  ContentText,
  KeywordsSection,
  KeywordTag,
  ActionSection,
  ViewOriginalButton,
  SourceInfo,
} from './style';

interface NewsDetailClientProps {
  news: NewsItem;
}

const NewsDetailClient: React.FC<NewsDetailClientProps> = ({ news }) => {
  const router = useRouter();

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

  // 뒤로가기
  const handleBack = () => {
    router.back();
  };

  // 원문 보기
  const handleViewOriginal = () => {
    window.open(news.sourceUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <DetailContainer>
      <BackButton onClick={handleBack}>
        ← 목록으로
      </BackButton>

      <DetailHeader>
        <DetailMeta>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <SourceBadge source={news.newsSource}>
              {news.newsSource === 'BloomingBit' ? '블루밍비트' : '코인니스'}
            </SourceBadge>
            {news.isHeadline && <HeadlineBadge>헤드라인</HeadlineBadge>}
          </div>
          <NewsDate>{formatDate(news.createEpochMillis)}</NewsDate>
        </DetailMeta>

        <DetailTitle>{news.title}</DetailTitle>

        {news.keywords && news.keywords.length > 0 && (
          <KeywordsSection>
            {news.keywords.map((keyword, index) => (
              <KeywordTag key={index}>{keyword}</KeywordTag>
            ))}
          </KeywordsSection>
        )}
      </DetailHeader>

      {news.thumbnail && (
        <ThumbnailContainer>
          <ThumbnailImage src={news.thumbnail} alt={news.title} />
        </ThumbnailContainer>
      )}

      {!news.thumbnail && (
        <ThumbnailContainer>
          <PlaceholderIcon>📰</PlaceholderIcon>
        </ThumbnailContainer>
      )}

      <DetailContent>
        <ContentText>{news.shortContent}</ContentText>
      </DetailContent>

      <ActionSection>
        <ViewOriginalButton onClick={handleViewOriginal}>
          기사 원문 보러가기 🔗
        </ViewOriginalButton>
        <SourceInfo>
          출처: {news.newsSource === 'BloomingBit' ? '블루밍비트' : '코인니스'}
        </SourceInfo>
      </ActionSection>
    </DetailContainer>
  );
};

export default NewsDetailClient;
