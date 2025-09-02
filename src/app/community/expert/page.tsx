import React from 'react';
import { Metadata } from 'next';
import ExpertClient from './client/ExpertClient';

// 🔧 동적 렌더링 강제 설정 (빌드 시점에 정적 생성하지 않음)
export const dynamic = 'force-dynamic';

// 🔍 SEO 메타데이터 설정
export const metadata: Metadata = {
  title: '전문가 게시판 준비중 | 김프런 커뮤니티',
  description:
    '검증된 암호화폐 전문가들의 전문적인 시장 분석과 투자 인사이트를 공유하는 프리미엄 커뮤니티 공간을 준비하고 있습니다.',
  keywords: [
    '암호화폐 전문가',
    '투자 분석',
    '코인 전문가',
    '투자 인사이트',
    '김프런',
    '전문가 게시판',
    '암호화폐 투자',
    '비트코인 분석',
  ],
  openGraph: {
    title: '전문가 게시판 준비중 | 김프런 커뮤니티',
    description:
      '검증된 암호화폐 전문가들의 프리미엄 투자 분석과 인사이트 서비스 준비중',
    type: 'website',
    locale: 'ko_KR',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: '/community/expert',
  },
};

/**
 * 전문가 게시판 페이지 (Server Component)
 * - SSR을 통한 SEO 최적화
 * - 메타데이터 및 구조화된 데이터 제공
 * - 클라이언트 컴포넌트로 UI 렌더링 위임
 */
const ExpertPage = async () => {
  // 📊 향후 전문가 데이터나 통계 정보를 여기서 서버사이드에서 fetch 가능
  // const expertStats = await getExpertStats();
  // const featuredExperts = await getFeaturedExperts();

  return <ExpertClient />;
};

export default ExpertPage;
