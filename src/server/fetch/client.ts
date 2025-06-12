import { ClientFetchResponse, FetchConfig, ApiResponse } from '../type';
import { createApiClient } from './request';

const clientApi = createApiClient('', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const clientFetch = async (
  route: string,
  init?: RequestInit
): Promise<ClientFetchResponse> => {
  try {
    console.log('💻 Client Fetch Request:', {
      url: route,
      method: init?.method || 'GET',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        // 클라이언트에서는 NEXT_PUBLIC_ 환경변수만 접근 가능
        NEXT_PUBLIC_NOTICE_URL: process.env.NEXT_PUBLIC_NOTICE_URL,
        NEXT_PUBLIC_LOGIN_URL: process.env.NEXT_PUBLIC_LOGIN_URL,
      },
    });

    const response = await fetch(route, init);

    console.log('✅ Client Fetch Response:', {
      url: route,
      status: response.status,
      ok: response.ok,
      timestamp: new Date().toISOString(),
    });

    return {
      ok: response.ok,
      status: response.status,
      json: () => response.json(),
    };
  } catch (error) {
    console.error('❌ Client Fetch Error:', {
      url: route,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });

    return {
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Client fetch failed' }),
    };
  }
};

export const clientRequest = {
  // 클라이언트 전용 GET 요청
  get: async <T = any>(
    url: string,
    config?: Partial<FetchConfig>
  ): Promise<ApiResponse<T>> => {
    return clientApi.get<T>(url, config);
  },

  // 클라이언트 전용 POST 요청
  post: async <T = any>(
    url: string,
    data?: any,
    config?: Partial<FetchConfig>
  ): Promise<ApiResponse<T>> => {
    return clientApi.post<T>(url, data, config);
  },

  // 클라이언트 전용 PUT 요청
  put: async <T = any>(
    url: string,
    data?: any,
    config?: Partial<FetchConfig>
  ): Promise<ApiResponse<T>> => {
    return clientApi.put<T>(url, data, config);
  },

  // 클라이언트 전용 PATCH 요청
  patch: async <T = any>(
    url: string,
    data?: any,
    config?: Partial<FetchConfig>
  ): Promise<ApiResponse<T>> => {
    return clientApi.patch<T>(url, data, config);
  },

  // 클라이언트 전용 DELETE 요청
  delete: async <T = any>(
    url: string,
    config?: Partial<FetchConfig>
  ): Promise<ApiResponse<T>> => {
    return clientApi.delete<T>(url, config);
  },
};
