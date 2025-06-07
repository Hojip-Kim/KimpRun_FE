import React from 'react';
import { getInitialCommunityData } from './server';
import CommunityClient from './client/CommunityClient';
import { Category, CategoryResponse } from '../admin/type';
import { ApiResponse } from '@/server/type';
import { Post } from './coin/types';
import { AllPostData } from './types';

const CommunityPage = async () => {
  const { categories, allPosts } = await getInitialCommunityData();

  const apiCategoryResponse = categories as ApiResponse<CategoryResponse>;
  const apiAllPostsResponse = allPosts as ApiResponse<AllPostData>;

  let parsedCategories: Category[];
  let parsedAllPosts: AllPostData;

  if (apiCategoryResponse.status === 200) {
    parsedCategories = apiCategoryResponse.data.categories;
  } else {
    parsedCategories = [];
  }

  if (apiAllPostsResponse.status === 200) {
    parsedAllPosts = apiAllPostsResponse.data;
  } else {
    parsedAllPosts = {
      boards: [],
      boardCount: 0,
    };
  }

  return (
    <CommunityClient
      initialCategories={parsedCategories}
      initialAllPosts={parsedAllPosts}
    />
  );
};

export default CommunityPage;
