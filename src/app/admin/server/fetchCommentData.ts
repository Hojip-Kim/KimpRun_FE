'use server';

import { serverGet, serverPost } from '@/server/fetch/server';
import { ProcessedApiResponse } from '@/server/type';
import { serverEnv } from '@/utils/env';
import { CommentPage } from '../types';

/**
 * 게시판 ID로 댓글 조회
 */
export async function getCommentsByBoard(
  boardId: number,
  page: number = 1
): Promise<ProcessedApiResponse<CommentPage>> {
  try {
    const endpoint = `/comment?boardId=${boardId}&page=${page}`;
    const response = await serverGet<CommentPage>(endpoint);
    return response;
  } catch (error) {
    console.error('Error fetching comments by board:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: {
        content: [],
        totalPages: 0,
        totalElements: 0,
        size: 0,
        number: 0,
      },
    };
  }
}

/**
 * 멤버 ID로 댓글 조회
 */
export async function getCommentsByMember(
  memberId: number,
  page: number = 1,
  size: number = 15
): Promise<ProcessedApiResponse<CommentPage>> {
  try {
    const endpoint = `/board/member/${memberId}/comments?page=${page}&size=${size}`;
    const response = await serverGet<CommentPage>(endpoint);
    return response;
  } catch (error) {
    console.error('Error fetching comments by member:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: {
        content: [],
        totalPages: 0,
        totalElements: 0,
        size: 0,
        number: 0,
      },
    };
  }
}

/**
 * 댓글 삭제 (OPERATOR/MANAGER)
 */
export async function softDeleteComment(
  commentId: number
): Promise<ProcessedApiResponse<void>> {
  try {
    const endpoint = `/comment/${commentId}/soft`;
    const response = await serverPost<void>(endpoint);
    return response;
  } catch (error) {
    console.error('Error soft deleting comment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: null,
    };
  }
}
