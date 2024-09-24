'use server';

export const fetchLoginData = async (
  loginId: string,
  password: string
): Promise<boolean> => {
  const loginUrl = process.env.LOGIN_URL;

  const requestInit: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // 쿠키 포함
    body: JSON.stringify({
      loginId,
      password,
    }),
  };

  try {
    const response = await fetch(loginUrl, requestInit);
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};
