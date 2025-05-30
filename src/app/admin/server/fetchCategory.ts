import { clientEnv } from '@/utils/env';

export type category = {
  id: number;
  categoryName: string;
};

export const createCategory = async (
  categoryName: string
): Promise<category> => {
  const requestInit: RequestInit = {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const response = await fetch(clientEnv.CATEGORY_URL, {
    ...requestInit,
    body: JSON.stringify({ categoryName }),
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('Failed to fetch category');
  }
};

export const getCategories = async (): Promise<category[]> => {
  const requestInit: RequestInit = {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  };
  const response = await fetch(clientEnv.CATEGORY_URL, {
    ...requestInit,
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('Failed to fetch categories');
  }
};

export const updateCategory = async (
  id: number,
  categoryName: string
): Promise<category> => {
  const requestInit: RequestInit = {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ categoryId: id, categoryName }),
  };
  const response = await fetch(clientEnv.CATEGORY_URL, {
    ...requestInit,
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('Failed to update category');
  }
};

export const deleteCategory = async (id: number): Promise<boolean> => {
  try {
    const requestInit: RequestInit = {
      method: 'DELETE',
      credentials: 'include',
    };
    const response = await fetch(`${clientEnv.CATEGORY_URL}/${id}`, {
      ...requestInit,
    });

    if (response.status === 204) {
      return true; // 삭제 성공
    } else if (response.status === 404) {
      return false; // 카테고리 없음
    }
  } catch (error) {
    console.error('카테고리 삭제 중 오류 발생:', error);
    throw new Error('카테고리 삭제 실패');
  }
};
