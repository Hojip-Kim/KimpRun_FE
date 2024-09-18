'use server';

import { ServerFetchResponse } from '@/types';

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
const serverFetch = async (
  url: string,
  init: RequestInit
): Promise<ServerFetchResponse> => {
  const response = await fetch(url, init).then(async (r) => {
    return {
      ok: r.ok,
      status: r.status,
      text: await r.text(),
    };
  });

  return response;
};

export default serverFetch;
