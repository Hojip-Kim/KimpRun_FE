import { NextRequest, NextResponse } from 'next/server';
import { serverRequest } from '@/server/fetch';

// 외부 api를 호출하여 데이터를 가져오는 역할을 합니다.
// 서버(백)단에서 데이터를 호출했을 때 cloudfront에 의해 차단되는 경우가 있으므로
// 클라이언트를 경유하여 데이터를 가져옴으로써 차단 우회를 합니다.
export async function POST(request: NextRequest) {
  const body = await request.json();
  const targetUrl = body.url;

  if (!targetUrl) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  try {
    const response = await serverRequest.get(targetUrl, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-Server',
      },
    });

    if (response.success) {
      return NextResponse.json(response);
    } else {
      return NextResponse.json(
        { error: response.error },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Controller gateway error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
