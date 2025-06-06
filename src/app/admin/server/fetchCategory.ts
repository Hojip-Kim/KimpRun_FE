import { serverEnv } from '@/utils/env';
import { ApiResponse, serverRequest } from '@/server/fetch';
import { Category, CategoryResponse } from '../type';

// 모든 카테고리 가져오기
export async function fetchAllCategories(): Promise<
  ApiResponse<CategoryResponse>
> {
  try {
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
      return null;
    }
  } catch (error) {
    console.error('카테고리 요청 오류:', error);
    return null;
  }
}

// 카테고리 생성
export async function createCategory(
  name: string,
  description: string
): Promise<ApiResponse<Category>> {
  try {
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
      return null;
    }
  } catch (error) {
    console.error('카테고리 생성 오류:', error);
    return null;
  }
}

// 카테고리 수정
export async function updateCategory(
  id: number,
  name: string,
  description: string
): Promise<ApiResponse<Category>> {
  try {
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
      return null;
    }
  } catch (error) {
    console.error('카테고리 수정 오류:', error);
    return null;
  }
}

// 카테고리 삭제
export async function deleteCategory(
  id: number
): Promise<ApiResponse<Boolean>> {
  try {
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
      return null;
    }
  } catch (error) {
    console.error('카테고리 삭제 오류:', error);
    return null;
  }
}
