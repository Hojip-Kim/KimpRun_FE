// Base URLs
const CLIENT_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
const SERVER_API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api';

// 동적 Origin 감지 함수 (클라이언트에서만 실행)
const getOrigin = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_FRONTEND_BASE_URL || 'http://localhost:3000';
};

// 클라이언트 환경 변수 - 빌드 시점에 번들에 포함됨
export const clientEnv = {
  // Base URL
  API_BASE_URL: CLIENT_API_BASE_URL,

  // STOMP WebSocket
  STOMP_URL: process.env.NEXT_PUBLIC_STOMP_URL || `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('http', 'ws') || 'ws://localhost:8080/api'}/ws`,

  // Frontend Pages - 상대 경로로 변경하여 www 유지
  MAIN_PAGE: '/',
  COMMUNITY_PAGE: '/community',
  INFORMATION_PAGE: '/information',
  NEWS_PAGE: '/news',
  PROFILE_PAGE: '/profile',

  // 절대 URL이 필요한 경우를 위한 함수
  getAbsoluteUrl: (path: string): string => `${getOrigin()}${path}`,

  // Auth Endpoints
  LOGIN_URL: '/login',
  LOGOUT_URL: '/logout',
  STATUS_URL: '/auth/status',

  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  GOOGLE_REDIRECT_URL: '/login/oauth2/code/google',
  GOOGLE_LOGIN_URL: '/oauth2/authorization/google',

  // User Endpoints
  SIGNUP_URL: '/user/sign-up',
  VERIFY_EMAIL_URL: '/user/email/verify',
  SEND_VERIFICATION_CODE_EMAIL_URL: '/user/email/new',
  UPDATE_NICKNAME_URL: '/user/update/nickname',
  USER_INFO_URL: '/user',

  // Market Info Endpoints
  DOLLAR_API_URL: '/marketInfo/dollar',
  TETHER_API_URL: '/marketInfo/tether',

  // Chat Endpoints
  CHAT_LOG_URL: '/chat/allLog',

  // Notice Endpoints
  NOTICE_URL: '/notice',

  // Market Data Endpoints
  MARKET_TOKEN_NAMES_URL: '/market/first/name',
  MARKET_COMBINED_DATA_URL: '/market/first/combine/data',
  MARKET_SINGLE_DATA: '/market/first/single/data',

  // CMC Endpoints
  CMC_SINGLE_COIN_URL: '/cmc/coin',
};

// 서버 환경 변수 - 서버 사이드에서만 사용
export const serverEnv = {
  // Base URL
  API_BASE_URL: SERVER_API_BASE_URL,

  // Market Endpoints
  MARKET_FIRST_NAME: '/market/first/name',
  MARKET_COMBINE_DATA: '/market/first/combine/data',
  MARKET_DATA: '/market/first/combine/data',
  MARKET_SINGLE_DATA: '/market/first/single/data',

  // Notice Endpoints
  NOTICE_URL: '/notice',

  // Board/Community Endpoints
  BOARD_URL: '/board',
  ALL_POSTS_URL: '/board/all/',
  CATEGORY_URL: '/category',
  COMMENT_URL: '/comment',
};
