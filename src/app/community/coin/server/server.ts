import { ApiResponse, serverRequest } from "@/server/fetch";
import { AllPostData } from '../../types';
import { serverEnv } from "@/utils/env";
import { Category } from '@/app/admin/type';


const allPostsUrl = serverEnv.ALL_POSTS_URL;
const boardUrl = serverEnv.BOARD_URL;
const categoryUrl = serverEnv.CATEGORY_URL;

export async function getAllPosts(page: number): Promise<ApiResponse<AllPostData>> {
    try {
      const response = await serverRequest.get<AllPostData>(
        `${allPostsUrl}?page=${page}`,
        {
          cache: 'no-store',
        }
      );
  
      if (response.success && response.data) {
        return response;
      } else {
        throw new Error(response.error || '게시글을 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 가져오기 오류:', error);
      return null;
    }
  }
  
export async function getPosts(
    categoryId: number,
    page: number
  ): Promise<ApiResponse<AllPostData>> {
    try {
      const response = await serverRequest.get<AllPostData>(
        `${boardUrl}/${categoryId}/${page}`,
        {
          cache: 'no-store',
        }
      );
  
      if (response.success && response.data) {
        return response;
      } else {
        throw new Error(response.error || '게시글을 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 가져오기 오류:', error);
      return null;
    }
  }
  
export async function getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const response = await serverRequest.get(categoryUrl, {
        cache: 'no-store',
      });
  
      if (response.success && response.data) {
        return response;
      } else {
        throw new Error(response.error || '카테고리를 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('카테고리 가져오기 오류:', error);
      return null;
    }
  }
  