'use client';

import { clientRequest } from '@/server/fetch/client';
import { clientEnv } from '@/utils/env';

/**
 * 게시글 좋아요/공감 API 호출
 * @param boardId 게시글 ID
 * @returns Promise<{success: boolean, liked: boolean, message: string}>
 */
export async function likePost(boardId: number): Promise<{
  success: boolean;
  liked: boolean;
  message: string;
  newLikeCount?: number;
}> {
  try {
    const response = await clientRequest.patch<boolean>(
      `/board/like`,
      { boardId }
    );

    if (response.success && response.status === 200) {
      if (response.data === true) {
        // 좋아요 성공
        return {
          success: true,
          liked: true,
          message: '공감을 눌렀습니다!',
        };
      } else if (response.data === false) {
        // 이미 좋아요를 누른 상태
        return {
          success: true,
          liked: false,
          message: '이미 공감 하셨습니다.',
        };
      }
    }

    // 기타 에러
    return {
      success: false,
      liked: false,
      message: response.error || '공감 처리 중 오류가 발생했습니다.',
    };
  } catch (error) {
    console.error('❌ 게시글 좋아요 API 호출 오류:', error);
    return {
      success: false,
      liked: false,
      message: '공감 처리 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 게시글 삭제 API 호출 (소프트 딜리트)
 * @param boardId 게시글 ID
 * @returns Promise<boolean> 성공 여부
 */
export async function deletePost(boardId: number): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const response = await clientRequest.delete(
      `/${boardId}/soft`
    );

    if (response.success && response.status === 200) {
      return {
        success: true,
        message: '게시글이 삭제되었습니다.',
      };
    } else {
      return {
        success: false,
        message: response.error || '게시글 삭제에 실패했습니다.',
      };
    }
  } catch (error) {
    console.error('❌ 게시글 삭제 API 호출 오류:', error);
    return {
      success: false,
      message: '게시글 삭제 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 게시글 수정 API 호출
 * @param boardId 게시글 ID
 * @param title 수정할 제목
 * @param content 수정할 내용
 * @returns Promise<boolean> 성공 여부
 */
export async function updatePost(
  boardId: number,
  title: string,
  content: string
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const response = await clientRequest.patch(
      `/board/${boardId}`,
      { title, content }
    );

    if (response.success && response.status === 200) {
      return {
        success: true,
        message: '게시글이 수정되었습니다.',
      };
    } else {
      return {
        success: false,
        message: response.error || '게시글 수정에 실패했습니다.',
      };
    }
  } catch (error) {
    console.error('❌ 게시글 수정 API 호출 오류:', error);
    return {
      success: false,
      message: '게시글 수정 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 게시글 조회수 증가 API 호출 (필요시 구현)
 * @param boardId 게시글 ID
 * @returns Promise<boolean> 성공 여부
 */
export async function incrementViewCount(boardId: number): Promise<boolean> {
  try {
    const response = await clientRequest.patch(
      `/board/view/${boardId}`
    );

    return response.success;
  } catch (error) {
    console.error('❌ 게시글 조회수 증가 API 호출 오류:', error);
    return false;
  }
}
