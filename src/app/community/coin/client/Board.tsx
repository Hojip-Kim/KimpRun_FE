'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BoardRow from './BoardRow';
import Pagination from './Pagination';
import { Post } from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import CommunityLayout from './CommunityLayout';
import ErrorMessage from '@/components/error/ErrorMessage';
import { Category } from '@/app/admin/type';
import { AllPostData } from '../../types';
import {
  BoardContainer,
  BoardHeader,
  CategorySelect,
  WriteButton,
  PostList,
  BoardListHeader,
  TitleSection,
  NumberHeader,
  CategoryHeader,
  TitleHeader,
  AuthorHeader,
  DateHeader,
  StatsSection,
  StatHeader,
} from './style';

interface BoardProps {
  initialCategoryId?: number;
  initialPage: number;
  categories: Category[];
  initialPosts: AllPostData;
  isError: boolean;
}

const Board: React.FC<BoardProps> = ({
  initialCategoryId,
  initialPage,
  categories,
  initialPosts,
  isError,
}) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts.boards);
  const [totalPosts, setTotalPosts] = useState(initialPosts.boardCount);
  const [currentCategoryId, setCurrentCategoryId] = useState(
    initialCategoryId ? initialCategoryId : -1
  );
  const [currentPage, setCurrentPage] = useState(initialPage);
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const handlePageChange = (newPage: number) => {
    if (currentCategoryId === -1) {
      router.push(`/community`);
    } else {
      router.push(`/community/coin/${currentCategoryId}/${newPage}`);
    }
    setCurrentPage(newPage);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newCategoryId = parseInt(event.target.value, 10);
    if (newCategoryId === -1) {
      router.push(`/community`);
    } else {
      router.push(`/community/coin/${newCategoryId}/1`);
    }
    setCurrentCategoryId(newCategoryId);
    setCurrentPage(1);
  };

  const handleWritePost = () => {
    router.push(`/community/coin/${currentCategoryId}/write`);
  };

  const showPagination = totalPosts >= 0;

  return (
    <CommunityLayout>
      <BoardContainer>
        <BoardHeader>
          <CategorySelect
            value={currentCategoryId}
            onChange={handleCategoryChange}
          >
            {categories.map((category, index) => (
              <option key={index} value={category.id}>
                {category.categoryName}
              </option>
            ))}
          </CategorySelect>
          {isAuthenticated && (
            <WriteButton onClick={handleWritePost}>글쓰기</WriteButton>
          )}
        </BoardHeader>
        {isError ? (
          <ErrorMessage
            title="게시글 데이터가 비어있습니다."
            message="게시글 데이터를 불러오는데 실패했습니다."
          />
        ) : (
          <PostList>
            <BoardListHeader>
              <TitleSection>
                <NumberHeader>번호</NumberHeader>
                <CategoryHeader>카테고리</CategoryHeader>
                <TitleHeader>제목</TitleHeader>
                <AuthorHeader>글쓴이</AuthorHeader>
                <DateHeader>작성일</DateHeader>
              </TitleSection>
              <StatsSection>
                <StatHeader>조회</StatHeader>
                <StatHeader>추천</StatHeader>
                <StatHeader>댓글</StatHeader>
              </StatsSection>
            </BoardListHeader>
            {posts.map((post, index) => (
              <BoardRow key={index} post={post} />
            ))}
          </PostList>
        )}
        {showPagination && (
          <Pagination
            postsPerPage={10}
            totalPosts={totalPosts}
            currentPage={currentPage}
            currentCategoryId={currentCategoryId}
            onPageChange={handlePageChange}
          />
        )}
      </BoardContainer>
    </CommunityLayout>
  );
};

export default Board;
