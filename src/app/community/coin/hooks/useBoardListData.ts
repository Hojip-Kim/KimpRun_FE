'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { clientRequest } from '@/server/fetch/client';
import { clientEnv } from '@/utils/env';
import { AllPostData } from '../../types';
import { Post } from '../types';

// 게시판 목록 데이터 fetcher 함수
const fetchBoardList = async (
  categoryId: number,
  page: number,
  size: number = 15
): Promise<AllPostData> => {
  let endpoint: string;

  if (categoryId === 1) {
    // 전체 게시글 - SSR과 동일한 엔드포인트 사용
    endpoint = `/board/1?page=${page}&size=${size}`;
  } else {
    // 카테고리별 게시글 - API는 1-based 페이지 사용
    endpoint = `/board/${categoryId}?page=${page}&size=${size}`;
  }

  const response = await clientRequest.get<AllPostData>(endpoint, {
    cache: 'no-store'
  });

  if (response.success && response.data) {
    return response.data;
  }

  throw new Error(response.error || 'Failed to fetch board list');
};

// 게시판 목록 조회 훅
export function useBoardListData(
  categoryId: number,
  page: number = 1,
  size: number = 15,
  initialData?: AllPostData
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['boardList', categoryId, page, size],
    queryFn: () => fetchBoardList(categoryId, page, size),
    initialData,
    staleTime: 1000 * 60 * 5, // 5분 후 stale
    gcTime: 1000 * 60 * 10, // 10분 후 가비지 컬렉션
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 비활성화
    refetchOnMount: false, // 마운트 시 재요청 비활성화 (initialData가 있으면 사용)
    enabled: true, // 쿼리 활성화
  });

  // 특정 게시글의 좋아요 수 업데이트 함수
  const updatePostLikes = (boardId: number, newLikesCount: number) => {
    queryClient.setQueryData(
      ['boardList', categoryId, page, size],
      (oldData: AllPostData | undefined) => {
        if (oldData && oldData.boardResponseDtos) {
          return {
            ...oldData,
            boardResponseDtos: oldData.boardResponseDtos.map((post: Post) =>
              post.boardId === boardId
                ? { ...post, boardLikesCount: newLikesCount }
                : post
            ),
          };
        }
        return oldData;
      }
    );

    // 다른 페이지나 카테고리의 캐시도 업데이트
    queryClient.setQueriesData(
      { queryKey: ['boardList'], exact: false },
      (oldData: AllPostData | undefined) => {
        if (oldData && oldData.boardResponseDtos) {
          const hasPost = oldData.boardResponseDtos.some(
            (post: Post) => post.boardId === boardId
          );

          if (hasPost) {
            return {
              ...oldData,
              boardResponseDtos: oldData.boardResponseDtos.map((post: Post) =>
                post.boardId === boardId
                  ? { ...post, boardLikesCount: newLikesCount }
                  : post
              ),
            };
          }
        }
        return oldData;
      }
    );
  };

  // 특정 게시글의 댓글 수 업데이트 함수
  const updatePostComments = (boardId: number, newCommentsCount: number) => {
    queryClient.setQueryData(
      ['boardList', categoryId, page, size],
      (oldData: AllPostData | undefined) => {
        if (oldData && oldData.boardResponseDtos) {
          return {
            ...oldData,
            boardResponseDtos: oldData.boardResponseDtos.map((post: Post) =>
              post.boardId === boardId
                ? { ...post, commentsCount: newCommentsCount }
                : post
            ),
          };
        }
        return oldData;
      }
    );

    // 다른 페이지나 카테고리의 캐시도 업데이트
    queryClient.setQueriesData(
      { queryKey: ['boardList'], exact: false },
      (oldData: AllPostData | undefined) => {
        if (oldData && oldData.boardResponseDtos) {
          const hasPost = oldData.boardResponseDtos.some(
            (post: Post) => post.boardId === boardId
          );

          if (hasPost) {
            return {
              ...oldData,
              boardResponseDtos: oldData.boardResponseDtos.map((post: Post) =>
                post.boardId === boardId
                  ? { ...post, commentsCount: newCommentsCount }
                  : post
              ),
            };
          }
        }
        return oldData;
      }
    );
  };

  // 특정 게시글의 조회수 업데이트 함수
  const updatePostViews = (boardId: number, newViewsCount: number) => {
    queryClient.setQueryData(
      ['boardList', categoryId, page, size],
      (oldData: AllPostData | undefined) => {
        if (oldData && oldData.boardResponseDtos) {
          return {
            ...oldData,
            boardResponseDtos: oldData.boardResponseDtos.map((post: Post) =>
              post.boardId === boardId
                ? { ...post, boardViewsCount: newViewsCount }
                : post
            ),
          };
        }
        return oldData;
      }
    );

    // 다른 페이지나 카테고리의 캐시도 업데이트
    queryClient.setQueriesData(
      { queryKey: ['boardList'], exact: false },
      (oldData: AllPostData | undefined) => {
        if (oldData && oldData.boardResponseDtos) {
          const hasPost = oldData.boardResponseDtos.some(
            (post: Post) => post.boardId === boardId
          );

          if (hasPost) {
            return {
              ...oldData,
              boardResponseDtos: oldData.boardResponseDtos.map((post: Post) =>
                post.boardId === boardId
                  ? { ...post, boardViewsCount: newViewsCount }
                  : post
              ),
            };
          }
        }
        return oldData;
      }
    );
  };

  // 게시글 삭제 시 목록에서 제거
  const removePostFromList = (boardId: number) => {
    queryClient.setQueriesData(
      { queryKey: ['boardList'], exact: false },
      (oldData: AllPostData | undefined) => {
        if (oldData && oldData.boardResponseDtos) {
          return {
            ...oldData,
            boardResponseDtos: oldData.boardResponseDtos.filter(
              (post: Post) => post.boardId !== boardId
            ),
            count: oldData.count - 1,
          };
        }
        return oldData;
      }
    );
  };

  return {
    ...query,
    updatePostLikes,
    updatePostComments,
    updatePostViews,
    removePostFromList,
  };
}

