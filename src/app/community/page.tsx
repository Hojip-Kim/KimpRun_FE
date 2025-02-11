'use client';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { category, getCategories } from '../admin/server/fetchCategory';
import { Post } from './coin/types';
import fetchAllPostData, { allPostData } from './components/server/fetchData';
import Board from './coin/client/Board';

const CommunityPage = () => {
  const [categories, setCategories] = useState<category[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [boardCount, setBoardCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCategories = useCallback(async () => {
    try {
      const response: category[] = await getCategories();
      setCategories(response);
    } catch (error) {
      console.error('category fetch failed.', error);
    }
  }, []);

  const fetchAllPost = useCallback(async () => {
    try {
      const response: allPostData = await fetchAllPostData(1);
      setAllPosts(response.boards);
      setBoardCount(response.boardCount);
    } catch (error) {
      console.error('post loading failed', error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchCategories(), fetchAllPost()]);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchCategories, fetchAllPost]);
  if (isLoading || categories.length === 0 || allPosts.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Board
      initialCategoryId={-1}
      initialPage={1}
      categories={categories}
      initialPosts={{ boardResponseDtos: allPosts, count: boardCount }}
      isError={false}
    />
  );
};

export default CommunityPage;
