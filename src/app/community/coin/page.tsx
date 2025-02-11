import React from 'react';
import { GetPostResponse, Post } from './types';
import Board from './client/Board';
import ErrorMessage from '@/components/error/ErrorMessage';
import { allPostData } from '../components/server/fetchData';

const allPostsUrl = process.env.NEXT_PUBLIC_ALL_POSTS_URL;
const boardUrl = process.env.NEXT_PUBLIC_BOARD_URL;
const categoryUrl = process.env.NEXT_PUBLIC_CATEGORY_URL;

async function getAllPosts(page: number): Promise<allPostData> {
  const response = await fetch(`${allPostsUrl}?page=${page}`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('게시글을 가져오는데 실패했습니다.');
  }

  return response.json();
}

async function getPosts(
  categoryId: number,
  page: number
): Promise<GetPostResponse> {
  const response = await fetch(`${boardUrl}/${categoryId}/${page}`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('게시글을 가져오는데 실패했습니다.');
  }

  return response.json();
}

async function getCategories() {
  try {
    const response = await fetch(categoryUrl, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('카테고리를 가져오는데 실패했습니다.');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Fetching data error', error);
    return {
      props: {
        data: null,
      },
    };
  }
}

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

    const firstCategoryId = categories[0].id;
    const postOfCategory = await getPosts(firstCategoryId, 1);

    return (
      <Board
        initialCategoryId={firstCategoryId}
        initialPage={1}
        categories={categories}
        initialPosts={postOfCategory}
        isError={false}
      />
    );
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
