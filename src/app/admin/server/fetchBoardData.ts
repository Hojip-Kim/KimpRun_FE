'use server';

import { serverGet, serverPost, serverPatch } from '@/server/fetch/server';
import { ProcessedApiResponse } from '@/server/type';
import { serverEnv } from '@/utils/env';
import {
  BoardPage,
  BoardItem,
  PinBoardRequest,
  BatchHardDeleteRequest,
  BatchHardDeleteResponse,
} from '../types';

/**
 * 카테고리별 게시판 조회
 */
export async function getBoardsByCategory(
  categoryId: number,
  page: number = 1,
  size: number = 20
): Promise<ProcessedApiResponse<BoardPage>> {
  try {
    const endpoint = `${serverEnv.API_BASE_URL}/board/${categoryId}?page=${page}&size=${size}`;
    const response = await serverGet<BoardPage>(endpoint);
    return response;
  } catch (error) {
    console.error('Error fetching boards by category:', error);
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
 * ID로 게시판 조회
 */
export async function getBoardById(
  boardId: number,
  commentPage: number = 1
): Promise<ProcessedApiResponse<any>> {
  try {
    const endpoint = `${serverEnv.API_BASE_URL}/board?boardId=${boardId}&commentPage=${commentPage}`;
    const response = await serverGet<any>(endpoint);
    return response;
  } catch (error) {
    console.error('Error fetching board by ID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: null,
    };
  }
}

/**
 * 멤버 ID로 게시판 조회
 */
export async function getBoardsByMember(
  memberId: number,
  page: number = 1,
  size: number = 15
): Promise<ProcessedApiResponse<BoardPage>> {
  try {
    const endpoint = `${serverEnv.API_BASE_URL}/board/member/${memberId}?page=${page}&size=${size}`;
    const response = await serverGet<BoardPage>(endpoint);
    return response;
  } catch (error) {
    console.error('Error fetching boards by member:', error);
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
 * 게시판 삭제 (OPERATOR/MANAGER)
 */
export async function softDeleteBoard(
  boardId: number
): Promise<ProcessedApiResponse<void>> {
  try {
    const endpoint = `${serverEnv.API_BASE_URL}/board/${boardId}/soft`;
    const response = await serverPost<void>(endpoint);
    return response;
  } catch (error) {
    console.error('Error soft deleting board:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: null,
    };
  }
}

/**
 * 게시판 핀 활성화 (OPERATOR/MANAGER)
 */
export async function activateBoardPin(
  request: PinBoardRequest
): Promise<ProcessedApiResponse<boolean>> {
  try {
    const endpoint = `${serverEnv.API_BASE_URL}/board/activate`;
    const response = await serverPatch<boolean>(endpoint, request);
    return response;
  } catch (error) {
    console.error('Error activating board pin:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: false,
    };
  }
}

/**
 * 게시판 핀 비활성화 (OPERATOR/MANAGER)
 */
export async function deactivateBoardPin(
  request: PinBoardRequest
): Promise<ProcessedApiResponse<boolean>> {
  try {
    const endpoint = `${serverEnv.API_BASE_URL}/board/deActivate`;
    const response = await serverPatch<boolean>(endpoint, request);
    return response;
  } catch (error) {
    console.error('Error deactivating board pin:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: false,
    };
  }
}

/**
 * 게시판 및 댓글 삭제 (OPERATOR/MANAGER)
 */
export async function batchHardDelete(
  request: BatchHardDeleteRequest
): Promise<ProcessedApiResponse<BatchHardDeleteResponse>> {
  try {
    const endpoint = `${serverEnv.API_BASE_URL}/board/batch/hard-delete`;
    const response = await serverPost<BatchHardDeleteResponse>(endpoint, request);
    return response;
  } catch (error) {
    console.error('Error batch hard deleting:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: {
        deletedBoardCount: 0,
        deletedCommentCount: 0,
        processingTimeMs: 0,
        executedAt: new Date().toISOString(),
      },
    };
  }
}
