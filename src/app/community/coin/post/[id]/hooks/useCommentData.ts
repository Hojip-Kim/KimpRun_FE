'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '../lib/api';
import { Comment, BoardData } from '../types';
import { boardListUtils } from '../../../hooks/useBoardListData';

// 댓글 작성 API 함수
const createCommentApi = async (
  boardId: number,
  content: string,
  depth: number,
  parentCommentId: number
): Promise<Comment | null> => {
  return await createComment(boardId, content, depth, parentCommentId);
};

// 댓글 작성 훅
export function useCreateComment(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      content,
      depth,
      parentCommentId,
    }: {
      content: string;
      depth: number;
      parentCommentId: number;
    }) => createCommentApi(parseInt(boardId), content, depth, parentCommentId),
    onSuccess: (newComment) => {
      if (newComment) {
        // 게시글 데이터의 댓글 수 업데이트
        queryClient.setQueryData(
          ['board', boardId],
          (oldData: BoardData | undefined) => {
            if (oldData) {
              const newCommentsCount = oldData.commentsCount + 1;

              // 게시판 목록의 댓글 수도 동기화
              boardListUtils.updateCommentsInAllLists(
                queryClient,
                parseInt(boardId),
                newCommentsCount
              );

              return {
                ...oldData,
                commentsCount: newCommentsCount,
                comments: [...oldData.comments, newComment],
              };
            }
            return oldData;
          }
        );
      }
    },
    onError: (error) => {
      console.error('댓글 작성 오류:', error);
    },
  });
}
