'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BoardRow from './BoardRow';
import Pagination from './Pagination';
import { GetPostResponse, Post } from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import styled from 'styled-components';
import CommunityLayout from './CommunityLayout';
import ErrorMessage from '@/components/error/ErrorMessage';
import { CustomException } from '@/types/exception';

interface Category {
  id: number;
  categoryName: string;
}

interface BoardProps {
  initialCategoryId?: number;
  initialPage: number;
  categories: Category[];
  initialPosts?: GetPostResponse;
  isError: boolean;
}

const Board: React.FC<BoardProps> = ({
  initialCategoryId,
  initialPage,
  categories,
  initialPosts,
  isError,
}) => {
  const [posts, setPosts] = useState<Post[]>(
    initialPosts?.boardResponseDtos || []
  );
  const [totalPosts, setTotalPosts] = useState(initialPosts?.count || 0);
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
            <option value={-1}>전체</option>
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

const BoardContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #1e1e1e;
  color: #e0e0e0;
  overflow-y: auto;
`;
const CategoryHeader = styled.div`
  width: 100px;
  text-align: center;
`;

const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CategorySelect = styled.select`
  padding: 8px;
  font-size: 14px;
  background-color: #2c2c2c;
  color: #e0e0e0;
  border: 1px solid #444;
  border-radius: 4px;
`;

const WriteButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  color: #1e1e1e;
  background-color: #ffd700;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #ffed4d;
  }
`;

const PostList = styled.div`
  background-color: #2c2c2c;
  border: 1px solid #444;
  border-radius: 4px;
`;

const BoardListHeader = styled.div`
  display: flex;
  padding: 12px;
  background-color: #252525;
  border-bottom: 1px solid #444;
  font-weight: bold;
  color: #e0e0e0;
`;

const TitleSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const StatsSection = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const NumberHeader = styled.div`
  width: 60px;
`;

const TitleHeader = styled.div`
  flex: 1;
  text-align: center;
`;

const AuthorHeader = styled.div`
  width: 100px;
  text-align: center;
`;

const DateHeader = styled.div`
  width: 150px;
  text-align: center;
`;

const StatHeader = styled.div`
  width: 60px;
  text-align: center;
`;

export default Board;
