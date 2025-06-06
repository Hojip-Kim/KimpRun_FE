import { fetchUserInfo } from '@/components/auth/fetchUserInfo';
import { getDollarInfo, getTetherInfo } from '@/server/serverDataLoader';
import { ApiResponse } from '@/server/type';

export const checkUserAuth = async (isAuthenticated: boolean) => {
  if (isAuthenticated) {
    const response = await fetchUserInfo();
    return response?.member;
  }
  return null;
};

export const requestTether = async () => {
  const response = await getTetherInfo();

  return response.data?.tether;
};

export const requestDollar = async () => {
  const response = await getDollarInfo();

  return response.data?.dollar;
};
