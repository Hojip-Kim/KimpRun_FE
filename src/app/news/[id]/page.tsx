import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NewsDetailClient from './client/NewsDetailClient';
import { serverGet } from '@/server/fetch/server';
import { serverEnv } from '@/utils/env';
import { NewsItem } from '../types';
import ErrorMessage from '@/components/error/ErrorMessage';

// 동적 렌더링 강제 설정
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface NewsDetailPageProps {
  params: {
    id: string;
  };
}

// 메타데이터 생성
export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  try {
    const newsId = params.id;
    const endpoint = `${serverEnv.API_BASE_URL}/news/${newsId}`;
    const response = await serverGet<NewsItem>(endpoint);

    if (response.success && response.data) {
      const news = response.data;
      return {
        title: `${news.title} | 암호화폐 뉴스 - 김프런`,
        description: news.shortContent || '암호화폐 뉴스 상세 정보',
        keywords: news.keywords || [],
        openGraph: {
          title: news.title,
          description: news.shortContent || '',
          type: 'article',
          images: news.thumbnail ? [news.thumbnail] : [],
        },
      };
    }
  } catch (error) {
    console.error('메타데이터 생성 실패:', error);
  }

  return {
    title: '뉴스 상세 | 김프런',
    description: '암호화폐 뉴스 상세 정보',
  };
}

// 뉴스 상세 페이지
const NewsDetailPage = async ({ params }: NewsDetailPageProps) => {
  const newsId = params.id;

  try {
    const endpoint = `${serverEnv.API_BASE_URL}/news/${newsId}`;
    const response = await serverGet<NewsItem>(endpoint, {
      headers: { 'Content-type': 'application/json' },
    });

    // API 호출 실패 처리
    if (!response.success || !response.data) {
      return notFound();
    }

    return (
      <main>
        <NewsDetailClient news={response.data} />
      </main>
    );
  } catch (error) {
    console.error('뉴스 상세 페이지 렌더링 오류:', error);
    return (
      <main>
        <ErrorMessage
          title="오류가 발생했습니다."
          message="뉴스를 불러오는 중 오류가 발생했습니다."
        />
      </main>
    );
  }
};

export default NewsDetailPage;
