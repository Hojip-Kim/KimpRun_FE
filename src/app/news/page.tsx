import React from 'react';
import { Metadata } from 'next';
import NewsClientPage from './client/page';

export const metadata: Metadata = {
  title: '뉴스 | 김프런 - 암호화폐 김치프리미엄 정보',
  description: '암호화폐 관련 최신 뉴스와 시장 분석 서비스 준비중입니다.',
  keywords: [
    '암호화폐',
    '뉴스',
    '김치프리미엄',
    '비트코인',
    '이더리움',
    '시장분석',
  ],
  openGraph: {
    title: '뉴스 서비스 준비중 | 김프런',
    description: '암호화폐 관련 최신 뉴스와 시장 분석을 제공할 예정입니다.',
    type: 'website',
  },
};

const NewsPage = () => {
  return (
    <main>
      <NewsClientPage />
    </main>
  );
};

export default NewsPage;
