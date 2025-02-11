import React from 'react';
import { Post } from '../../coin/types';

export type allPostData = {
  boards: Post[];
  boardCount: number;
};

const fetchAllPostData = async (page: number): Promise<allPostData> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BOARD_URL}/all/page?page=${page}`,
    {
      method: 'GET',
      cache: 'no-store',
    }
  );
  console.log(response);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return response.json();
};

export default fetchAllPostData;
