import { FetchConfig, ApiResponse, ProcessedApiResponse } from '../type';
import { addCsrfToHeaders } from '@/utils/csrf';

const DEFAULT_CONFIG: FetchConfig = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
};

const withTimeout = (
  promise: Promise<Response>,
  timeout: number
): Promise<Response> => {
  return Promise.race([
    promise,
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    ),
  ]);
};

const withRetry = async (
  fn: () => Promise<Response>,
  retries: number,
  delay: number
): Promise<Response> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay);
    }
    throw error;
  }
};

export const createRequest = (baseConfig: Partial<FetchConfig> = {}) => {
  const config = { ...DEFAULT_CONFIG, ...baseConfig };

  return async <T = any>(
    url: string,
    options: Partial<FetchConfig> = {}
  ): Promise<ProcessedApiResponse<T>> => {
    const finalConfig = { ...config, ...options };

    // POST, PUT, PATCH, DELETE 요청에 CSRF 토큰 자동 추가
    if (
      finalConfig.method &&
      ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
        finalConfig.method.toUpperCase()
      )
    ) {
      try {
        finalConfig.headers = await addCsrfToHeaders(
          finalConfig.headers as Record<string, string>
        );
      } catch (error) {
        console.warn('⚠️ CSRF 토큰 추가 실패, 요청 계속 진행:', error);
      }
    }

    const { timeout, retries, retryDelay, ...fetchOptions } = finalConfig;

    try {
      const response = await withRetry(
        () => withTimeout(fetch(url, fetchOptions), timeout!),
        retries!,
        retryDelay!
      );

      const isJson = response.headers
        .get('content-type')
        ?.includes('application/json');

      if (!isJson) {
        const text = await response.text();
        return {
          success: response.ok,
          data: response.ok ? (text as any) : undefined,
          error: response.ok ? undefined : text,
          status: response.status,
        };
      }

      // JSON 응답 처리 - 백엔드 통일 형식: {status, message, data, detail, success}
      const apiResponse: ApiResponse<T> = await response.json();

      // API 응답이 정의된 형식인지 확인
      if (
        typeof apiResponse.status === 'number' &&
        'success' in apiResponse &&
        'data' in apiResponse &&
        'message' in apiResponse
      ) {
        const isSuccess =
          apiResponse.success === true &&
          apiResponse.status >= 200 &&
          apiResponse.status < 300;

        return {
          success: isSuccess,
          data: isSuccess ? apiResponse.data : undefined,
          error: isSuccess
            ? undefined
            : apiResponse.message || apiResponse.detail || 'Unknown error',
          status: apiResponse.status,
          trace: apiResponse.detail,
        };
      }

      // 백엔드에서 정의되지 않은 형식이 온 경우 (오류 상황)
      console.error('❌ 예상하지 못한 API 응답 형식:', apiResponse);
      return {
        success: false,
        error: 'Unexpected API response format',
        status: response.status,
      };
    } catch (error) {
      console.error('❌ Fetch Error:', {
        url,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 0,
      };
    }
  };
};

export const createApiClient = (
  baseUrl: string = '',
  baseConfig: Partial<FetchConfig> = {}
) => {
  const request = createRequest(baseConfig);

  return {
    get: <T = any>(endpoint: string, config?: Partial<FetchConfig>) =>
      request<T>(`${baseUrl}${endpoint}`, { ...config, method: 'GET' }),

    post: <T = any>(
      endpoint: string,
      data?: any,
      config?: Partial<FetchConfig>
    ) =>
      request<T>(`${baseUrl}${endpoint}`, {
        ...config,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      }),

    put: <T = any>(
      endpoint: string,
      data?: any,
      config?: Partial<FetchConfig>
    ) =>
      request<T>(`${baseUrl}${endpoint}`, {
        ...config,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      }),

    patch: <T = any>(
      endpoint: string,
      data?: any,
      config?: Partial<FetchConfig>
    ) =>
      request<T>(`${baseUrl}${endpoint}`, {
        ...config,
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      }),

    delete: <T = any>(endpoint: string, config?: Partial<FetchConfig>) =>
      request<T>(`${baseUrl}${endpoint}`, { ...config, method: 'DELETE' }),
  };
};
