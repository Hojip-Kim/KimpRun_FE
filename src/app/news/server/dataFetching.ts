'use server';

import { serverGet } from '@/server/fetch/server';
import { ProcessedApiResponse } from '@/server/type';
import { NewsPageResponse } from '../types';
import { serverEnv } from '@/utils/env';

/**
 * 모든 뉴스 데이터 조회
 */
export async function fetchAllNews(
  page: number = 1,
  size: number = 20
): Promise<ProcessedApiResponse<NewsPageResponse>> {
  try {
    if (!serverEnv.API_BASE_URL) {
      console.error('API_BASE_URL environment variable is not configured');
      return {
        success: false,
        error: 'API_BASE_URL not configured',
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

    const endpoint = `/news?page=${page}&size=${size}`;

    const response = await serverGet<NewsPageResponse>(endpoint, {
      headers: { 'Content-type': 'application/json' },
    });

    if (response.success && response.data) {
      return response;
    } else {
      console.error('Failed to fetch news data:', response.error);
      return {
        success: false,
        error: response.error || 'Failed to fetch news',
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
    console.error('Error fetching news data:', error);
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

/**
 * 소스에 따라 뉴스 데이터 조회
 */
export async function fetchNewsBySource(
  newsSource: string,
  page: number = 1,
  size: number = 20
): Promise<ProcessedApiResponse<NewsPageResponse>> {
  try {
    if (!serverEnv.API_BASE_URL) {
      console.error('API_BASE_URL environment variable is not configured');
      return {
        success: false,
        error: 'API_BASE_URL not configured',
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

    const endpoint = `/news/source/${newsSource}?page=${page}&size=${size}`;

    const response = await serverGet<NewsPageResponse>(endpoint, {
      headers: { 'Content-type': 'application/json' },
    });

    if (response.success && response.data) {
      return response;
    } else {
      console.error('Failed to fetch news by source:', response.error);
      return {
        success: false,
        error: response.error || 'Failed to fetch news',
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
    console.error('Error fetching news by source:', error);
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

/**
 * 헤드라인 뉴스 데이터 조회
 */
export async function fetchHeadlines(
  page: number = 1,
  size: number = 20
): Promise<ProcessedApiResponse<NewsPageResponse>> {
  try {
    if (!serverEnv.API_BASE_URL) {
      console.error('API_BASE_URL environment variable is not configured');
      return {
        success: false,
        error: 'API_BASE_URL not configured',
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

    const endpoint = `/news/headlines?page=${page}&size=${size}`;

    const response = await serverGet<NewsPageResponse>(endpoint, {
      headers: { 'Content-type': 'application/json' },
    });

    if (response.success && response.data) {
      return response;
    } else {
      console.error('Failed to fetch headline news:', response.error);
      return {
        success: false,
        error: response.error || 'Failed to fetch headlines',
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
    console.error('Error fetching headline news:', error);
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
