import { serverRequest } from '@/server/fetch';

export async function fetchBithumb(): Promise<string | null> {
  try {
    const url = 'https://feed.bithumb.com/notice';

    const response = await serverRequest.get<string>(url, {
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
    });

    if (response.success && response.data) {
      return response.data;
    } else {
      console.error('Bithumb 데이터 가져오기 실패:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Bithumb 데이터 요청 오류:', error);
    return null;
  }
}

