import React from 'react';
import Board from './client/Board';
import ErrorMessage from '@/components/error/ErrorMessage';
import { getCategories, getPosts } from './server/server';

// 동적 렌더링 강제 설정 - 빌드 시점에 데이터 가져오기 방지
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CoinCommunityPage() {
  try {
    const categories = await getCategories();

    if (categories.status === 202) {
      return (
        <ErrorMessage
          title="카테고리 데이터가 비어있습니다."
          message="카테고리 데이터를 불러오는데 실패했습니다."
        />
      );
    }

    // 카테고리 데이터가 없거나 비어있는 경우 처리
    if (
      !categories.success ||
      !categories.data ||
      categories.data.length === 0
    ) {
      console.error('카테고리 데이터 없음:', categories);
      return (
        <ErrorMessage
          title="카테고리 데이터를 불러올 수 없습니다."
          message="카테고리 데이터가 비어있거나 불러오는데 실패했습니다."
        />
      );
    }

    const firstCategoryId = categories.data[0].id;
    const postOfCategory = await getPosts(firstCategoryId, 1);

    if (!postOfCategory) {
      return (
        <ErrorMessage
          title="게시글 데이터를 불러올 수 없습니다."
          message="게시글 데이터를 불러오는데 실패했습니다."
        />
      );
    }

    return (
      <Board
        initialCategoryId={firstCategoryId}
        initialPage={1}
        categories={categories.data}
        initialPosts={postOfCategory.data}
        isError={false}
      />
    );
  } catch (error) {
    console.error('Error:', error);
    return (
      <ErrorMessage
        title="데이터를 불러오는 중 오류가 발생했습니다."
        message="데이터를 불러오는 중 오류가 발생했습니다."
      />
    );
  }
}
