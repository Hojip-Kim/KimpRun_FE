import { clientRequest } from '@/server/fetch';

export interface ProfileUpdateResponse {
  result: 'success' | 'error';
  message: string;
  data?: any;
}

export const updateNickname = async (
  updateNicknameUrl: string,
  newNickname: string
): Promise<ProfileUpdateResponse> => {
  try {
    const response = await clientRequest.put<ProfileUpdateResponse>(
      updateNicknameUrl,
      { nickname: newNickname },
      {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.error || 'nickname update failed.');
    }
  } catch (e) {
    console.error(e);
    throw new Error(e instanceof Error ? e.message : 'Unknown error');
  }
};
