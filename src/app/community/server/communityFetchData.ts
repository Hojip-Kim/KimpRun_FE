import { serverEnv } from '@/utils/env';
import { ApiResponse, serverRequest } from '@/server/fetch';
import { AllPostData } from '../types';

export const fetchAllPostData = async (
  page: number
): Promise<ApiResponse<AllPostData>> => {
  try {
    const url = new URL(`${serverEnv.BOARD_URL}/all/page`);
    url.searchParams.set('page', page.toString());

    const response = await serverRequest.get(url.toString(), {
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
      cache: 'no-store',
    });

    if (response.success) {
      return response;
    } else {
      console.error('커뮤니티 데이터 가져오기 실패:', response.error);
      return null;
    }
  } catch (error) {
    console.error('커뮤니티 데이터 요청 오류:', error);
    return null;
  }
};

export async function fetchCommunityData(
  endpoint: string
): Promise<ApiResponse<AllPostData>> {
  try {
    const response = await serverRequest.get(
      `${serverEnv.BOARD_URL}${endpoint}`,
      {
        credentials: 'include',
        headers: { 'Content-type': 'application/json' },
        cache: 'no-store',
      }
    );

    if (response.success) {
      return response;
    } else {
      console.error('커뮤니티 데이터 가져오기 실패:', response.error);
      return null;
    }
  } catch (error) {
    console.error('커뮤니티 데이터 요청 오류:', error);
    return null;
  }
}
