import { fetchAllCategories } from '../admin/server/fetchCategory';
import { fetchAllPostData } from './server/communityFetchData';

export async function getInitialCommunityData() {
  try {
    const [categories, allPosts] = await Promise.all([
      fetchAllCategories(),
      fetchAllPostData(1),
    ]);

    return {
      categories,
      allPosts,
    };
  } catch (error) {
    console.error('커뮤니티 초기 데이터 로딩 실패:', error);
    return {
      categories: [],
      allPosts: {
        boards: [],
        boardCount: 0,
      },
    };
  }
}
