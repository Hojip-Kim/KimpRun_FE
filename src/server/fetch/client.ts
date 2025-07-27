import {
  ClientFetchResponse,
  FetchConfig,
  ProcessedApiResponse,
} from '../type';
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
    const response = await fetch(route, init);

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
  ): Promise<ProcessedApiResponse<T>> => {
    return clientApi.get<T>(url, config);
  },

  // 클라이언트 전용 POST 요청
  post: async <T = any>(
    url: string,
    data?: any,
    config?: Partial<FetchConfig>
  ): Promise<ProcessedApiResponse<T>> => {
    return clientApi.post<T>(url, data, config);
  },

  // 클라이언트 전용 PUT 요청
  put: async <T = any>(
    url: string,
    data?: any,
    config?: Partial<FetchConfig>
  ): Promise<ProcessedApiResponse<T>> => {
    return clientApi.put<T>(url, data, config);
  },

  // 클라이언트 전용 PATCH 요청
  patch: async <T = any>(
    url: string,
    data?: any,
    config?: Partial<FetchConfig>
  ): Promise<ProcessedApiResponse<T>> => {
    return clientApi.patch<T>(url, data, config);
  },

  // 클라이언트 전용 DELETE 요청
  delete: async <T = any>(
    url: string,
    config?: Partial<FetchConfig>
  ): Promise<ProcessedApiResponse<T>> => {
    return clientApi.delete<T>(url, config);
  },
};
