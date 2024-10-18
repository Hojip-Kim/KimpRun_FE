import { logout, setIsAuthenticated } from '@/redux/reducer/authReducer';
import { setUser } from '@/redux/reducer/infoReducer';
import { AppDispatch } from '@/redux/store';

const statusUrl = process.env.USER_STATUS_URL;

const reuqestInit: RequestInit = {
  method: 'GET',
  credentials: 'include',
};

export const checkAuth = async (dispatch: AppDispatch) => {
  try {
    const response = await fetch(
      statusUrl,
      reuqestInit
    );
    if (response.ok) {
      const data = await response.json();
      // response data의 isAuthenticated키값이 true라면
      if (data.isAuthenticated) {
        dispatch(setIsAuthenticated(true));
        dispatch(setUser(data.user));
      } else {
        // 현재 isAuthenticated 전역상태필드가 false면 로그아웃
        dispatch(logout());
      }
    } else {
      // 현재 유저의 세션쿠키가 비정상 쿠키라면 로그아웃
      dispatch(logout());
    }
  } catch (error) {
    console.error('인증상태 확인 실패', error);
    dispatch(logout());
  }
};
