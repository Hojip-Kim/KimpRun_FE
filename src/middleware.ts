import { NextRequest, NextResponse } from 'next/server';

export const config = { matcher: ['/:path*'] };

export async function middleware(req: NextRequest) {
  return NextResponse.next();
}
