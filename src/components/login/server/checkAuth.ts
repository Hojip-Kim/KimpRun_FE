import {
  logout,
  setIsAuthenticated,
  setUser,
} from '@/redux/reducer/authReducer';
import { AppDispatch } from '@/redux/store';

const statusUrl = process.env.USER_STATUS_URL;

const reuqestInit: RequestInit = {
  method: 'GET',
  credentials: 'include',
};

export const checkAuth = async (dispatch: AppDispatch) => {
  try {
    const response = await fetch(statusUrl, reuqestInit);
    const responseJson = await response.json();

    if (responseJson.isAuthenticated === true) {
      await dispatch(setIsAuthenticated());
    } else {
      // 현재 유저의 세션쿠키가 비정상 쿠키라면 로그아웃
      await dispatch(logout());
    }
    await dispatch(setUser(responseJson.user));
  } catch (error) {
    console.error('인증상태 확인 실패', error);
    dispatch(logout());
  }
};
