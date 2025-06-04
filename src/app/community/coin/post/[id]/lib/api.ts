import { BoardData, Comment } from '../types';
import { clientEnv } from '@/utils/env';

const boardUrl = clientEnv.BOARD_URL;
const commentUrl = clientEnv.COMMENT_URL;

export async function getBoardData(id: string): Promise<BoardData | null> {
  const boardRequestUrl = `${boardUrl}?boardId=${id}&commentPage=0`;
  try {
    const response = await fetch(boardRequestUrl, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('게시글 데이터를 불러오는 중 오류 발생');
    }
    return await response.json();
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
  const commentRequestUrl = `${commentUrl}/${boardId}/create`;
  try {
    const response = await fetch(commentRequestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        content,
        depth,
        parentCommentId,
      }),
    });
    if (!response.ok) {
      throw new Error('댓글 작성 실패');
    }
    return await response.json();
  } catch (error) {
    console.error('댓글 작성 중 오류 발생:', error);
    return null;
  }
}

export const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
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
