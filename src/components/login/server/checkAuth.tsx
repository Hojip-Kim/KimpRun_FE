import { login, setGuestUser, setUuid } from '@/redux/reducer/authReducer';
import { AppDispatch } from '@/redux/store';
import { User } from '@/types';
import { clientEnv } from '@/utils/env';
import { clientRequest } from '@/server/fetch';

const statusUrl = clientEnv.STATUS_URL;

interface ResponseAuth {
  isAuthenticated: boolean;
  member: User;
  uuid?: string;
}

export const checkAuth = async (dispatch: AppDispatch) => {
  try {
    const response = await clientRequest.get<ResponseAuth>(statusUrl, {
      credentials: 'include',
    });

    // UUID 설정 (있는 경우)
    if (response.data.uuid) {
      dispatch(setUuid(response.data.uuid));
    }

    // 응답이 성공적이지 않거나 데이터가 없는 경우
    if (!response.success || !response.data) {
      dispatch(setGuestUser());
      return;
    }

    // 인증된 사용자인 경우 (member 정보가 있고 isAuthenticated가 true)
    if (response.data.isAuthenticated === true && response.data.member) {
      dispatch(login(response.data.member));
      return;
    }

    // 인증되지 않은 사용자 (게스트)
    if (response.data.isAuthenticated === false) {
      dispatch(setGuestUser());
      return;
    }

    // 예상치 못한 상황
    console.warn('⚠️ 예상치 못한 인증 응답:', response.data);
    dispatch(setGuestUser());
  } catch (error) {
    console.error('❌ 인증상태 확인 실패:', error);
    dispatch(setGuestUser());
  }
};