// 전역적으로 게시글 데이터를 업데이트하는 유틸리티 함수들
export const boardListUtils = {
  // 좋아요 수 업데이트
  updateLikesInAllLists: (
    queryClient: ReturnType<typeof useQueryClient>,
    boardId: number,
    newLikesCount: number
  ) => {
    queryClient.setQueriesData(
      { queryKey: ['boardList'], exact: false },
      (oldData: AllPostData | undefined) => {
        if (oldData && oldData.boardResponseDtos) {
          const hasPost = oldData.boardResponseDtos.some(
            (post: Post) => post.boardId === boardId
          );

          if (hasPost) {
            return {
              ...oldData,
              boardResponseDtos: oldData.boardResponseDtos.map((post: Post) =>
                post.boardId === boardId
                  ? { ...post, boardLikesCount: newLikesCount }
                  : post
              ),
            };
          }
        }
        return oldData;
      }
    );
  },

  // 댓글 수 업데이트
  updateCommentsInAllLists: (
    queryClient: ReturnType<typeof useQueryClient>,
    boardId: number,
    newCommentsCount: number
  ) => {
    queryClient.setQueriesData(
      { queryKey: ['boardList'], exact: false },
      (oldData: AllPostData | undefined) => {
        if (oldData && oldData.boardResponseDtos) {
          const hasPost = oldData.boardResponseDtos.some(
            (post: Post) => post.boardId === boardId
          );

          if (hasPost) {
            return {
              ...oldData,
              boardResponseDtos: oldData.boardResponseDtos.map((post: Post) =>
                post.boardId === boardId
                  ? { ...post, commentsCount: newCommentsCount }
                  : post
              ),
            };
          }
        }
        return oldData;
      }
    );
  },

  // 조회수 업데이트
  updateViewsInAllLists: (
    queryClient: ReturnType<typeof useQueryClient>,
    boardId: number,
    newViewsCount: number
  ) => {
    queryClient.setQueriesData(
      { queryKey: ['boardList'], exact: false },
      (oldData: AllPostData | undefined) => {
        if (oldData && oldData.boardResponseDtos) {
          const hasPost = oldData.boardResponseDtos.some(
            (post: Post) => post.boardId === boardId
          );

          if (hasPost) {
            return {
              ...oldData,
              boardResponseDtos: oldData.boardResponseDtos.map((post: Post) =>
                post.boardId === boardId
                  ? { ...post, boardViewsCount: newViewsCount }
                  : post
              ),
            };
          }
        }
        return oldData;
      }
    );
  },
};
