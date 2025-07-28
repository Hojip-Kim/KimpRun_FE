import { redirect } from 'next/navigation';
import { serverEnv } from '@/utils/env';

const categoryUrl = serverEnv.CATEGORY_URL;

async function getCategories() {
  const response = await fetch(categoryUrl, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('카테고리를 가져오는데 실패했습니다.');
  }

  return response.json();
}

export default async function CoinCommunityPage() {
  try {
    const categories = await getCategories();

    if (categories.length === 0) {
      return (
        <div>
          <h1>코인 커뮤니티</h1>
          <p>현재 사용 가능한 카테고리가 없습니다.</p>
        </div>
      );
    }

    const firstCategoryId = categories[0].id;
    redirect(`/community/coin/${firstCategoryId}/1`);
  } catch (error) {
    console.error('Error:', error);
    return (
      <div>
        <h1>코인 커뮤니티</h1>
        <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }
}
