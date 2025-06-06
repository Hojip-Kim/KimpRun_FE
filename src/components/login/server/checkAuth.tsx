import {
  logout,
  setGuestUser,
  setIsAuthenticated,
  setUser,
} from '@/redux/reducer/authReducer';
import { AppDispatch } from '@/redux/store';
import { User } from '@/types';
import { clientEnv } from '@/utils/env';
import { clientRequest } from '@/server/fetch';

const statusUrl = clientEnv.STATUS_URL;

interface ResponseAuth {
  isAuthenticated: boolean;
  member: User;
}

export const checkAuth = async (dispatch: AppDispatch) => {
  try {
    const response = await clientRequest.get(statusUrl, {
      credentials: 'include',
    });

    if (response.status === 401) {
      dispatch(setGuestUser());
      return;
    }

    if (!response.success || !response.data) {
      dispatch(setGuestUser());
      return;
    }

    // 응답이 문자열인 경우 JSON 파싱
    let responseData = response.data;
    if (typeof responseData === 'string') {
      if (!responseData || responseData.trim() === '') {
        dispatch(setGuestUser());
        return;
      }
      responseData = JSON.parse(responseData);
    }

    const responseJson: ResponseAuth = responseData;

    if (responseJson.isAuthenticated === true) {
      await dispatch(setIsAuthenticated());
      await dispatch(setUser(responseJson.member));
    } else {
      await dispatch(logout());
    }
  } catch (error) {
    console.error('인증상태 확인 실패', error);
    dispatch(setGuestUser());
  }
};
