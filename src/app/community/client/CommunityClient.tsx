'use client';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Category } from '@/app/admin/type';
import { Post } from '../coin/types';
import { fetchAllPostData } from '../server/communityFetchData';
import Board from '../coin/client/Board';
import { CommunityPageProps } from '../types';
import { AllPostData } from '../types';

const CommunityClient: React.FC<CommunityPageProps> = ({
  initialCategories,
  initialAllPosts,
}) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [allPosts, setAllPosts] = useState<AllPostData>(initialAllPosts);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (categories.length === 0) {
    return <div>카테고리가 비어있습니다.</div>;
  }

  if (allPosts.boards.length === 0) {
    return <div>게시글이 비어있습니다.</div>;
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
