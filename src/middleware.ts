import { verifySignedCookie } from '@/lib/verifyCookie';
import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'kimprun-token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 365일 (1년))

export const config = { matcher: ['/:path*'] };

function toBase64Url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...Array.from(bytes)))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

async function sign(input: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(process.env.COOKIE_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(input));
  return toBase64Url(new Uint8Array(sig));
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const cookie = req.cookies.get(COOKIE_NAME)?.value;

  const s = process.env.COOKIE_SECRET!;
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  const hex = Array.from(new Uint8Array(d))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // 이미 발급된 쿠키가 있다면 정합성 검증
  if (cookie) {
    const parsedCookie = await verifySignedCookie(cookie).catch(() => null);
    if (parsedCookie) {
      return res;
    }
  } else {
    // 쿠키가 존재하지 않으면 새로 발급
    const randomBytes = crypto.getRandomValues(new Uint8Array(16));
    const randomString = toBase64Url(randomBytes);
    const payload = JSON.stringify({
      id: crypto.randomUUID(),
      random: randomString,
      iat: Date.now(),
      timestamp: Date.now() + Math.random() * 1000,
    });
    const payloadB64Url = toBase64Url(new TextEncoder().encode(payload));
    const signature = await sign(payload);
    const value = `${payloadB64Url}.${signature}`;

    const opts: Parameters<typeof res.cookies.set>[2] = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS전용 (production 환경 - true, 개발 환경 - false)
      maxAge: COOKIE_MAX_AGE, // 365일 (1년)
      sameSite: 'lax', // CSRF 공격 방지 (lax: 기본값, strict: 같은 도메인에서만 전송)
      path: '/',
    };

    if (process.env.NODE_ENV === 'production') {
      opts.domain = 'kimprun.com';
    }

    res.cookies.set(COOKIE_NAME, value, opts);
  }

  return res;
}
