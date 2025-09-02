'use server';

import {
  serverGet,
  serverPost,
  serverPut,
  serverDelete,
} from '@/server/fetch/server';
import { serverEnv } from '@/utils/env';
import { ProcessedApiResponse } from '@/server/type';
import { AllPostData } from '../types';
import { Post } from '../coin/types';
import { Category } from '../../admin/type';

// 전체 게시글 조회
export async function getAllPosts(
  page: number = 1
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

    const url = new URL(`${serverEnv.BOARD_URL}/1?page=${page}&size=15`);

    return await serverGet<AllPostData>(url.toString(), {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ 전체 게시글 조회 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: { boardResponseDtos: [], count: 0 },
    };
  }
}

// 카테고리별 게시글 조회
export async function getPostsByCategory(
  category: string,
  page: number = 1,
  size: number = 15
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

    const url = new URL(`${serverEnv.BOARD_URL}/${category}`);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('size', size.toString());

    return await serverGet<AllPostData>(url.toString(), {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ 카테고리별 게시글 조회 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: { boardResponseDtos: [], count: 0 },
    };
  }
}

// 게시글 상세 조회
export async function getPostById(
  id: string
): Promise<ProcessedApiResponse<Post>> {
  try {
    if (!serverEnv.BOARD_URL) {
      return {
        success: false,
        error: 'BOARD_URL not configured',
        status: 500,
      };
    }

    return await serverGet<Post>(`${serverEnv.BOARD_URL}/detail/${id}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ 게시글 상세 조회 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    };
  }
}

// 게시글 작성
export async function createPost(postData: {
  title: string;
  content: string;
  category: string;
}): Promise<ProcessedApiResponse<Post>> {
  try {
    if (!serverEnv.BOARD_URL) {
      return {
        success: false,
        error: 'BOARD_URL not configured',
        status: 500,
      };
    }

    return await serverPost<Post>(`${serverEnv.BOARD_URL}/create`, postData, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ 게시글 작성 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    };
  }
}

// 게시글 수정
export async function updatePost(
  id: string,
  postData: {
    title: string;
    content: string;
    category: string;
  }
): Promise<ProcessedApiResponse<Post>> {
  try {
    if (!serverEnv.BOARD_URL) {
      return {
        success: false,
        error: 'BOARD_URL not configured',
        status: 500,
      };
    }

    return await serverPut<Post>(
      `${serverEnv.BOARD_URL}/update/${id}`,
      postData,
      {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ 게시글 수정 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    };
  }
}

// 게시글 삭제
export async function deletePost(
  id: string
): Promise<ProcessedApiResponse<void>> {
  try {
    if (!serverEnv.BOARD_URL) {
      return {
        success: false,
        error: 'BOARD_URL not configured',
        status: 500,
      };
    }

    return await serverDelete<void>(`${serverEnv.BOARD_URL}/delete/${id}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ 게시글 삭제 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    };
  }
}

// 카테고리 조회
export async function getCategories(): Promise<
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

    return await serverGet<Category[]>(`${serverEnv.CATEGORY_URL}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ 카테고리 조회 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: [],
    };
  }
}
