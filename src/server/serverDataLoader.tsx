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
