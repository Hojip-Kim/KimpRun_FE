'use server';

import { serverEnv } from '@/utils/env';
import { serverRequest } from '@/server/fetch';
import { MarketType } from '@/types/marketType';

// market들의 토큰 네임들을 추출합니다.
// 예를들어, firstmarketList : ['BTC', 'ETH', 'XRP']
// secondmarketList : ['BTC', 'ETH', 'XRP']
// 이렇게 두 개의 배열이 반환됩니다.
// 현재는 upbit, binance 고정으로 되어있지만, 향후 거래소를 늘림에 따라 파라미터를 추가해야합니다.

let firstMarketList: string[] = [];
let secondMarketList: string[] = [];

export async function getTokenNames(firstMarket: MarketType, secondMarket: MarketType) {
  try {
    const url = serverEnv.MARKET_FIRST_NAME;

    const requestUrl = new URL(url);
    requestUrl.searchParams.set('first', firstMarket);
    requestUrl.searchParams.set('second', secondMarket);

    const response = await serverRequest.get(requestUrl.toString(), {
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
    });

    if (response.success) {
      firstMarketList = response.data.firstMarketList;
      secondMarketList = response.data.secondMarketList;
      return response.data;
    } else {
      console.error('❌ 토큰 이름 가져오기 실패:', response.error);
      return null;
    }
  } catch (error) {
    console.error('❌ 토큰 이름 요청 오류:', error);
    return null;
  }
}
export async function getInitialTokenNames(firstMarket: MarketType, secondMarket: MarketType) {
  return await getTokenNames(firstMarket, secondMarket);
}

// 초기 결합된 토큰 데이터 가져오기
// 초기 firstmarket, secondMarket으로 토큰리스트에 해당하는 토큰들의 데이터를 가져옴.
export async function getInitialCombinedTokenData(firstMarket: MarketType, secondMarket: MarketType) {
  try {
    const tokenNames = [firstMarketList, secondMarketList];
    if (tokenNames.length >= 2) {
      return await getCombinedTokenData(firstMarket, secondMarket);
    }
    return null;
  } catch (error) {
    console.error('초기 결합 토큰 데이터 요청 오류:', error);
    return null;
  }
}

// first market, second market 결합된 데이터 fetching
export async function getCombinedTokenData(
  firstMarket: MarketType,
  secondMarket: MarketType
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

export async function getCombineTokenData() {
  try {
    const url = new URL(serverEnv.MARKET_COMBINE_DATA);
    url.searchParams.set('first', firstMarketList.join(','));
    url.searchParams.set('second', secondMarketList.join(','));

    const response = await serverRequest.get(url.toString(), {
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
    });

    if (response.success) {
      return response.data;
    } else {
      console.error('❌ 결합 토큰 데이터 가져오기 실패:', response.error);
      return null;
    }
  } catch (error) {
    console.error('❌ 결합 토큰 데이터 요청 오류:', error);
    return null;
  }
}
