import React, { useState } from 'react';
import Board from '../../client/Board';
import { GetPostResponse, Post } from '../../types';

interface CategoryBoardPageProps {
  params: {
    category: string;
    boardPage: string;
  };
}

const boardUrl = process.env.NEXT_PUBLIC_BOARD_URL;
const categoryUrl = process.env.NEXT_PUBLIC_CATEGORY_URL;

async function getPosts(
  categoryId: string,
  page: string
): Promise<GetPostResponse> {
  const response = await fetch(`${boardUrl}/${categoryId}/${page}`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return response.json();
}

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

export default async function CategoryBoardPage({
  params,
}: CategoryBoardPageProps) {
  const { category, boardPage } = params;
  const [data, categories] = await Promise.all([
    getPosts(category, boardPage),
    getCategories(),
  ]);

  let isError = false;

  if ('status' in data) {
    isError = true;
  }

  return (
    <Board
      initialCategoryId={Number(category)}
      initialPage={Number(boardPage)}
      categories={categories}
      initialPosts={data}
      isError={isError}
    />
  );
}
