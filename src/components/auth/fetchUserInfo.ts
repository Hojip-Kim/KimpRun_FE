import { clientEnv } from '@/utils/env';
import { clientRequest } from '@/server/fetch';
import { UserInfo } from '../market-selector/type';

const statusUrl = clientEnv.STATUS_URL;

export const fetchUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const response = await clientRequest.get<UserInfo>(statusUrl, {
      credentials: 'include',
    });

    // response가 성공하고
    if (response.success) {
      // response.data.member가 null이 아니라면 (즉, 로그인 상태)
      if (response.data.member !== null) {
        return response.data;

        // 게스트 유저라면 (즉, response.data에 uuid만 있다면)
      } else {
        return response.data;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error('사용자 정보 요청 오류:', error);
    return null;
  }
};
