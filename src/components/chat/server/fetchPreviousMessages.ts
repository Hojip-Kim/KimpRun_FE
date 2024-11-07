import serverFetch from '@/server/fetch/server';

const getChatLogUrl = process.env.NEXT_PUBLIC_CHAT_LOG_URL;

export const fetchPreviousMessages = async (page: number, size: number) => {
  const requestInit: RequestInit = {
    method: 'GET',
    headers: { 'Content-type': 'application/json' },
  };

  try {
    const data = await serverFetch(
      `${getChatLogUrl}?page=${page}&size=${size}`,
      requestInit
    );

    if (data.ok) {
      const text: string = data.text;
      return JSON.parse(text);
    } else {
      throw new Error('데이터 가져오기 오류 발생');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
