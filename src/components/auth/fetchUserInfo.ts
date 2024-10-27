import { UserFetch } from '@/types';
import { AppDispatch } from '@/redux/store';
import {
  setIsAuthenticated,
  setUser,
  setGuestUser,
  logout,
} from '@/redux/reducer/authReducer';

export const fetchUserInfo = async (
  statusUrl: string,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    const response = await fetch(statusUrl, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const data: UserFetch = await response.json();
      if (data && data.user) {
        dispatch(setUser(data.user));
        dispatch(setIsAuthenticated(true));
      } else {
        dispatch(setGuestUser());
      }
    } else {
      dispatch(logout());
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
};
