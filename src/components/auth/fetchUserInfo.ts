import { clientEnv } from '@/utils/env';
import { clientRequest } from '@/server/fetch';

const statusUrl = clientEnv.STATUS_URL;

interface UserInfo {
  isAuthenticated: boolean;
  member: {
    id: number;
    email: string;
    nickname: string;
    role: string;
  };
}

export const fetchUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const response = await clientRequest.get<UserInfo>(statusUrl, {
      credentials: 'include',
    });

    if (response.success && response.data) {
      return response.data;
    } else {
      console.error('사용자 정보 가져오기 실패:', response.error);
      return null;
    }
  } catch (error) {
    console.error('사용자 정보 요청 오류:', error);
    return null;
  }
};
