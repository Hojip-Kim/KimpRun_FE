import React from 'react';
import { Metadata } from 'next';
import NewsClientPage from './client/NewsClient';
import { fetchAllNews, fetchNewsBySource } from './server/dataFetching';
import { NewsSource } from './types';
import ErrorMessage from '@/components/error/ErrorMessage';

// 동적 렌더링 강제 설정
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: '암호화폐 뉴스 | 김프런 - 실시간 코인 뉴스',
  description:
    '블루밍비트, 코인니스 등 주요 암호화폐 뉴스를 실시간으로 확인하세요.',
  keywords: [
    '암호화폐 뉴스',
    '블루밍비트',
    '코인니스',
    '비트코인 뉴스',
    '이더리움 뉴스',
    '코인 속보',
    '김치프리미엄',
  ],
  openGraph: {
    title: '암호화폐 뉴스 | 김프런',
    description: '블루밍비트, 코인니스 등 주요 암호화폐 뉴스를 실시간으로 확인',
    type: 'website',
  },
};

interface NewsPageProps {
  searchParams: {
    source?: string;
    page?: string;
  };
}

const NewsPage = async ({ searchParams }: NewsPageProps) => {
  const sourceParam = (searchParams.source || 'All') as NewsSource;
  const page = parseInt(searchParams.page || '1', 10);

  try {
    let newsResponse;

    if (sourceParam === 'All') {
      newsResponse = await fetchAllNews(page, 20);
    } else {
      const sourceCode =
        sourceParam === 'BloomingBit' ? 'BloomingBit' : 'Coinness';
      newsResponse = await fetchNewsBySource(sourceCode, page, 20);
    }

    // API 호출 실패 처리
    if (!newsResponse.success || !newsResponse.data) {
      return (
        <main>
          <ErrorMessage
            title="뉴스 데이터를 불러올 수 없습니다."
            message="뉴스 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요."
          />
        </main>
      );
    }

    return (
      <main>
        <NewsClientPage
          initialData={newsResponse.data}
          initialSource={sourceParam}
          initialPage={page}
        />
      </main>
    );
  } catch (error) {
    console.error('뉴스 페이지 렌더링 오류:', error);
    return (
      <main>
        <ErrorMessage
          title="오류가 발생했습니다."
          message="페이지를 불러오는 중 오류가 발생했습니다."
        />
      </main>
    );
  }
};

export default NewsPage;
