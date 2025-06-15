import { FetchConfig, ApiResponse } from '../type';

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
  ): Promise<ApiResponse<T>> => {
    const finalConfig = { ...config, ...options };
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
      const data = isJson ? await response.json() : await response.text();

      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data,
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
