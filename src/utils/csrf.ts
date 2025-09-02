import { clientRequest } from '@/server/fetch';

export interface CsrfToken {
  token: string;
  headerName: string;
  parameterName: string;
}

class CsrfTokenManager {
  private static instance: CsrfTokenManager;
  private csrfToken: CsrfToken | null = null;
  private tokenPromise: Promise<CsrfToken> | null = null;

  static getInstance(): CsrfTokenManager {
    if (!CsrfTokenManager.instance) {
      CsrfTokenManager.instance = new CsrfTokenManager();
    }
    return CsrfTokenManager.instance;
  }

  /**
   * CSRF 토큰을 가져옵니다. 캐시된 토큰이 있으면 반환하고, 없으면 서버에서 새로 가져옵니다.
   */
  async getCsrfToken(): Promise<CsrfToken> {
    // 이미 토큰이 있으면 반환
    if (this.csrfToken) {
      return this.csrfToken;
    }

    // 이미 요청 중이면 기다림
    if (this.tokenPromise) {
      return this.tokenPromise;
    }

    // 새로운 토큰 요청
    this.tokenPromise = this.fetchCsrfToken();

    try {
      this.csrfToken = await this.tokenPromise;
      return this.csrfToken;
    } finally {
      this.tokenPromise = null;
    }
  }

  /**
   * 서버에서 CSRF 토큰을 가져옵니다.
   * 기존 HTTP 클라이언트를 사용하여 세션 일관성을 보장합니다.
   */
  private async fetchCsrfToken(): Promise<CsrfToken> {
    try {
      // 기존 HTTP 클라이언트를 사용하여 세션 일관성 보장
      const apiResponse = await clientRequest.get(
        'http://localhost:8080/api/csrf/token',
        {
          headers: {
            // Cache-Control 헤더 추가로 캐시 방지
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        }
      );

      if (apiResponse.success && apiResponse.data) {
        return apiResponse.data;
      } else {
        console.error('❌ CSRF 토큰 응답 오류:', apiResponse);
        throw new Error(
          apiResponse.error || 'CSRF 토큰 응답이 올바르지 않습니다.'
        );
      }
    } catch (error) {
      console.error('❌ CSRF 토큰 획득 실패:', error);
      throw new Error('CSRF 토큰을 가져올 수 없습니다.');
    }
  }

  /**
   * 캐시된 CSRF 토큰을 초기화합니다.
   */
  clearToken(): void {
    this.csrfToken = null;
    this.tokenPromise = null;
  }

  /**
   * 강제로 새로운 CSRF 토큰을 가져옵니다 (캐시 무시)
   */
  async forceRefreshToken(): Promise<CsrfToken> {
    this.clearToken();
    return this.getCsrfToken();
  }

  /**
   * 브라우저 쿠키에서 XSRF-TOKEN을 직접 읽어옵니다
   * /api 경로로 설정된 쿠키는 JavaScript에서 직접 접근할 수 없으므로
   * 서버에서 토큰을 받아온 후 사용합니다
   */
  getCsrfTokenFromCookie(): CsrfToken | null {
    try {
      const cookies = document.cookie.split(';');

      const xsrfCookies = cookies.filter((cookie) =>
        cookie.trim().startsWith('XSRF-TOKEN=')
      );

      if (xsrfCookies.length === 0) {
        console.warn('⚠️ 쿠키에서 XSRF-TOKEN을 찾을 수 없습니다');
        console.warn(
          '💡 CSRF 쿠키가 /api 경로로 설정되어 있어 JavaScript에서 접근할 수 없습니다'
        );
        console.warn('💡 서버에서 토큰을 받아와서 사용합니다');
        return null;
      }

      // 여러 쿠키가 있을 경우 첫 번째 것을 사용 (브라우저가 더 구체적인 경로를 먼저 반환)
      const selectedCookie = xsrfCookies[0];
      const token = selectedCookie.split('=')[1];

      return {
        token: token,
        headerName: 'X-XSRF-TOKEN',
        parameterName: '_csrf',
      };
    } catch (error) {
      console.error('❌ 쿠키에서 CSRF 토큰 읽기 실패:', error);
      return null;
    }
  }

  /**
   * HTTP 요청에 CSRF 토큰을 추가합니다.
   */
  async addCsrfToHeaders(
    headers: Record<string, string> = {}
  ): Promise<Record<string, string>> {
    try {
      const csrfToken = await this.getCsrfToken();
      return {
        ...headers,
        [csrfToken.headerName]: csrfToken.token,
      };
    } catch (error) {
      console.warn('⚠️ CSRF 토큰 추가 실패, 기존 헤더 반환:', error);
      return headers;
    }
  }

  /**
   * 현재 CSRF 토큰을 반환합니다 (캐시된 것만)
   */
  getCurrentToken(): CsrfToken | null {
    return this.csrfToken;
  }
}

// 싱글톤 인스턴스 내보내기
export const csrfTokenManager = CsrfTokenManager.getInstance();

// 편의 함수들
export const getCsrfToken = () => csrfTokenManager.getCsrfToken();
export const clearCsrfToken = () => csrfTokenManager.clearToken();
export const forceRefreshCsrfToken = () => csrfTokenManager.forceRefreshToken();
export const getCsrfTokenFromCookie = () =>
  csrfTokenManager.getCsrfTokenFromCookie();
export const addCsrfToHeaders = (headers?: Record<string, string>) =>
  csrfTokenManager.addCsrfToHeaders(headers);
