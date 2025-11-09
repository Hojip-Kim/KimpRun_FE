'use server';

import { serverGet } from '@/server/fetch/server';
import { ProcessedApiResponse } from '@/server/type';
import { serverEnv } from '@/utils/env';
import { DashboardStats } from '../types';

/**
 * 대시보드 통계 조회
 * 여러 데이터 소스를 병렬로 가져오기
 */
export async function getDashboardStats(): Promise<
  ProcessedApiResponse<DashboardStats>
> {
  try {
    if (!serverEnv.API_BASE_URL) {
      return {
        success: false,
        error: 'API_BASE_URL not configured',
        status: 500,
        data: {
          totalUsers: 0,
          activeUsers: 0,
          totalPosts: 0,
          totalComments: 0,
          totalCategories: 0,
          runningBatchJobs: 0,
          recentChatMessages: 0,
          systemHealth: 'error',
        },
      };
    }

    // 여러 데이터 소스를 병렬로 가져오기
    const [categoriesResponse, runningJobsResponse, chatLogResponse] =
      await Promise.allSettled([
        serverGet(`/category`),
        serverGet(`/batch/cmc/running`),
        serverGet(`/chat/allLog?page=1&size=10`),
      ]);

    // Extract data safely
    const totalCategories =
      categoriesResponse.status === 'fulfilled' &&
      categoriesResponse.value.success
        ? categoriesResponse.value.data?.categories?.length || 0
        : 0;

    const runningBatchJobs =
      runningJobsResponse.status === 'fulfilled' &&
      runningJobsResponse.value.success
        ? runningJobsResponse.value.data?.runningJobsCount || 0
        : 0;

    const recentChatMessages =
      chatLogResponse.status === 'fulfilled' && chatLogResponse.value.success
        ? chatLogResponse.value.data?.totalElements || 0
        : 0;

    // 시스템 상태 결정
    let systemHealth: 'healthy' | 'warning' | 'error' = 'healthy';
    if (runningBatchJobs > 3) {
      systemHealth = 'warning';
    }

    const stats: DashboardStats = {
      totalUsers: 0, // 사용자 API 사용 시 구현
      activeUsers: 0, // 사용자 API 사용 시 구현
      totalPosts: 0, // 게시판 통계 API 사용 시 구현
      totalComments: 0, // 댓글 통계 API 사용 시 구현
      totalCategories,
      runningBatchJobs,
      recentChatMessages,
      systemHealth,
    };

    return {
      success: true,
      data: stats,
      status: 200,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: {
        totalUsers: 0,
        activeUsers: 0,
        totalPosts: 0,
        totalComments: 0,
        totalCategories: 0,
        runningBatchJobs: 0,
        recentChatMessages: 0,
        systemHealth: 'error',
      },
    };
  }
}
