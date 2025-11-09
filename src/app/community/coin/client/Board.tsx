'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import BoardRow from './BoardRow';
import Pagination from '@/components/common/Pagination';
import { Post } from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import CommunityLayout from './CommunityLayout';
import CommunitySubNav from './CommunitySubNav';

import ErrorMessage from '@/components/error/ErrorMessage';
import { Category } from '@/app/admin/type';
import { AllPostData } from '../../types';
import Dropdown, { DropdownOption } from '@/components/common/Dropdown';
import { CommunityBoardSkeleton } from '@/components/skeleton/Skeleton';
import { clientRequest } from '@/server/fetch/client';
import { clientEnv } from '@/utils/env';
import {
  BoardContainer,
  BoardHeader,
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
  initialCategoryId: number;
  initialPage: number;
  initialSize: number;
  categories: Category[];
  initialPosts: AllPostData;
  isError: boolean;
}

const Board: React.FC<BoardProps> = ({
  initialCategoryId,
  initialPage,
  initialSize,
  categories = [],
  initialPosts,
  isError,
}) => {
  const [currentCategoryId, setCurrentCategoryId] = useState(initialCategoryId);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);
  const [boardListData, setBoardListData] = useState<AllPostData>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const posts = boardListData?.boardResponseDtos || [];
  const totalPosts = boardListData?.count || 0;

  // 데이터 fetching 함수
  const fetchBoardData = async (categoryId: number, page: number, size: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let endpoint: string;
      if (categoryId === 1) {
        endpoint = `/board/1?page=${page}&size=${size}`;
      } else {
        endpoint = `/board/${categoryId}?page=${page}&size=${size}`;
      }

      const response = await clientRequest.get<AllPostData>(endpoint, {
        cache: 'no-store'
      });

      if (response.success && response.data) {
        setBoardListData(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch board list');
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    router.push(
      `/community/coin/${currentCategoryId}?page=${newPage}&size=${pageSize}`
    );
    setCurrentPage(newPage);
  };

  const handleCategoryChange = async (newCategoryId: number) => {
    router.push(`/community/coin/${newCategoryId}?page=1&size=${pageSize}`);
    setCurrentCategoryId(newCategoryId);
    setCurrentPage(1);
    await fetchBoardData(newCategoryId, 1, pageSize);
  };

  // 서버에서 전달된 초기 데이터/파라미터가 변경되면 상태 동기화
  useEffect(() => {
    setCurrentCategoryId(initialCategoryId);
    setCurrentPage(initialPage);
    setPageSize(initialSize);
  }, [initialCategoryId, initialPage, initialSize]);

  const categoryOptions: DropdownOption<number>[] =
    categories?.map((category) => ({
      label: category.categoryName,
      value: category.id,
    })) || [];

  const handleWritePost = () => {
    router.push('/community/coin/write');
  };

  const showPagination = totalPosts >= 0;

  // 로딩 상태일 때 스켈레톤 표시
  if (isLoading) {
    return <CommunityBoardSkeleton rows={10} />;
  }

  // 에러 상태 처리
  if (error || isError) {
    return (
      <CommunityLayout>
        <CommunitySubNav currentPath={pathname} />
        <BoardContainer>
          <ErrorMessage
            title="게시글 데이터를 불러올 수 없습니다."
            message="게시글 데이터를 불러오는데 실패했습니다."
          />
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              onClick={() => fetchBoardData(currentCategoryId, currentPage, pageSize)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ffd700',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              다시 시도
            </button>
          </div>
        </BoardContainer>
      </CommunityLayout>
    );
  }

  return (
    <CommunityLayout>
      <CommunitySubNav currentPath={pathname} />
      <BoardContainer>
        <BoardHeader>
          <Dropdown
            value={currentCategoryId}
            options={categoryOptions}
            onChange={handleCategoryChange}
            ariaLabel="카테고리 선택"
            disabled={categoryOptions.length === 0}
          />
          {isAuthenticated && (
            <WriteButton onClick={handleWritePost}>글쓰기</WriteButton>
          )}
        </BoardHeader>
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
            <BoardRow key={post.boardId || index} post={post} />
          ))}
        </PostList>
        {showPagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalPosts / (pageSize || 1))}
            totalElements={totalPosts}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            showInfo={true}
          />
        )}
      </BoardContainer>
    </CommunityLayout>
  );
};

export default Board;
