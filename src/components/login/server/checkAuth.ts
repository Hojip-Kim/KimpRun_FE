import {
  logout,
  setGuestUser,
  setIsAuthenticated,
  setUser,
} from '@/redux/reducer/authReducer';
import { AppDispatch } from '@/redux/store';
import { User } from '@/types';
import { clientEnv } from '@/utils/env';

const statusUrl = clientEnv.STATUS_URL;

const reuqestInit: RequestInit = {
  method: 'GET',
  credentials: 'include',
};

interface ResponseAuth {
  isAuthenticated: boolean;
  member: User;
}

export const checkAuth = async (dispatch: AppDispatch) => {
  try {
    const response = await fetch(statusUrl, reuqestInit);

    if (response.status === 401) {
      dispatch(setGuestUser());
      return;
    }

    const text = await response.json();
    if (!text || text.trim() === '') {
      dispatch(setGuestUser());
      return;
    }

    const responseJson: ResponseAuth = JSON.parse(text);

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
