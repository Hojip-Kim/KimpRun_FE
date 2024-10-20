export const loginDataFetch = async (
  loginUrl: string,
  email: string,
  password: string
): Promise<Boolean> => {
  const requestInit: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // 쿠키 포함
    body: JSON.stringify({
      email,
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
