const signupUrl = process.env.NEXT_PUBLIC_SIGNUP_URL;

interface SignupResponse {
  email: string;
  nickname: string;
}

const postRequestInit: RequestInit = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const signupDataFetch = async (
  nickname: string,
  email: string,
  password: string
): Promise<SignupResponse> => {
  const response = await fetch(signupUrl, {
    ...postRequestInit,
    body: JSON.stringify({ nickname, email, password }),
  });

  if (!response.ok) {
    throw new Error('Failed to signup');
  }

  const responseBody: SignupResponse = await response.json();

  return responseBody;
};
