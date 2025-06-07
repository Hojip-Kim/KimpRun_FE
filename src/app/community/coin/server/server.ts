import { ApiResponse, serverRequest } from '@/server/fetch';
import { AllPostData } from '../../types';
import { serverEnv } from '@/utils/env';
import { Category } from '@/app/admin/type';

const allPostsUrl = serverEnv.ALL_POSTS_URL;
const boardUrl = serverEnv.BOARD_URL;
const categoryUrl = serverEnv.CATEGORY_URL;

export async function getAllPosts(
  page: number
): Promise<ApiResponse<AllPostData>> {
  try {
    if (!allPostsUrl) {
      return {
        success: false,
        error: 'ALL_POSTS_URL not configured',
        status: 500,
        data: { boards: [], boardCount: 0 },
      };
    }

    const response = await serverRequest.get<AllPostData>(
      `${allPostsUrl}?page=${page}`,
      {
        cache: 'no-store',
      }
    );

    if (response.success && response.data) {
      return response;
    } else {
      return {
        success: false,
        error: response.error || '게시글을 가져오는데 실패했습니다.',
        status: response.status || 500,
        data: { boards: [], boardCount: 0 },
      };
    }
  } catch (error) {
    console.error('게시글 가져오기 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: { boards: [], boardCount: 0 },
    };
  }
}

export async function getPosts(
  categoryId: number,
  page: number
): Promise<ApiResponse<AllPostData>> {
  try {
    if (!boardUrl) {
      return {
        success: false,
        error: 'BOARD_URL not configured',
        status: 500,
        data: { boards: [], boardCount: 0 },
      };
    }

    const response = await serverRequest.get<AllPostData>(
      `${boardUrl}/${categoryId}/${page}`,
      {
        cache: 'no-store',
      }
    );

    if (response.success && response.data) {
      return response;
    } else {
      return {
        success: false,
        error: response.error || '게시글을 가져오는데 실패했습니다.',
        status: response.status || 500,
        data: { boards: [], boardCount: 0 },
      };
    }
  } catch (error) {
    console.error('게시글 가져오기 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: { boards: [], boardCount: 0 },
    };
  }
}

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  try {
    if (!categoryUrl) {
      return {
        success: false,
        error: 'CATEGORY_URL not configured',
        status: 500,
        data: [],
      };
    }

    const response = await serverRequest.get<Category[]>(categoryUrl, {
      cache: 'no-store',
    });

    if (response.success && response.data) {
      return response;
    } else {
      return {
        success: false,
        error: response.error || '카테고리를 가져오는데 실패했습니다.',
        status: response.status || 500,
        data: [],
      };
    }
  } catch (error) {
    console.error('카테고리 가져오기 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: [],
    };
  }
}
