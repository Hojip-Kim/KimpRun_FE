'use server';

import { ServerFetchResponse, FetchConfig, ApiResponse } from '../type';
import { createApiClient } from './request';

/* RequestInit : Fetch함수 호출 옵션 명확히 정의
  method: HTTP 요청 메서드 (예: "GET", "POST", "PUT", "DELETE" 등)
  headers: 요청 헤더를 설정하기 위한 객체
  body: 요청 본문 (POST, PUT, PATCH 요청 시에 사용)
  mode: 요청의 모드 (예: "cors", "no-cors", "same-origin")
  credentials: 요청에 포함할 자격 증명 (예: "include", "same-origin", "omit")
  cache: 요청의 캐시 모드 (예: "default", "no-store", "reload", "no-cache", "force-cache", "only-if-cached")
  redirect: 리디렉션 모드 (예: "follow", "manual", "error")
  referrer: 리퍼러 정보 (예: URL 또는 "no-referrer")
  referrerPolicy: 리퍼러 정책 (예: "no-referrer", "no-referrer-when-downgrade", "origin", "origin-when-cross-origin", "unsafe-url")
  integrity: 서브 리소스 무결성 (SRI) 체크를 위한 문자열
*/

const serverApi = createApiClient('', {
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'NextJS-Server',
  },
});

export async function serverFetch(
  route: string,
  init?: RequestInit
): Promise<ServerFetchResponse> {
  try {
    console.log('🖥️ Server Fetch Request:', {
      url: route,
      method: init?.method || 'GET',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        MARKET_FIRST_NAME: process.env.MARKET_FIRST_NAME,
        NOTICE_URL: process.env.NOTICE_URL,
        BOARD_URL: process.env.BOARD_URL,
        CATEGORY_URL: process.env.CATEGORY_URL,
        MARKET_COMBINE_DATA: process.env.MARKET_COMBINE_DATA,
      },
    });

    const response = await fetch(route, init);
    const text = await response.text();

    console.log('✅ Server Fetch Response:', {
      url: route,
      status: response.status,
      ok: response.ok,
      timestamp: new Date().toISOString(),
      responseLength: text.length,
    });

    return {
      ok: response.ok,
      status: response.status,
      text,
    };
  } catch (error) {
    console.error('❌ Server Fetch Error:', {
      url: route,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });

    return {
      ok: false,
      status: 500,
      text: 'Server fetch failed',
    };
  }
}

// 서버 전용 GET 요청
export async function serverGet<T = any>(
  url: string,
  config?: Partial<FetchConfig>
): Promise<ApiResponse<T>> {
  return serverApi.get<T>(url, config);
}

// 서버 전용 POST 요청
export async function serverPost<T = any>(
  url: string,
  data?: any,
  config?: Partial<FetchConfig>
): Promise<ApiResponse<T>> {
  return serverApi.post<T>(url, data, config);
}

// 서버 전용 PUT 요청
export async function serverPut<T = any>(
  url: string,
  data?: any,
  config?: Partial<FetchConfig>
): Promise<ApiResponse<T>> {
  return serverApi.put<T>(url, data, config);
}

// 서버 전용 PATCH 요청
export async function serverPatch<T = any>(
  url: string,
  data?: any,
  config?: Partial<FetchConfig>
): Promise<ApiResponse<T>> {
  return serverApi.patch<T>(url, data, config);
}

// 서버 전용 DELETE 요청
export async function serverDelete<T = any>(
  url: string,
  config?: Partial<FetchConfig>
): Promise<ApiResponse<T>> {
  return serverApi.delete<T>(url, config);
}

// 캐시된 데이터 요청
export async function cachedRequest<T = any>(
  url: string,
  cacheKey: string,
  config?: Partial<FetchConfig>
): Promise<ApiResponse<T>> {
  // 차후 Redis로 대체
  const cache = new Map();

  return cache.get(cacheKey);
}
