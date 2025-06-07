import { clientRequest } from '@/server/fetch';
import { clientEnv } from '@/utils/env';

// 모든 채팅 로그 가져오기
export async function getChatLogs(page: number = 0, size: number = 20) {
  try {
    const url = new URL(clientEnv.CHAT_LOG_URL);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('size', size.toString());

    const response = await clientRequest.get(url.toString(), {
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
    });

    if (response.success) {
      return response.data;
    } else {
      console.error('채팅 로그 가져오기 실패:', response.error);
      return null;
    }
  } catch (error) {
    console.error('채팅 로그 요청 오류:', error);
    return null;
  }
}
