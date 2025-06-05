import { NextResponse } from 'next/server';

const requestInit: RequestInit = {
  method: 'GET',
  credentials: 'include',
  headers: { 'Content-type': 'application/json' },
};

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    const data = await requestApiCall(url);
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error in POST handler:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

async function requestApiCall(url: string) {
  const response = await fetch(url, requestInit);

  const contentType = response.headers.get('content-type') || '';

  if (response.ok) {
    if (contentType.includes('application/json')) {
      const jsonData = await response.json();
      return jsonData;
    } else {
      const textData = await response.text();
      return textData;
    }
  } else {
    const errorText = await response.text();
    throw new Error(
      `API 호출 실패 (상태: ${response.status}): ${errorText},'url :' ${url}`
    );
  }
}
