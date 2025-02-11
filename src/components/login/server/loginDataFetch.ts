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

    const data: responseData = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error('login failed.');
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};
