import React from 'react';
import Board from '../client/Board';
import ErrorMessage from '@/components/error/ErrorMessage';
import { getCategories } from '../server/server';
import { getPostsByCategory } from '../../actions';

// 동적 렌더링 강제 설정
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CategoryPageProps {
  params: {
    category: string;
  };
  searchParams: {
    page?: string;
    size?: string;
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = params;
  const page = parseInt(searchParams.page || '1', 10);
  const categoryId = parseInt(category, 10);
  const size = parseInt(searchParams.size || '15', 10);

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
      return (
        <ErrorMessage
          title="카테고리 데이터를 불러올 수 없습니다."
          message="카테고리 데이터가 비어있거나 불러오는데 실패했습니다."
        />
      );
    }

    // 기존 API로 데이터 가져오기 (1-based 페이지)
    const postsResponse = await getPostsByCategory(category, page, size);

    if (!postsResponse.success) {
      return (
        <ErrorMessage
          title="게시글 데이터를 불러올 수 없습니다."
          message="게시글 데이터를 불러오는데 실패했습니다."
        />
      );
    }

    let initialData = { boardResponseDtos: [], count: 0 };
    if (postsResponse.data && 'content' in postsResponse.data) {
      const responseData = postsResponse.data as any;
      initialData = {
        boardResponseDtos: responseData.content,
        count: responseData.totalElements,
      };
    } else if (
      postsResponse.data &&
      'boardResponseDtos' in postsResponse.data
    ) {
      initialData = postsResponse.data;
    }

    // categories.data가 배열인지 확인
    const validCategories = Array.isArray(categories.data)
      ? categories.data
      : [];

    return (
      <Board
        initialCategoryId={categoryId}
        initialPage={page}
        initialSize={size}
        categories={validCategories}
        initialPosts={initialData}
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
