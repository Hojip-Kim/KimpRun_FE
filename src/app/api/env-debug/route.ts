import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    MARKET_FIRST_NAME: process.env.MARKET_FIRST_NAME,
    MARKET_UPBIT_DATA: process.env.MARKET_UPBIT_DATA,
    MARKET_COMBINE_DATA: process.env.MARKET_COMBINE_DATA,
    NOTICE_URL: process.env.NOTICE_URL,
    BOARD_URL: process.env.BOARD_URL,
    ALL_POSTS_URL: process.env.ALL_POSTS_URL,
    CATEGORY_URL: process.env.CATEGORY_URL,
    COMMENT_URL: process.env.COMMENT_URL,
    MARKET_BINANCE_DATA: process.env.MARKET_BINANCE_DATA,
    MARKET_DATA: process.env.MARKET_DATA,
  };

  console.log('🔍 서버 환경변수 상태:', envVars);

  return NextResponse.json({
    message: '환경변수 디버깅 정보',
    timestamp: new Date().toISOString(),
    environment: envVars,
    status: 'success',
  });
}
