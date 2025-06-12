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

    // 🔍 요청 시작 로그
    console.log('🚀 [FETCH REQUEST START]');
    console.log('📍 URL:', url);
    console.log('🔧 Method:', finalConfig.method);
    console.log('📋 Headers:', finalConfig.headers);
    console.log('🌍 Environment:', process.env.NODE_ENV);
    console.log('⚙️ Config:', {
      timeout,
      retries,
      retryDelay,
      credentials: finalConfig.credentials,
    });

    try {
      const startTime = Date.now();

      const response = await withRetry(
        () => withTimeout(fetch(url, fetchOptions), timeout!),
        retries!,
        retryDelay!
      );

      const endTime = Date.now();
      const duration = endTime - startTime;

      const isJson = response.headers
        .get('content-type')
        ?.includes('application/json');
      const data = isJson ? await response.json() : await response.text();

      // 🔍 응답 성공 로그
      console.log('✅ [FETCH RESPONSE SUCCESS]');
      console.log('📍 URL:', url);
      console.log('📊 Status:', response.status);
      console.log('⏱️ Duration:', `${duration}ms`);
      console.log('📄 Content-Type:', response.headers.get('content-type'));
      console.log(
        '📦 Data Preview:',
        typeof data === 'string'
          ? data.substring(0, 200)
          : JSON.stringify(data).substring(0, 200)
      );

      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data,
        status: response.status,
      };
    } catch (error) {
      // 🔍 에러 로그
      console.error('❌ [FETCH ERROR]');
      console.error('📍 URL:', url);
      console.error('🔧 Method:', finalConfig.method);
      console.error('💥 Error:', error);
      console.error(
        '📋 Error Message:',
        error instanceof Error ? error.message : 'Unknown error'
      );
      console.error('🌍 Environment:', process.env.NODE_ENV);

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

  // 🔍 API 클라이언트 생성 로그
  console.log('🏗️ [API CLIENT CREATED]');
  console.log('🌐 Base URL:', baseUrl);
  console.log('⚙️ Base Config:', baseConfig);

  return {
    get: <T = any>(endpoint: string, config?: Partial<FetchConfig>) => {
      console.log('📥 [GET REQUEST]', `${baseUrl}${endpoint}`);
      return request<T>(`${baseUrl}${endpoint}`, { ...config, method: 'GET' });
    },

    post: <T = any>(
      endpoint: string,
      data?: any,
      config?: Partial<FetchConfig>
    ) => {
      console.log('📤 [POST REQUEST]', `${baseUrl}${endpoint}`, 'Data:', data);
      return request<T>(`${baseUrl}${endpoint}`, {
        ...config,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      });
    },

    put: <T = any>(
      endpoint: string,
      data?: any,
      config?: Partial<FetchConfig>
    ) => {
      console.log('🔄 [PUT REQUEST]', `${baseUrl}${endpoint}`, 'Data:', data);
      return request<T>(`${baseUrl}${endpoint}`, {
        ...config,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      });
    },

    patch: <T = any>(
      endpoint: string,
      data?: any,
      config?: Partial<FetchConfig>
    ) => {
      console.log('🔧 [PATCH REQUEST]', `${baseUrl}${endpoint}`, 'Data:', data);
      return request<T>(`${baseUrl}${endpoint}`, {
        ...config,
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      });
    },

    delete: <T = any>(endpoint: string, config?: Partial<FetchConfig>) => {
      console.log('🗑️ [DELETE REQUEST]', `${baseUrl}${endpoint}`);
      return request<T>(`${baseUrl}${endpoint}`, {
        ...config,
        method: 'DELETE',
      });
    },
  };
};
