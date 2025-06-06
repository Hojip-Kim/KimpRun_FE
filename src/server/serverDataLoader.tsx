import { serverEnv } from '@/utils/env';
import { tokenNameList } from '@/app/types';
import { ApiResponse, serverRequest } from '@/server/fetch';
import { DollarInfo, TetherInfo } from './type';

export async function getTokenNames() {
  try {
    const url = serverEnv.MARKET_FIRST_NAME;
    const response = await serverRequest.get<tokenNameList>(url, {
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
    });

    if (response.success) {
      return response.data;
    } else {
      console.error('토큰 이름 가져오기 실패:', response.error);
      return null;
    }
  } catch (error) {
    console.error('토큰 이름 요청 오류:', error);
    return null;
  }
}

// 결합된 토큰 데이터 가져오기
export async function getCombinedTokenData(
  firstMarket: string,
  secondMarket: string
) {
  try {
    const url = new URL(serverEnv.MARKET_COMBINE_DATA);
    url.searchParams.set('first', firstMarket);
    url.searchParams.set('second', secondMarket);

    const response = await serverRequest.get(url.toString(), {
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
    });

    if (response.success) {
      return {
        firstMarketDataList: response.data.firstMarketDataList || {},
        secondMarketDataList: response.data.secondMarketDataList || {},
      };
    } else {
      console.error('결합 토큰 데이터 가져오기 실패:', response.error);
      return null;
    }
  } catch (error) {
    console.error('결합 토큰 데이터 요청 오류:', error);
    return null;
  }
}

// 단일 마켓 토큰 데이터 가져오기
export async function getSingleMarketData(market: string) {
  try {
    const url = new URL(serverEnv.MARKET_UPBIT_DATA);
    url.searchParams.set('market', market);

    const response = await serverRequest.get(url.toString(), {
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
    });

    if (response.success) {
      return response.data;
    } else {
      console.error(`${market} 마켓 데이터 가져오기 실패:`, response.error);
      return null;
    }
  } catch (error) {
    console.error(`${market} 마켓 데이터 요청 오류:`, error);
    return null;
  }
}

// 달러 정보 가져오기
export async function getDollarInfo(): Promise<ApiResponse<DollarInfo>> {
  try {
    const response = await serverRequest.get<DollarInfo>(serverEnv.DOLLAR_API_URL, {
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
    });

    if (response.success) {
      return response;
    } else {
      console.error('달러 정보 가져오기 실패:', response.error);
      return null;
    }
  } catch (error) {
    console.error('달러 정보 요청 오류:', error);
    return null;
  }
}

// 테더 정보 가져오기
export async function getTetherInfo(): Promise<ApiResponse<TetherInfo>> {
  try {
    const response = await serverRequest.get<TetherInfo>(serverEnv.TETHER_API_URL, {
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
    });

    if (response.success) {
      return response;
    } else {
      console.error('테더 정보 가져오기 실패:', response.error);
      return null;
    }
  } catch (error) {
    console.error('테더 정보 요청 오류:', error);
    return null;
  }
}

// 모든 채팅 로그 가져오기
export async function getChatLogs(page: number = 0, size: number = 20) {
  try {
    const url = new URL(serverEnv.CHAT_LOG_URL);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('size', size.toString());

    const response = await serverRequest.get(url.toString(), {
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
    });

    if (response.success) {
      return response.data;
    } else {
      console.error('채팅 로그 가져오기 실패:', response.error);
      return null;
    }
  } catch (error) {
    console.error('채팅 로그 요청 오류:', error);
    return null;
  }
}
