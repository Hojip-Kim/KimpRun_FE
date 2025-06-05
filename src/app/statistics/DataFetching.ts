const requestInit: RequestInit = {
  method: 'GET',
  credentials: 'include',
  headers: { 'Content-type': 'application/json' },
};

export async function fetchBithumb(): Promise<string> {
  const url = 'https://feed.bithumb.com/notice';

  const data = await fetch(url, requestInit);
  if (data.ok) {
    return data.text();
  }
}
