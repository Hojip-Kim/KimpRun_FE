import { clientRequest } from '@/server/fetch';
import { ChatMessage } from '@/types';
import { PageResponse } from '@/types/page';
import { clientEnv } from '@/utils/env';

// 모든 채팅 로그 가져오기
export async function getChatLogs(page: number = 0, size: number = 20) {
  try {
    const url = new URL(clientEnv.CHAT_LOG_URL);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('size', size.toString());

    const response = await clientRequest.get<PageResponse<ChatMessage>>(
      url.toString(),
      {
        credentials: 'include',
        headers: { 'Content-type': 'application/json' },
      }
    );

    if (response.success && response.data) {
      return response.data.content;
    } else {
      console.error('채팅 로그 가져오기 실패:', response.error);
      return [];
    }
  } catch (error) {
    console.error('채팅 로그 요청 오류:', error);
    return [];
  }
}

export async function deleteAnonChatByInherenceId(inherenceId: string) {
  try {
    const response = await clientRequest.delete(
      `http://localhost:8080/api/chat/anon`,
      {
        credentials: 'include',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ inherenceId }),
      }
    );

    if (response.success) {
      return true;
    } else {
      console.error('채팅 로그 삭제 실패:', response.error);
      return false;
    }
  } catch (error) {
    console.error('채팅 로그 삭제 오류:', error);
    return false;
  }
}

export async function deleteAuthChatByInherenceId(inherenceId: string) {
  try {
    const response = await clientRequest.delete(
      `http://localhost:8080/api/chat/auth`,
      {
        credentials: 'include',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ inherenceId }),
      }
    );

    if (response.success) {
      return true;
    } else {
      console.error('채팅 로그 삭제 실패:', response.error);
      return false;
    }
  } catch (error) {
    console.error('채팅 로그 삭제 오류:', error);
    return false;
  }
}

// 신고 API
export async function reportUser(
  fromMember: string,
  toMember: string,
  reason: string
) {
  try {
    const response = await clientRequest.post(
      'http://localhost:8080/api/declaration',
      {
        fromMember,
        toMember,
        reason,
      },
      {
        credentials: 'include',
        headers: { 'Content-type': 'application/json' },
      }
    );

    if (response.success) {
      return { success: true, message: '신고가 접수되었습니다.' };
    } else {
      console.error('신고 실패:', response.error);
      return { success: false, message: '신고 처리 중 오류가 발생했습니다.' };
    }
  } catch (error) {
    console.error('신고 요청 오류:', error);
    return { success: false, message: '신고 요청 중 오류가 발생했습니다.' };
  }
}
