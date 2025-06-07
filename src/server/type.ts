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

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}
export interface TetherInfo {
  tether: number;
}

export interface DollarInfo {
  dollar: number;
}

