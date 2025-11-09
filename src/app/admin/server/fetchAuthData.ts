'use server';

import { serverGet, serverPatch, serverPost } from '@/server/fetch/server';
import { ProcessedApiResponse } from '@/server/type';
import { serverEnv } from '@/utils/env';
import { RoleInfo, UpdateUserRoleRequest, DeleteUserRequest } from '../types';

/**
 * 모든 권한 조회
 */
export async function getAllRoles(): Promise<
  ProcessedApiResponse<RoleInfo[]>
> {
  try {
    const endpoint = `/role`;
    const response = await serverGet<RoleInfo[]>(endpoint);
    return response;
  } catch (error) {
    console.error('Error fetching roles:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: [],
    };
  }
}

/**
 * ID로 권한 조회
 */
export async function getRoleById(
  id: number
): Promise<ProcessedApiResponse<RoleInfo>> {
  try {
    const endpoint = `/role/${id}`;
    const response = await serverGet<RoleInfo>(endpoint);
    return response;
  } catch (error) {
    console.error('Error fetching role by ID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: null,
    };
  }
}

/**
 * ID로 사용자 조회 (MANAGER only)
 */
export async function getUserById(
  id: number
): Promise<ProcessedApiResponse<any>> {
  try {
    const endpoint = `/user/${id}`;
    const response = await serverGet<any>(endpoint);
    return response;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: null,
    };
  }
}

/**
 * 사용자 권한 업데이트 (MANAGER only)
 */
export async function updateUserRole(
  request: UpdateUserRoleRequest
): Promise<ProcessedApiResponse<any>> {
  try {
    const endpoint = `/user/update/role`;
    const response = await serverPatch<any>(endpoint, {
      userId: request.userId,
      role: request.role,
    });
    return response;
  } catch (error) {
    console.error('Error updating user role:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: null,
    };
  }
}

/**
* 사용자 삭제 (OPERATOR/MANAGER only)
 */
export async function deleteUser(
  request: DeleteUserRequest
): Promise<ProcessedApiResponse<boolean>> {
  try {
    const endpoint = `/user/delete`;
    const response = await serverPost<boolean>(endpoint, {
      userId: request.userId,
    });
    return response;
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: false,
    };
  }
}
