'use server';

import { serverGet, serverPost } from '@/server/fetch/server';
import { ProcessedApiResponse } from '@/server/type';
import { serverEnv } from '@/utils/env';
import {
  BatchJobHistory,
  RunningJobs,
  BatchHealth,
  RateLimitStatus,
  CmcApiStatus,
  BatchJobStatus,
} from '../types';

/**
 * CMC 배치 동기화 트리거
 */
export async function triggerCmcBatchSync(
  mode: string = 'manual'
): Promise<ProcessedApiResponse<any>> {
  try {
    if (!serverEnv.API_BASE_URL) {
      return {
        success: false,
        error: 'API_BASE_URL not configured',
        status: 500,
        data: null,
      };
    }

    const endpoint = `/batch/cmc/sync?mode=${mode}`;
    const response = await serverPost<any>(endpoint);

    return response;
  } catch (error) {
    console.error('Error triggering CMC batch sync:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: null,
    };
  }
}

/**
 * 배치 작업 실행 기록 조회
 */
export async function getBatchJobHistory(
  limit: number = 10
): Promise<ProcessedApiResponse<BatchJobHistory>> {
  try {
    if (!serverEnv.API_BASE_URL) {
      return {
        success: false,
        error: 'API_BASE_URL not configured',
        status: 500,
        data: { totalCount: 0, executions: [] },
      };
    }

    const endpoint = `/batch/cmc/history?limit=${limit}`;
    const response = await serverGet<BatchJobHistory>(endpoint);

    return response;
  } catch (error) {
    console.error('Error fetching batch job history:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: { totalCount: 0, executions: [] },
    };
  }
}

/**
 * 실행 중인 배치 작업 조회
 */
export async function getRunningBatchJobs(): Promise<
  ProcessedApiResponse<RunningJobs>
> {
  try {
    if (!serverEnv.API_BASE_URL) {
      return {
        success: false,
        error: 'API_BASE_URL not configured',
        status: 500,
        data: { runningJobsCount: 0, runningJobs: [] },
      };
    }

    const endpoint = `/batch/cmc/running`;
    const response = await serverGet<RunningJobs>(endpoint);

    return response;
  } catch (error) {
    console.error('Error fetching running batch jobs:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: { runningJobsCount: 0, runningJobs: [] },
    };
  }
}

/**
 * 배치 상태 조회
 */
export async function getBatchHealth(): Promise<
  ProcessedApiResponse<BatchHealth>
> {
  try {
    if (!serverEnv.API_BASE_URL) {
      return {
        success: false,
        error: 'API_BASE_URL not configured',
        status: 500,
        data: {
          message: 'API not configured',
          jobRepositoryConnected: false,
          targetJobExists: false,
          availableJobs: [],
          timestamp: new Date().toISOString(),
        },
      };
    }

    const endpoint = `/batch/cmc/health`;
    const response = await serverGet<BatchHealth>(endpoint);

    return response;
  } catch (error) {
    console.error('Error fetching batch health:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: {
        message: 'Health check failed',
        jobRepositoryConnected: false,
        targetJobExists: false,
        availableJobs: [],
        timestamp: new Date().toISOString(),
      },
    };
  }
}

/**
 * 속도 제한 상태 조회
 */
export async function getRateLimitStatus(): Promise<
  ProcessedApiResponse<RateLimitStatus>
> {
  try {
    if (!serverEnv.API_BASE_URL) {
      return {
        success: false,
        error: 'API_BASE_URL not configured',
        status: 500,
        data: {
          currentUsage: 0,
          limit: 30,
          windowSeconds: 60,
          timestamp: new Date().toISOString(),
        },
      };
    }

    const endpoint = `/batch/cmc/rate-limit-status`;
    const response = await serverGet<RateLimitStatus>(endpoint);

    return response;
  } catch (error) {
    console.error('Error fetching rate limit status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: {
        currentUsage: 0,
        limit: 30,
        windowSeconds: 60,
        timestamp: new Date().toISOString(),
      },
    };
  }
}

/**
 * CMC API 상태 조회
 */
export async function getCmcApiStatus(): Promise<
  ProcessedApiResponse<CmcApiStatus>
> {
  try {
    if (!serverEnv.API_BASE_URL) {
      return {
        success: false,
        error: 'API_BASE_URL not configured',
        status: 500,
        data: {
          status: 'Unknown',
          timestamp: new Date().toISOString(),
        },
      };
    }

    const endpoint = `/batch/cmc/api-status`;
    const response = await serverGet<CmcApiStatus>(endpoint);

    return response;
  } catch (error) {
    console.error('Error fetching CMC API status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: {
        status: 'Error',
        timestamp: new Date().toISOString(),
      },
    };
  }
}

/**
 * 속도 제한 리셋
 */
export async function resetRateLimit(): Promise<ProcessedApiResponse<any>> {
  try {
    if (!serverEnv.API_BASE_URL) {
      return {
        success: false,
        error: 'API_BASE_URL not configured',
        status: 500,
        data: null,
      };
    }

    const endpoint = `/batch/cmc/reset-rate-limit`;
    const response = await serverPost<any>(endpoint);

    return response;
  } catch (error) {
    console.error('Error resetting rate limit:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: null,
    };
  }
}

/**
 * 분산 잠금 강제 해제
 */
export async function forceUnlockBatch(): Promise<ProcessedApiResponse<any>> {
  try {
    if (!serverEnv.API_BASE_URL) {
      return {
        success: false,
        error: 'API_BASE_URL not configured',
        status: 500,
        data: null,
      };
    }

    const endpoint = `/batch/cmc/unlock`;
    const response = await serverPost<any>(endpoint);

    return response;
  } catch (error) {
    console.error('Error force unlocking batch:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: null,
    };
  }
}

/**
 * ID로 작업 실행 상태 조회
 */
export async function getJobExecutionStatus(
  jobExecutionId: number
): Promise<ProcessedApiResponse<BatchJobStatus>> {
  try {
    if (!serverEnv.API_BASE_URL) {
      return {
        success: false,
        error: 'API_BASE_URL not configured',
        status: 500,
        data: { stepExecutions: {} },
      };
    }

    const endpoint = `/batch/cmc/status/${jobExecutionId}`;
    const response = await serverGet<BatchJobStatus>(endpoint);

    return response;
  } catch (error) {
    console.error('Error fetching job execution status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: { stepExecutions: {} },
    };
  }
}
