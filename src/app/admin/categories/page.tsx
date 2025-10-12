import React from 'react';
import { Metadata } from 'next';
import { fetchAllCategories } from '../server/fetchCategory';
import { ProcessedApiResponse } from '@/server/type';
import { Category } from '../types';
import CategoryManagement from '../client/CategoryManagement';

// 검색엔진 차단
export const metadata: Metadata = {
  title: '카테고리 관리 - Admin',
  robots: {
    index: false,
    follow: false,
  },
};

// 동적렌더링 강제
export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  let initialCategories: Category[] = [];

  try {
    const categoriesResponse: ProcessedApiResponse<Category[]> =
      await fetchAllCategories();

    if (
      categoriesResponse &&
      categoriesResponse.success &&
      categoriesResponse.data
    ) {
      initialCategories = categoriesResponse.data;
    } else {
      console.warn(
        '카테고리 데이터를 가져올 수 없습니다:',
        categoriesResponse?.error
      );
      initialCategories = [];
    }
  } catch (error) {
    console.error('카테고리 데이터 로드 실패:', error);
    initialCategories = [];
  }

  return <CategoryManagement initialCategories={initialCategories} />;
}
