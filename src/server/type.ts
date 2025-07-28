export interface ClientFetchResponse {
  ok: boolean;
  status: number;
  json: () => Promise<any>;
}

export interface ServerFetchResponse {
  ok: boolean;
  status: number;
  text: string;
}

export interface FetchConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// 백엔드에서 사용하는 통일된 API 응답 형식
export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data: T | null;
  detail: string | null;
  success: boolean;
}

export interface ProcessedApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
  trace?: string | null;
}

export interface TetherInfo {
  tether: number;
}

export interface DollarInfo {
  dollar: number;
}
