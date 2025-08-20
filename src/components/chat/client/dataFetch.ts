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
