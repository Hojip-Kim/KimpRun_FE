import { BoardData, Comment } from '../types';
import { ApiResponse } from '@/server/type';
import { serverRequest, clientRequest } from '@/server/fetch';
import { parseDate } from '@/utils/dateUtils';

export async function getBoardData(id: string): Promise<BoardData | null> {
  const boardRequestUrl = `/board?boardId=${id}&commentPage=0`;
  try {
    const response = await serverRequest.get<BoardData>(boardRequestUrl, {
      cache: 'no-store', // 캐시 비허용 - 항상 최신 데이터 가져오기
    });

    if (response.success && response.data) {
      return response.data;
    } else {
      console.error(
        '게시글 데이터 로드 실패:',
        response.error || 'Unknown error'
      );
      return null;
    }
  } catch (error) {
    console.error('게시글 데이터를 불러오는 중 오류 발생:', error);
    return null;
  }
}

export async function createComment(
  boardId: number,
  content: string,
  depth: number,
  parentCommentId: number
): Promise<Comment | null> {
  // URL 끝점만 사용하여 잘못된 URL 합성 방지
  const endpoint = `/comment/${boardId}/create`;
  try {
    const response = await clientRequest.post<Comment>(
      endpoint,
      {
        content,
        depth,
        parentCommentId,
      }
    );

    if (response.success && response.data) {
      return response.data;
    } else {
      console.error('댓글 작성 실패:', response.error || 'Unknown error');
      return null;
    }
  } catch (error) {
    console.error('댓글 작성 중 오류 발생:', error);
    return null;
  }
}

export async function deleteComment(commentId: number): Promise<boolean> {
  const endpoint = `/comment/${commentId}/soft`;
  try {
    const response = await clientRequest.delete(
      endpoint
    );

    if (response.success) {
      return true;
    } else {
      console.error('댓글 삭제 실패:', response.error || 'Unknown error');
      return false;
    }
  } catch (error) {
    console.error('댓글 삭제 중 오류 발생:', error);
    return false;
  }
}

export const formatDate = (dateInput: string | Date | number[]) => {
  const date = parseDate(dateInput);
  if (!date || isNaN(date.getTime())) {
    return '날짜 없음';
  }
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
