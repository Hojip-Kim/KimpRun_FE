import { fetchUserInfo } from '@/components/auth/fetchUserInfo';
import { clientRequest } from '@/server/fetch';
import { ProcessedApiResponse, DollarInfo, TetherInfo } from '@/server/type';
import { clientEnv } from '@/utils/env';

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

// 달러 정보 가져오기
export async function getDollarInfo(): Promise<
  ProcessedApiResponse<DollarInfo>
> {
  try {
    const response = await clientRequest.get<DollarInfo>(
      clientEnv.DOLLAR_API_URL,
      {
        credentials: 'include',
        headers: { 'Content-type': 'application/json' },
      }
    );

    if (response.success) {
      return response;
    } else {
      console.error('달러 정보 가져오기 실패:', response.error);
      return null;
    }
  } catch (error) {
    console.error('달러 정보 요청 오류:', error);
    return null;
  }
}

// 테더 정보 가져오기
export async function getTetherInfo(): Promise<
  ProcessedApiResponse<TetherInfo>
> {
  try {
    const response = await clientRequest.get<TetherInfo>(
      clientEnv.TETHER_API_URL,
      {
        credentials: 'include',
        headers: { 'Content-type': 'application/json' },
      }
    );

    if (response.success) {
      return response;
    } else {
      console.error('테더 정보 가져오기 실패:', response.error);
      return null;
    }
  } catch (error) {
    console.error('테더 정보 요청 오류:', error);
    return null;
  }
}
