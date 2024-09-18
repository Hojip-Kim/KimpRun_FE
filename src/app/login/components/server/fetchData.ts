'use server';

import serverFetch from '@/server/fetch/server';

export const fetchLoginData = async (
  loginId: string,
  password: string
): Promise<boolean> => {
  const loginUrl = 'http://localhost:8080/login';

  const requestInit: RequestInit = {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      loginId,
      password,
    }),
  };

  try {
    const response = await serverFetch(loginUrl, requestInit);

    if (response.ok) {
      const data = JSON.parse(response.text);

      if (data.result === 'success') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};
