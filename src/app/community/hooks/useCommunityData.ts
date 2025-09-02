'use client';

import { useState, useCallback } from 'react';
import { createApiClient } from '@/server/fetch/request';
import { clientEnv } from '@/utils/env';
import { AllPostData } from '../types';
import { Post } from '../coin/types';

// Client-side API client
const communityApi = createApiClient('/api/community');

export const useCommunityData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 전체 게시글 조회 (Client-side)
  const fetchAllPosts = useCallback(async (page: number = 0) => {
    setLoading(true);
    setError(null);

    try {
      const response = await communityApi.get<AllPostData>(
        `/1?page=${page}&size=15`
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.error || '게시글을 불러오는데 실패했습니다.');
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 카테고리별 게시글 조회 (Client-side)
  const fetchPostsByCategory = useCallback(
    async (category: string, page: number = 0) => {
      setLoading(true);
      setError(null);

      try {
        const response = await communityApi.get<AllPostData>(
          `/${category}/page?page=${page}`
        );

        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.error || '게시글을 불러오는데 실패했습니다.');
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : '알 수 없는 오류가 발생했습니다.';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 게시글 상세 조회 (Client-side)
  const fetchPostById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await communityApi.get<Post>(`/detail/${id}`);

      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.error || '게시글을 불러오는데 실패했습니다.');
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 게시글 작성 (Client-side)
  const createPost = useCallback(
    async (postData: { title: string; content: string; category: string }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await communityApi.post<Post>('/create', postData);

        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.error || '게시글 작성에 실패했습니다.');
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : '알 수 없는 오류가 발생했습니다.';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 게시글 수정 (Client-side)
  const updatePost = useCallback(
    async (
      id: string,
      postData: {
        title: string;
        content: string;
        category: string;
      }
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await communityApi.put<Post>(
          `/update/${id}`,
          postData
        );

        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.error || '게시글 수정에 실패했습니다.');
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : '알 수 없는 오류가 발생했습니다.';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 게시글 삭제 (Client-side)
  const deletePost = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await communityApi.delete(`/delete/${id}`);

      if (response.success) {
        return true;
      } else {
        setError(response.error || '게시글 삭제에 실패했습니다.');
        return false;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    clearError,
    fetchAllPosts,
    fetchPostsByCategory,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
  };
};
