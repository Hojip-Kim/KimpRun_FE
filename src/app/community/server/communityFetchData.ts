import { serverEnv } from '@/utils/env';
import { ProcessedApiResponse, serverGet } from '@/server/fetch';
import { AllPostData, CommunityPostResponse } from '../types';

export const fetchAllPostData = async (
  page: number
): Promise<ProcessedApiResponse<AllPostData>> => {
  try {
    if (!serverEnv.BOARD_URL) {
      console.warn('BOARD_URL 환경변수가 설정되지 않았습니다.');
      return {
        success: false,
        error: 'BOARD_URL not configured',
        status: 500,
        data: { boardResponseDtos: [], count: 0 },
      };
    }

    const url = `${serverEnv.BOARD_URL}/1?page=${page}&size=15`;

    const response = await serverGet<AllPostData>(url, {
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
    });

    if (response.success) {
      return response;
    } else {
      console.error('커뮤니티 데이터 가져오기 실패:', response.trace);
      return {
        success: false,
        error: response.error || 'Failed to fetch community data',
        status: response.status || 500,
        data: { boardResponseDtos: [], count: 0 },
      };
    }
  } catch (error) {
    console.error('커뮤니티 데이터 요청 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: { boardResponseDtos: [], count: 0 },
    };
  }
};

export async function fetchCommunityData(
  endpoint: string
): Promise<ProcessedApiResponse<AllPostData>> {
  try {
    if (!serverEnv.BOARD_URL) {
      return {
        success: false,
        error: 'BOARD_URL not configured',
        status: 500,
        data: { boardResponseDtos: [], count: 0 },
      };
    }

    const response = await serverGet<AllPostData>(
      `${serverEnv.BOARD_URL}${endpoint}`,
      {
        credentials: 'include',
        headers: { 'Content-type': 'application/json' },
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
        data: { boardResponseDtos: [], count: 0 },
      };
    }
  } catch (error) {
    console.error('커뮤니티 데이터 요청 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: { boardResponseDtos: [], count: 0 },
    };
  }
}

export async function getCommunityData(
  page: number
): Promise<ProcessedApiResponse<AllPostData>> {
  try {
    if (!serverEnv.BOARD_URL) {
      console.error('❌ BOARD_URL 환경변수가 설정되지 않았습니다.');
      return {
        success: false,
        error: 'BOARD_URL not configured',
        status: 500,
        data: { boardResponseDtos: [], count: 0 },
      };
    }

    const url = `${serverEnv.BOARD_URL}/1?page=${page}&size=15`;

    const response = await serverGet<AllPostData>(url, {
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
    });

    if (response.success && response.data) {
      return response;
    } else {
      console.error('❌ 커뮤니티 데이터 가져오기 실패:', response.error);
      return {
        success: false,
        error: response.error || '게시글을 가져오는데 실패했습니다.',
        status: response.status || 500,
        data: { boardResponseDtos: [], count: 0 },
      };
    }
  } catch (error) {
    console.error('❌ 커뮤니티 데이터 요청 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: { boardResponseDtos: [], count: 0 },
    };
  }
}

// 새로운 페이지 형식 데이터 가져오기 (서버 사이드)
export async function fetchCommunityPostsServer(
  page: number = 1,
  size: number = 15,
  category: string = '1'
): Promise<ProcessedApiResponse<CommunityPostResponse>> {
  try {
    if (!serverEnv.BOARD_URL) {
      console.error('❌ BOARD_URL 환경변수가 설정되지 않았습니다.');
      return {
        success: false,
        error: 'BOARD_URL not configured',
        status: 500,
        data: {
          content: [],
          totalPages: 0,
          totalElements: 0,
          size: 0,
          number: 0,
          numberOfElements: 0,
          first: true,
          last: true,
          empty: true,
        },
      };
    }

    // API는 1-based 페이지 시스템 사용
    let endpoint: string;
    if (category === 'all' || category === '1') {
      endpoint = `${serverEnv.BOARD_URL}/1?page=${page}&size=${size}`;
    } else {
      endpoint = `${serverEnv.BOARD_URL}/${category}?page=${page}&size=${size}`;
    }

    const response = await serverGet<CommunityPostResponse>(endpoint, {
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
    });

    if (response.success && response.data) {
      return response;
    } else {
      console.error('❌ 커뮤니티 게시글 가져오기 실패:', response.error);
      return {
        success: false,
        error: response.error || '게시글을 가져오는데 실패했습니다.',
        status: response.status || 500,
        data: {
          content: [],
          totalPages: 0,
          totalElements: 0,
          size: 0,
          number: 0,
          numberOfElements: 0,
          first: true,
          last: true,
          empty: true,
        },
      };
    }
  } catch (error) {
    console.error('❌ 커뮤니티 게시글 요청 오류:', error);
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
        numberOfElements: 0,
        first: true,
        last: true,
        empty: true,
      },
    };
  }
}
