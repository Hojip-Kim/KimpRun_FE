'use server';

import { serverEnv } from '@/utils/env';
import { serverRequest } from '@/server/fetch';

// market들의 토큰 네임들을 추출합니다.
// 예를들어, firstmarketList : ['BTC', 'ETH', 'XRP']
// secondmarketList : ['BTC', 'ETH', 'XRP']
// 이렇게 두 개의 배열이 반환됩니다.
// 현재는 upbit, binance 고정으로 되어있지만, 향후 거래소를 늘림에 따라 파라미터를 추가해야합니다.

let firstMarketList: string[] = [];
let secondMarketList: string[] = [];

export async function getTokenNames() {
  try {
    const url = serverEnv.MARKET_FIRST_NAME;

    console.log('🔍 getTokenNames 호출:', {
      url,
      serverEnv: {
        MARKET_FIRST_NAME: serverEnv.MARKET_FIRST_NAME,
        MARKET_COMBINE_DATA: serverEnv.MARKET_COMBINE_DATA,
        NOTICE_URL: serverEnv.NOTICE_URL,
      },
      timestamp: new Date().toISOString(),
    });

    const response = await serverRequest.get(url, {
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
    });

    if (response.success) {
      firstMarketList = response.data.firstMarketList;
      secondMarketList = response.data.secondMarketList;
      console.log('✅ 토큰 이름 가져오기 성공:', response.data);
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
export async function getInitialTokenNames() {
  return await getTokenNames();
}

// 초기 결합된 토큰 데이터 가져오기
// 초기 firstmarket, secondMarket으로 토큰리스트에 해당하는 토큰들의 데이터를 가져옴.
export async function getInitialCombinedTokenData() {
  try {
    const tokenNames = [firstMarketList, secondMarketList];
    if (tokenNames.length >= 2) {
      return await getCombinedTokenData('upbit', 'binance');
    }
    return null;
  } catch (error) {
    console.error('초기 결합 토큰 데이터 요청 오류:', error);
    return null;
  }
}

// first market, second market 결합된 데이터 fetching
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

export async function getCombineTokenData() {
  try {
    const url = new URL(serverEnv.MARKET_COMBINE_DATA);
    url.searchParams.set('first', firstMarketList.join(','));
    url.searchParams.set('second', secondMarketList.join(','));

    console.log('🔍 getCombineTokenData 호출:', {
      baseUrl: serverEnv.MARKET_COMBINE_DATA,
      fullUrl: url.toString(),
      params: {
        first: firstMarketList.join(','),
        second: secondMarketList.join(','),
      },
      timestamp: new Date().toISOString(),
    });

    const response = await serverRequest.get(url.toString(), {
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
    });

    if (response.success) {
      console.log('✅ 결합 토큰 데이터 가져오기 성공');
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
