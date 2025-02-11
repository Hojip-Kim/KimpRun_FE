const userInfoUrl = process.env.USER_INFO_URL;

interface UserInfo {
  email: string;
  name: string;
  role: string;
}

export const updateNickname = async (
  updateNicknameUrl: string,
  newNickname: string
) => {
  const requestInit: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nickname: newNickname }),
    credentials: 'include',
  };

  try {
    const response = await fetch(updateNicknameUrl, requestInit);

    if (response.ok) {
      const data: UserInfo = await response.json();
      return data;
    } else {
      throw new Error('Failed to update nickname');
    }
  } catch (error) {
    console.error('Error updating nickname:', error);
    throw error;
  }
};
