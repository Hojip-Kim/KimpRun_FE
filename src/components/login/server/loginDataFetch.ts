import { clientRequest } from '@/server/fetch';

export interface responseData {
  result: 'success' | 'check';
  message: string;
  data?: string;
}

export const loginDataFetch = async (
  loginUrl: string,
  email: string,
  password: string
): Promise<responseData> => {
  try {
    const response = await clientRequest.post<responseData>(
      loginUrl,
      {
        email,
        password,
      },
      {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.error || 'login failed.');
    }
  } catch (e) {
    console.error(e);
    throw new Error(e instanceof Error ? e.message : 'Unknown error');
  }
};
