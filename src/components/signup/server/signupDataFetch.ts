import { clientRequest } from '@/server/fetch';
import { clientEnv } from '@/utils/env';
export interface signupResponse {
  email: string;
  nickname: string;
}

const signupUrl = clientEnv.SIGNUP_URL;

export const signupDataFetch = async (
  username: string,
  email: string,
  password: string
): Promise<signupResponse> => {
  try {
    const response = await clientRequest.post<signupResponse>(
      signupUrl,
      {
        username,
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
      throw new Error(response.error || 'signup failed.');
    }
  } catch (e) {
    console.error(e);
    throw new Error(e instanceof Error ? e.message : 'Unknown error');
  }
};
