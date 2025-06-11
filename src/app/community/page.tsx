import React from 'react';
import { getInitialCommunityData } from './server';
import CommunityClient from './client/CommunityClient';
import { Category, CategoryResponse } from '../admin/type';
import { ApiResponse } from '@/server/type';
import { AllPostData } from './types';

// 🔧 동적 렌더링 강제 (빌드 시점에 정적 생성하지 않음)
export const dynamic = 'force-dynamic';

const CommunityPage = async () => {
  let parsedCategories: Category[] = [];
  let parsedAllPosts: AllPostData = {
    boards: [],
    boardCount: 0,
  };

  try {
    const { categories, allPosts } = await getInitialCommunityData();

    if (
      categories &&
      typeof categories === 'object' &&
      'success' in categories
    ) {
      const apiCategoryResponse = categories as ApiResponse<CategoryResponse>;
      if (apiCategoryResponse.success && apiCategoryResponse.data?.categories) {
        parsedCategories = Array.isArray(apiCategoryResponse.data.categories)
          ? apiCategoryResponse.data.categories
          : [];
      }
    } else if (Array.isArray(categories)) {
      parsedCategories = categories;
    }

    if (allPosts && typeof allPosts === 'object' && 'success' in allPosts) {
      const apiAllPostsResponse = allPosts as ApiResponse<AllPostData>;
      if (apiAllPostsResponse.success && apiAllPostsResponse.data) {
        parsedAllPosts = apiAllPostsResponse.data;
      } else {
        parsedAllPosts = {
          boards: [],
          boardCount: 0,
        };
      }
    }
  } catch (error) {
    console.error('커뮤니티 페이지 초기 데이터 로드 실패:', error);
  }

  return (
    <CommunityClient
      initialCategories={parsedCategories}
      initialAllPosts={parsedAllPosts}
    />
  );
};

export default CommunityPage;
