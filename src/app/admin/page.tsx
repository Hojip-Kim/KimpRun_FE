import React from 'react';
import { fetchAllCategories } from './server/fetchCategory';
import { ProcessedApiResponse } from '@/server/type';
import { Category, CategoryResponse } from './type';
import AdminPageClient from './client/adminClient';

// 동적렌더링 강제하여 빌드 시점에 로드되지 않도록 설정함
export const dynamic = 'force-dynamic';

const AdminPage = async () => {
  let initialCategories: Category[] = [];

  try {
    const categoriesResponse: ProcessedApiResponse<CategoryResponse> =
      await fetchAllCategories();

    if (
      categoriesResponse &&
      categoriesResponse.success &&
      categoriesResponse.data
    ) {
      initialCategories = categoriesResponse.data.categories;
    } else {
      console.warn(
        '카테고리 데이터를 가져올 수 없습니다:',
        categoriesResponse?.error
      );
      initialCategories = [];
    }
  } catch (error) {
    console.error('Admin 페이지 초기 데이터 로드 실패:', error);

    initialCategories = [];
  }

  return <AdminPageClient initialCategories={initialCategories} />;
};

export default AdminPage;
