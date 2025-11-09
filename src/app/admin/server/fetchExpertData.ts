'use server';

import { serverGet, serverPost } from '@/server/fetch/server';
import { ProcessedApiResponse } from '@/server/type';
import { serverEnv } from '@/utils/env';
import {
  ExpertApplicationPage,
  ExpertProfilePage,
  RejectApplicationRequest,
} from '../types';

/**
 * 전문가 신청 조회
 */
export async function getExpertApplications(
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED',
  page: number = 0,
  size: number = 20
): Promise<ProcessedApiResponse<ExpertApplicationPage>> {
  try {
    let endpoint = `/community/expert/admin/applications?page=${page}&size=${size}`;
    if (status) {
      endpoint += `&status=${status}`;
    }
    const response = await serverGet<ExpertApplicationPage>(endpoint);
    return response;
  } catch (error) {
    console.error('Error fetching expert applications:', error);
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
      },
    };
  }
}

/**
 * 모든 전문가 프로필 조회
 */
export async function getExpertProfiles(
  page: number = 0,
  size: number = 20
): Promise<ProcessedApiResponse<ExpertProfilePage>> {
  try {
    const endpoint = `/community/expert/admin/profiles?page=${page}&size=${size}`;
    const response = await serverGet<ExpertProfilePage>(endpoint);
    return response;
  } catch (error) {
    console.error('Error fetching expert profiles:', error);
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
      },
    };
  }
}

/**
 * 전문가 신청 승인
 */
export async function approveExpertApplication(
  applicationId: number
): Promise<ProcessedApiResponse<void>> {
  try {
    const endpoint = `/community/expert/admin/applications/${applicationId}/approve`;
    const response = await serverPost<void>(endpoint);
    return response;
  } catch (error) {
    console.error('Error approving expert application:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: null,
    };
  }
}

/**
 * 전문가 신청 거부
 */
export async function rejectExpertApplication(
  applicationId: number,
  rejectionReason: string
): Promise<ProcessedApiResponse<void>> {
  try {
    const endpoint = `/community/expert/admin/applications/${applicationId}/reject`;
    const response = await serverPost<void>(endpoint, {
      rejectionReason,
    });
    return response;
  } catch (error) {
    console.error('Error rejecting expert application:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: null,
    };
  }
}

/**
 * 전문가 프로필 활성화
 */
export async function activateExpertProfile(
  profileId: number
): Promise<ProcessedApiResponse<void>> {
  try {
    const endpoint = `/community/expert/admin/profiles/${profileId}/activate`;
    const response = await serverPost<void>(endpoint);
    return response;
  } catch (error) {
    console.error('Error activating expert profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: null,
    };
  }
}

/**
 * 전문가 프로필 비활성화
 */
export async function deactivateExpertProfile(
  profileId: number
): Promise<ProcessedApiResponse<void>> {
  try {
    const endpoint = `/community/expert/admin/profiles/${profileId}/deactivate`;
    const response = await serverPost<void>(endpoint);
    return response;
  } catch (error) {
    console.error('Error deactivating expert profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: null,
    };
  }
}

/**
 * 사용자 전문가 자격 박탈
 */
export async function revokeExpertStatus(
  memberId: number
): Promise<ProcessedApiResponse<void>> {
  try {
    const endpoint = `/community/expert/admin/members/${memberId}/revoke`;
    const response = await serverPost<void>(endpoint);
    return response;
  } catch (error) {
    console.error('Error revoking expert status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: null,
    };
  }
}
