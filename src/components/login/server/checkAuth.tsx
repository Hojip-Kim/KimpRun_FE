import {
  logout,
  setGuestUser,
  setIsAuthenticated,
  setUser,
  setUuid,
} from '@/redux/reducer/authReducer';
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

    await dispatch(setUuid(response.data.uuid));
    // 게스트 유저라면 (isAuthenticated가 false이고 uuid가 있다면)
    if (
      response.success &&
      response.data.uuid &&
      response.data.isAuthenticated === false
    ) {
      await dispatch(setGuestUser());
      return;
    } else if (
      response.success &&
      response.data.member &&
      response.data.isAuthenticated === true
    ) {
      await dispatch(setIsAuthenticated());
      await dispatch(setUser(response.data.member));
      return;
    } else if (response.success && response.data.isAuthenticated === false) {
      await dispatch(logout());
      return;
    }
  } catch (error) {
    console.error('인증상태 확인 실패:', error);
    dispatch(setGuestUser());
  }
};
