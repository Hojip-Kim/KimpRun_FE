import { serverEnv } from '@/utils/env';
import { tokenNameList } from '@/app/types';
import { serverRequest } from '@/server/fetch';

import { MarketType } from '@/types/marketType';

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
    const params = new URLSearchParams({ first: firstMarket, second: secondMarket });
    const url = `${serverEnv.MARKET_COMBINE_DATA}?${params.toString()}`;

    const response = await serverRequest.get(url, {
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
export async function getSingleMarketData(market: MarketType) {
  try {
    const params = new URLSearchParams({ market });
    const url = `${serverEnv.MARKET_SINGLE_DATA}?${params.toString()}`;

    const response = await serverRequest.get(url, {
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
