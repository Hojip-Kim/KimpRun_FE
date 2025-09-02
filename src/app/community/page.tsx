import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getCategories } from './actions';

// 🔧 동적 렌더링 강제 (빌드 시점에 정적 생성하지 않음)
export const dynamic = 'force-dynamic';

// 🔍 SEO 메타데이터 설정
export const metadata: Metadata = {
  title: '김프런 커뮤니티 | 암호화폐 투자자들의 소통 공간',
  description:
    '김프런 커뮤니티에서 암호화폐 투자 정보, 시장 분석, 전문가 인사이트를 공유하고 소통하세요.',
  keywords: [
    '김프런',
    '암호화폐 커뮤니티',
    '코인 투자',
    '비트코인',
    '이더리움',
    '투자 정보',
    '시장 분석',
    '전문가 게시판',
  ],
  openGraph: {
    title: '김프런 커뮤니티 | 암호화폐 투자자들의 소통 공간',
    description: '암호화폐 투자 정보와 전문가 인사이트를 공유하는 커뮤니티',
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
    canonical: '/community',
  },
};

const CommunityPage = async () => {
  try {
    // 카테고리 데이터 가져오기
    const categoriesResponse = await getCategories();

    let firstCategoryId = 1; // 기본값

    // 카테고리 데이터 처리
    if (categoriesResponse.success && categoriesResponse.data) {
      let parsedCategories: any[] = [];

      if (Array.isArray(categoriesResponse.data)) {
        parsedCategories = categoriesResponse.data;
      } else if (
        categoriesResponse.data &&
        'categories' in categoriesResponse.data
      ) {
        parsedCategories = (categoriesResponse.data as any).categories || [];
      }

      // 첫 번째 카테고리 ID 찾기 (전체 카테고리)
      if (parsedCategories.length > 0) {
        firstCategoryId = parsedCategories[0].id;
      }
    }

    // 코인 커뮤니티 첫 번째 페이지로 리다이렉트
    redirect('/community/coin/1?page=1&size=15');
  } catch (error) {
    console.error('❌ 커뮤니티 페이지 리다이렉트 실패:', error);
    // 오류 시 기본 코인 커뮤니티로 리다이렉트
    redirect('/community/coin/1?page=1&size=15');
  }
};

export default CommunityPage;
