'use client';

import React, { useState } from 'react';
import { Category } from '@/app/admin/type';
import Board from '../coin/client/Board';
import { CommunityPageProps } from '../types';
import { AllPostData } from '../types';
import ErrorMessage from '@/components/error/ErrorMessage';

const CommunityClient: React.FC<CommunityPageProps> = ({
  initialCategories,
  initialAllPosts,
}) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [allPosts, setAllPosts] = useState<AllPostData>(initialAllPosts);

  if (categories.length === 0) {
    return (
      <ErrorMessage
        title="카테고리가 비어있습니다."
        message="카테고리를 불러오는데 실패했습니다."
      />
    );
  }

  if (allPosts.boards.length === 0) {
    return (
      <ErrorMessage
        title="게시글이 비어있습니다."
        message="게시글을 불러오는데 실패했습니다."
      />
    );
  }

  return (
    <Board
      initialCategoryId={-1}
      initialPage={1}
      categories={categories}
      initialPosts={allPosts}
      isError={false}
    />
  );
};

export default CommunityClient;
