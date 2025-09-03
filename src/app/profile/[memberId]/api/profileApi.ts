'use client';

import { clientRequest } from '@/server/fetch/client';
import { clientEnv } from '@/utils/env';

export interface UpdateNicknameRequest {
  nickname: string;
}

export interface UpdateNicknameResponse {
  email: string;
  name: string;
  role: string;
  memberId: number;
}

/**
 * 닉네임 변경 API 호출
 * @param nickname 새로운 닉네임
 * @returns Promise<UpdateNicknameResponse | null> 성공시 사용자 정보, 실패시 null
 * @throws Error 400 에러 시 '이미 사용 중인 닉네임입니다' 메시지와 함께 에러 발생
 */
export async function updateNickname(
  nickname: string
): Promise<UpdateNicknameResponse | null> {
  try {
    const response = await clientRequest.patch<UpdateNicknameResponse>(
      `${clientEnv.API_BASE_URL}/user/update/nickname`,
      { nickname }
    );

    if (response.success && 200 <= response.status && response.status < 300) {
      return response.data;
    } else if (response.status === 400) {
      // 400 Bad Request: 중복 닉네임
      console.error('❌ 중복 닉네임:', response.error);
      throw new Error('이미 사용 중인 닉네임입니다.');
    } else {
      console.error('❌ 닉네임 변경 실패:', response.error);
      return null;
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === '이미 사용 중인 닉네임입니다.'
    ) {
      throw error;
    }
    console.error('❌ 닉네임 변경 API 호출 오류:', error);
    return null;
  }
}

/**
 * 프로필 이미지 변경 API 호출 (추후 구현 예정)
 * @param imageFile 업로드할 이미지 파일
 * @returns Promise<boolean> 성공 여부
 */
export async function updateProfileImage(imageFile: File): Promise<boolean> {
  try {
    // TODO: 프로필 이미지 변경 엔드포인트가 준비되면 구현
    return false;
  } catch (error) {
    console.error('❌ 프로필 이미지 변경 API 호출 오류:', error);
    return false;
  }
}

export async function deleteMember(password: string): Promise<boolean> {
  try {
    const response = await clientRequest.delete<boolean>(
      `${clientEnv.API_BASE_URL}/user/softDelete`,
      { body: JSON.stringify({ password }) }
    );

    if (response.success && 200 <= response.status && response.status < 300) {
      return response.data;
    } else {
      console.error('❌ 회원탈퇴 실패:', response.error);
      return false;
    }
  } catch (error) {
    console.error('❌ 회원탈퇴 API 호출 오류:', error);
    return false;
  }
}
