import { serverEnv } from '@/utils/env';
import { ApiResponse, serverRequest } from '@/server/fetch';
import { AllPostData } from '../types';

export const fetchAllPostData = async (
  page: number
): Promise<ApiResponse<AllPostData>> => {
  try {
    if (!serverEnv.BOARD_URL) {
      console.warn('BOARD_URL 환경변수가 설정되지 않았습니다.');
      return {
        success: false,
        error: 'BOARD_URL not configured',
        status: 500,
        data: { boards: [], boardCount: 0 },
      };
    }

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
      return {
        success: false,
        error: response.error || 'Failed to fetch community data',
        status: response.status || 500,
        data: { boards: [], boardCount: 0 },
      };
    }
  } catch (error) {
    console.error('커뮤니티 데이터 요청 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: { boards: [], boardCount: 0 },
    };
  }
};

export async function fetchCommunityData(
  endpoint: string
): Promise<ApiResponse<AllPostData>> {
  try {
    if (!serverEnv.BOARD_URL) {
      return {
        success: false,
        error: 'BOARD_URL not configured',
        status: 500,
        data: { boards: [], boardCount: 0 },
      };
    }

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
      return {
        success: false,
        error: response.error || 'Failed to fetch community data',
        status: response.status || 500,
        data: { boards: [], boardCount: 0 },
      };
    }
  } catch (error) {
    console.error('커뮤니티 데이터 요청 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: { boards: [], boardCount: 0 },
    };
  }
}

export async function getCommunityData(
  page: number
): Promise<ApiResponse<AllPostData>> {
  try {
    if (!serverEnv.BOARD_URL) {
      console.error('❌ BOARD_URL 환경변수가 설정되지 않았습니다.');
      return {
        success: false,
        error: 'BOARD_URL not configured',
        status: 500,
        data: { boards: [], boardCount: 0 },
      };
    }

    const url = new URL(`${serverEnv.BOARD_URL}/all/page`);
    url.searchParams.set('page', page.toString());

    console.log('🔍 getCommunityData 호출:', {
      baseUrl: serverEnv.BOARD_URL,
      fullUrl: url.toString(),
      page,
      serverEnv: {
        BOARD_URL: serverEnv.BOARD_URL,
        ALL_POSTS_URL: serverEnv.ALL_POSTS_URL,
      },
      timestamp: new Date().toISOString(),
    });

    const response = await serverRequest.get<AllPostData>(url.toString(), {
      cache: 'no-store',
    });

    if (response.success && response.data) {
      console.log('✅ 커뮤니티 데이터 가져오기 성공:', {
        boardCount: response.data.boardCount,
        boardsLength: response.data.boards?.length || 0,
      });
      return response;
    } else {
      console.error('❌ 커뮤니티 데이터 가져오기 실패:', response.error);
      return {
        success: false,
        error: response.error || '게시글을 가져오는데 실패했습니다.',
        status: response.status || 500,
        data: { boards: [], boardCount: 0 },
      };
    }
  } catch (error) {
    console.error('❌ 커뮤니티 데이터 요청 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: { boards: [], boardCount: 0 },
    };
  }
}
