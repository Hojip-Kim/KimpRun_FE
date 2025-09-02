'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientRequest } from '@/server/fetch/client';
import { clientEnv } from '@/utils/env';
import { BoardData } from '../types';
import { boardListUtils } from '../../../hooks/useBoardListData';

// 게시글 데이터 fetcher 함수
const fetchBoardData = async (boardId: string): Promise<BoardData> => {
  const response = await clientRequest.get<BoardData>(
    `${clientEnv.API_BASE_URL}/board?boardId=${boardId}&commentPage=1`
  );

  if (response.success && response.data) {
    return response.data;
  }

  throw new Error(response.error || 'Failed to fetch board data');
};

// 좋아요 API 함수
const likePostApi = async (
  boardId: number
): Promise<{
  success: boolean;
  liked: boolean;
  message: string;
}> => {
  const response = await clientRequest.patch<boolean>(
    `${clientEnv.API_BASE_URL}/board/like`,
    { boardId }
  );

  if (response.success && response.status === 200) {
    if (response.data === true) {
      return { success: true, liked: true, message: '공감을 눌렀습니다!' };
    } else if (response.data === false) {
      return { success: true, liked: false, message: '이미 공감 하셨습니다.' };
    }
  }

  return {
    success: false,
    liked: false,
    message: response.error || '공감 처리 중 오류가 발생했습니다.',
  };
};

// 게시글 수정 API 함수
const updatePostApi = async (
  boardId: number,
  title: string,
  content: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  const response = await clientRequest.patch(
    `${clientEnv.API_BASE_URL}/${boardId}`,
    { title, content }
  );

  if (response.success && response.status === 200) {
    return { success: true, message: '게시글이 수정되었습니다.' };
  } else {
    return {
      success: false,
      message: response.error || '게시글 수정에 실패했습니다.',
    };
  }
};

// 게시글 삭제 API 함수
const deletePostApi = async (
  boardId: number
): Promise<{
  success: boolean;
  message: string;
}> => {
  const response = await clientRequest.delete(
    `${clientEnv.API_BASE_URL}/${boardId}/soft`
  );

  if (response.success && response.status === 200) {
    return { success: true, message: '게시글이 삭제되었습니다.' };
  } else {
    return {
      success: false,
      message: response.error || '게시글 삭제에 실패했습니다.',
    };
  }
};

// 게시글 데이터 조회 훅
export function useBoardData(boardId: string, initialData?: BoardData) {
  return useQuery({
    queryKey: ['board', boardId],
    queryFn: () => fetchBoardData(boardId),
    initialData,
    staleTime: 1000 * 60 * 5, // 5분 후 stale
    gcTime: 1000 * 60 * 10, // 10분 후 가비지 컬렉션
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 비활성화
    refetchOnMount: false, // 마운트 시 재요청 비활성화 (initialData가 있으면 사용)
    enabled: true, // 쿼리 활성화
  });
}

// 좋아요 훅
export function useLikePost(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => likePostApi(parseInt(boardId)),
    onSuccess: (data) => {
      if (data.success && data.liked) {
        // 좋아요 성공 시 캐시 업데이트
        queryClient.setQueryData(
          ['board', boardId],
          (oldData: BoardData | undefined) => {
            if (oldData) {
              const newLikesCount = oldData.boardLikesCount + 1;

              // 게시판 목록의 좋아요 수 동기화
              boardListUtils.updateLikesInAllLists(
                queryClient,
                parseInt(boardId),
                newLikesCount
              );

              return {
                ...oldData,
                boardLikesCount: newLikesCount,
              };
            }
            return oldData;
          }
        );
      }
    },
    onError: (error) => {
      console.error('좋아요 처리 오류:', error);
      // 에러 발생 시 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });
}

// 게시글 수정 훅
export function useUpdatePost(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title, content }: { title: string; content: string }) =>
      updatePostApi(parseInt(boardId), title, content),
    onSuccess: (data, variables) => {
      if (data.success) {
        // 수정 성공 시 캐시 업데이트
        queryClient.setQueryData(
          ['board', boardId],
          (oldData: BoardData | undefined) => {
            if (oldData) {
              return {
                ...oldData,
                title: variables.title,
                content: variables.content,
              };
            }
            return oldData;
          }
        );

        // 게시판 목록에서도 제목 업데이트
        queryClient.setQueriesData(
          { queryKey: ['boardList'], exact: false },
          (oldData: any) => {
            if (oldData && oldData.boardResponseDtos) {
              const hasPost = oldData.boardResponseDtos.some(
                (post: any) => post.boardId === parseInt(boardId)
              );

              if (hasPost) {
                return {
                  ...oldData,
                  boardResponseDtos: oldData.boardResponseDtos.map(
                    (post: any) =>
                      post.boardId === parseInt(boardId)
                        ? { ...post, title: variables.title }
                        : post
                  ),
                };
              }
            }
            return oldData;
          }
        );
      }
    },
    onError: (error) => {
      console.error('게시글 수정 오류:', error);
    },
  });
}

// 게시글 삭제 훅
export function useDeletePost(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deletePostApi(parseInt(boardId)),
    onSuccess: (data) => {
      if (data.success) {
        // 삭제 성공 시 캐시에서 제거
        queryClient.removeQueries({ queryKey: ['board', boardId] });

        // 게시판 목록에서도 해당 게시글 제거
        queryClient.setQueriesData(
          { queryKey: ['boardList'], exact: false },
          (oldData: any) => {
            if (oldData && oldData.boardResponseDtos) {
              return {
                ...oldData,
                boardResponseDtos: oldData.boardResponseDtos.filter(
                  (post: any) => post.boardId !== parseInt(boardId)
                ),
                count: Math.max(0, oldData.count - 1),
              };
            }
            return oldData;
          }
        );
      }
    },
    onError: (error) => {
      console.error('게시글 삭제 오류:', error);
    },
  });
}
