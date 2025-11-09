'use server';

import { serverGet, serverPost } from '@/server/fetch/server';
import { ProcessedApiResponse } from '@/server/type';
import { serverEnv } from '@/utils/env';
import { ChatLogPage, DeleteChatRequest } from '../types';

/**
 * 모든 채팅 로그 조회
 */
export async function getChatLogs(
  page: number = 1,
  size: number = 20
): Promise<ProcessedApiResponse<ChatLogPage>> {
  try {
    const endpoint = `/chat/allLog?page=${page}&size=${size}`;
    const response = await serverGet<ChatLogPage>(endpoint);
    return response;
  } catch (error) {
    console.error('Error fetching chat logs:', error);
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
 * 채팅 메시지 삭제 (OPERATOR only)
 */
export async function deleteChatAsAdmin(
  request: DeleteChatRequest
): Promise<ProcessedApiResponse<void>> {
  try {
    const endpoint = `/chat/admin`;
    const response = await serverPost<void>(endpoint, {
      inherenceId: request.inherenceId,
    });
    return response;
  } catch (error) {
    console.error('Error deleting chat message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: null,
    };
  }
}
