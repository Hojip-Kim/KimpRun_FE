import { clientRequest } from '@/server/fetch/client';
import { clientEnv } from '@/utils/env';

export interface UpdateGuestNicknameRequest {
  uuid: string;
  nickname: string;
}

export interface UpdateGuestNicknameResponse {
  uuid: string;
  name: string;
}

export async function updateGuestNickname(
  uuid: string,
  nickname: string
): Promise<UpdateGuestNicknameResponse | null> {
  try {
    const response = await clientRequest.put<UpdateGuestNicknameResponse>(
      `${clientEnv.API_BASE_URL}/anonymous/member/nickname`,
      {
        uuid,
        nickname,
      }
    );

    if (response.success && response.data) {
      return response.data;
    } else {
      console.error('❌ 게스트 닉네임 변경 실패:', response.error);
      return null;
    }
  } catch (error) {
    console.error('❌ 게스트 닉네임 변경 API 호출 오류:', error);
    return null;
  }
}
