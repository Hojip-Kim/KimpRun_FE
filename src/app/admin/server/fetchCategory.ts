import { serverEnv } from '@/utils/env';
import { ProcessedApiResponse, serverRequest } from '@/server/fetch';
import { Category, CreateCategoryRequest } from '../types';

// 모든 카테고리 가져오기
export async function fetchAllCategories(): Promise<
  ProcessedApiResponse<Category[]>
> {
  try {
    if (!serverEnv.CATEGORY_URL) {
      return {
        success: false,
        error: 'CATEGORY_URL not configured',
        status: 500,
        data: [],
      };
    }

    const response = await serverRequest.get<Category[]>(
      serverEnv.CATEGORY_URL,
      {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (response.success && response.data) {
      return response;
    } else {
      console.error('❌ 카테고리 가져오기 실패:', response.error);
      return {
        success: false,
        error: response.error || 'Failed to fetch categories',
        status: response.status || 500,
        data: [],
      };
    }
  } catch (error) {
    console.error('❌ 카테고리 요청 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: [],
    };
  }
}

// 카테고리 생성
export async function createCategory(
  categoryData: CreateCategoryRequest
): Promise<ProcessedApiResponse<Category>> {
  try {
    if (!serverEnv.CATEGORY_URL) {
      console.warn('❌ CATEGORY_URL 환경변수가 설정되지 않았습니다.');
      return {
        success: false,
        error: 'CATEGORY_URL not configured',
        status: 500,
        data: null,
      };
    }

    const response = await serverRequest.post<Category>(
      serverEnv.CATEGORY_URL,
      categoryData,
      {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (response.success) {
      return response;
    } else {
      console.error('❌ 카테고리 생성 실패:', response.error);
      return {
        success: false,
        error: response.error || 'Failed to create category',
        status: response.status || 500,
        data: null,
      };
    }
  } catch (error) {
    console.error('❌ 카테고리 생성 요청 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
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
): Promise<ProcessedApiResponse<Category>> {
  try {
    if (!serverEnv.CATEGORY_URL) {
      console.warn('❌ CATEGORY_URL 환경변수가 설정되지 않았습니다.');
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
      console.error('❌ 카테고리 수정 실패:', response.error);
      return {
        success: false,
        error: response.error || 'Failed to update category',
        status: response.status || 500,
        data: null,
      };
    }
  } catch (error) {
    console.error('❌ 카테고리 수정 요청 오류:', error);
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
): Promise<ProcessedApiResponse<Boolean>> {
  try {
    if (!serverEnv.CATEGORY_URL) {
      console.warn('❌ CATEGORY_URL 환경변수가 설정되지 않았습니다.');
      return {
        success: false,
        error: 'CATEGORY_URL not configured',
        status: 500,
        data: false,
      };
    }

    const deleteUrl = `${serverEnv.CATEGORY_URL}/${id}`;

    const response = await serverRequest.delete(deleteUrl, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.success) {
      return response;
    } else {
      console.error('❌ 카테고리 삭제 실패:', response.error);
      return {
        success: false,
        error: response.error || 'Failed to delete category',
        status: response.status || 500,
        data: false,
      };
    }
  } catch (error) {
    console.error('❌ 카테고리 삭제 요청 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: false,
    };
  }
}
