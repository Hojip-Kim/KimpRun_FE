import React from 'react';
import { Post } from '../../coin/types';
import { clientEnv } from '@/utils/env';

export type allPostData = {
  boards: Post[];
  boardCount: number;
};

const fetchAllPostData = async (page: number): Promise<allPostData> => {
  const response = await fetch(
    `${clientEnv.BOARD_URL}/all/page?page=${page}`,
    {
      method: 'GET',
      cache: 'no-store',
    }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return response.json();
};

export default fetchAllPostData;
