import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // www 서브도메인을 apex 도메인으로 리다이렉트 (301 영구 리다이렉트)
  if (url.hostname === 'www.kimprun.com') {
    url.hostname = 'kimprun.com';

    const response = NextResponse.redirect(url, 301);

    response.headers.set('Cache-Control', 'public, max-age=31536000');
    response.headers.set('Vary', 'Host');

    return response;
  }

  const response = NextResponse.next();

  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  response.headers.set(
    'Link',
    '</fonts/inter.woff2>; rel=preload; as=font; type=font/woff2; crossorigin'
  );

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|woff|woff2|ttf|eot|css|js)).*)',
  ],
};
