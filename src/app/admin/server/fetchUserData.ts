'use server';

import { serverGet, serverPost, serverPatch, serverDelete } from '@/server/fetch/server';
import { ProcessedApiResponse } from '@/server/type';
import { serverEnv } from '@/utils/env';
import {
  UserDetailInfo,
  RoleInfo,
  UpdateUserRoleRequest,
  DeleteUserRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
  DeclarationPage,
} from '../types';

/**
 * ID로 사용자 조회 (MANAGER permission required)
 */
export async function getUserById(
  userId: number
): Promise<ProcessedApiResponse<UserDetailInfo>> {
  try {
    const endpoint = `${serverEnv.API_BASE_URL}/user/${userId}`;
    const response = await serverGet<UserDetailInfo>(endpoint);
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
 * 사용자 권한 업데이트 (MANAGER permission required)
 */
export async function updateUserRole(
  request: UpdateUserRoleRequest
): Promise<ProcessedApiResponse<UserDetailInfo>> {
  try {
    const endpoint = `${serverEnv.API_BASE_URL}/user/update/role`;
    const response = await serverPatch<UserDetailInfo>(endpoint, {
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
 * 사용자 삭제 (MANAGER/OPERATOR permission required)
 */
export async function deleteUser(
  request: DeleteUserRequest
): Promise<ProcessedApiResponse<boolean>> {
  try {
    const endpoint = `${serverEnv.API_BASE_URL}/user/delete`;
    const response = await serverDelete<boolean>(endpoint, {
      body: JSON.stringify({ userId: request.userId }),
    });
    return response;
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: null,
    };
  }
}

/**
 * 모든 권한 조회 (MANAGER/OPERATOR permission required)
 */
export async function getAllRoles(): Promise<ProcessedApiResponse<RoleInfo[]>> {
  try {
    const endpoint = `${serverEnv.API_BASE_URL}/role`;
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
 * ID로 권한 조회 (MANAGER/OPERATOR permission required)
 */
export async function getRoleById(
  roleId: number
): Promise<ProcessedApiResponse<RoleInfo>> {
  try {
    const endpoint = `${serverEnv.API_BASE_URL}/role/${roleId}`;
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
 * 키로 권한 조회 (MANAGER/OPERATOR permission required)
 */
export async function getRoleByKey(
  roleKey: string
): Promise<ProcessedApiResponse<RoleInfo>> {
  try {
    const endpoint = `${serverEnv.API_BASE_URL}/role/key/${roleKey}`;
    const response = await serverGet<RoleInfo>(endpoint);
    return response;
  } catch (error) {
    console.error('Error fetching role by key:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: null,
    };
  }
}

/**
 * 새로운 권한 생성 (OPERATOR permission required)
 */
export async function createRole(
  request: CreateRoleRequest
): Promise<ProcessedApiResponse<RoleInfo>> {
  try {
    const endpoint = `${serverEnv.API_BASE_URL}/role`;
    const response = await serverPost<RoleInfo>(endpoint, request);
    return response;
  } catch (error) {
    console.error('Error creating role:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: null,
    };
  }
}

/**
 * 권한 업데이트 (OPERATOR permission required)
 */
export async function updateRole(
  request: UpdateRoleRequest
): Promise<ProcessedApiResponse<RoleInfo>> {
  try {
    const endpoint = `${serverEnv.API_BASE_URL}/role/${request.roleId}`;
    const response = await serverPost<RoleInfo>(endpoint, {
      roleName: request.roleName,
    });
    return response;
  } catch (error) {
    console.error('Error updating role:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: null,
    };
  }
}

/**
 * 권한 삭제 (OPERATOR permission required)
 */
export async function deleteRole(roleId: number): Promise<ProcessedApiResponse<boolean>> {
  try {
    const endpoint = `${serverEnv.API_BASE_URL}/role/${roleId}`;
    const response = await serverDelete<boolean>(endpoint);
    return response;
  } catch (error) {
    console.error('Error deleting role:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      data: null,
    };
  }
}

/**
 * 신고 조회 (OPERATOR permission required)
 */
export async function getDeclarations(
  page: number = 0,
  size: number = 20
): Promise<ProcessedApiResponse<DeclarationPage>> {
  try {
    const endpoint = `${serverEnv.API_BASE_URL}/declaration?page=${page}&size=${size}`;
    const response = await serverGet<DeclarationPage>(endpoint);
    return response;
  } catch (error) {
    console.error('Error fetching declarations:', error);
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
