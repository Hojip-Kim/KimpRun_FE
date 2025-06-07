import { serverEnv } from '@/utils/env';
import { ApiResponse, serverRequest } from '@/server/fetch';
import { Category, CategoryResponse } from '../type';

// 모든 카테고리 가져오기
export async function fetchAllCategories(): Promise<
  ApiResponse<CategoryResponse>
> {
  try {
    if (!serverEnv.CATEGORY_URL) {
      console.warn('CATEGORY_URL 환경변수가 설정되지 않았습니다.');
      return {
        success: false,
        error: 'CATEGORY_URL not configured',
        status: 500,
        data: { categories: [], total: 0 },
      };
    }

    const response = await serverRequest.get<CategoryResponse>(
      serverEnv.CATEGORY_URL,
      {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (response.success && response.data) {
      return response;
    } else {
      console.error('카테고리 가져오기 실패:', response.error);
      return {
        success: false,
        error: response.error || 'Failed to fetch categories',
        status: response.status || 500,
        data: { categories: [], total: 0 },
      };
    }
  } catch (error) {
    console.error('카테고리 요청 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: { categories: [], total: 0 },
    };
  }
}

// 카테고리 생성
export async function createCategory(
  name: string,
  description: string
): Promise<ApiResponse<Category>> {
  try {
    if (!serverEnv.CATEGORY_URL) {
      return {
        success: false,
        error: 'CATEGORY_URL not configured',
        status: 500,
        data: null,
      };
    }

    const response = await serverRequest.post<Category>(
      serverEnv.CATEGORY_URL,
      { name, description },
      {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (response.success && response.data) {
      return response;
    } else {
      console.error('카테고리 생성 실패:', response.error);
      return {
        success: false,
        error: response.error || '카테고리 생성 실패',
        status: response.status || 500,
        data: null,
      };
    }
  } catch (error) {
    console.error('카테고리 생성 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '카테고리 생성 오류',
      status: 500,
      data: null,
    };
  }
}

// 카테고리 수정
export async function updateCategory(
  id: number,
  name: string,
  description: string
): Promise<ApiResponse<Category>> {
  try {
    if (!serverEnv.CATEGORY_URL) {
      return {
        success: false,
        error: 'CATEGORY_URL not configured',
        status: 500,
        data: null,
      };
    }

    const response = await serverRequest.put<Category>(
      serverEnv.CATEGORY_URL,
      { id, name, description },
      {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (response.success && response.data) {
      return response;
    } else {
      console.error('카테고리 수정 실패:', response.error);
      return {
        success: false,
        error: response.error || 'Failed to update category',
        status: response.status || 500,
        data: null,
      };
    }
  } catch (error) {
    console.error('카테고리 수정 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: null,
    };
  }
}

// 카테고리 삭제
export async function deleteCategory(
  id: number
): Promise<ApiResponse<Boolean>> {
  try {
    if (!serverEnv.CATEGORY_URL) {
      return {
        success: false,
        error: 'CATEGORY_URL not configured',
        status: 500,
        data: false,
      };
    }

    const response = await serverRequest.delete(
      `${serverEnv.CATEGORY_URL}/${id}`,
      {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (response.success) {
      return response;
    } else {
      console.error('카테고리 삭제 실패:', response.error);
      return {
        success: false,
        error: response.error || 'Failed to delete category',
        status: response.status || 500,
        data: false,
      };
    }
  } catch (error) {
    console.error('카테고리 삭제 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: false,
    };
  }
}
