import { clientRequest } from '@/server/fetch';
import { clientEnv } from '@/utils/env';
import { MarketType } from '@/types/marketType';
import { tokenNameList, TokenNameMapping } from '../types';

// Symbol-ID 매핑 정보 가져오기
export async function getClientTokenMapping(
  firstMarket: MarketType,
  secondMarket: MarketType
): Promise<TokenNameMapping | null> {
  try {
    const url = new URL(clientEnv.MARKET_TOKEN_NAMES_URL);
    url.searchParams.set('first', firstMarket);
    url.searchParams.set('second', secondMarket);

    const response = await clientRequest.get<TokenNameMapping>(url.toString(), {
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
      cache: 'no-store',
    });

    if (response.success) {
      return response.data;
    } else {
      console.error('❌ 토큰 매핑 정보 가져오기 실패:', response.error);
      return null;
    }
  } catch (error) {
    console.error('❌ 토큰 매핑 정보 요청 오류:', error);
    return null;
  }
}

// 클라이언트 컴포넌트에서 사용되는 토큰 이름 목록 가져오기
export async function getClientTokenNames(
  firstMarket: MarketType,
  secondMarket: MarketType
) {
  try {
    const url = new URL(clientEnv.MARKET_TOKEN_NAMES_URL);
    url.searchParams.set('first', firstMarket);
    url.searchParams.set('second', secondMarket);

    const response = await clientRequest.get<tokenNameList>(url.toString(), {
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
      cache: 'no-store',
    });

    if (response.success) {
      return response.data;
    } else {
      console.error('클라이언트 토큰 이름 가져오기 실패:', response.error);
      return null;
    }
  } catch (error) {
    console.error('클라이언트 토큰 이름 요청 오류:', error);
    return null;
  }
}

// 단일 거래소의 마켓 데이터 가져오기
export async function getClientSingleMarketData(market: MarketType) {
  try {
    const url = new URL(clientEnv.MARKET_SINGLE_DATA);
    url.searchParams.set('market', market);

    const response = await clientRequest.get(url.toString(), {
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
      cache: 'no-store',
    });

    if (response.success) {
      const marketDataList = arrayToObject(response.data.marketDataList || []);
      return marketDataList;
    } else {
      console.error(
        `❌ ${market} 단일 마켓 데이터 가져오기 실패:`,
        response.error
      );
      return null;
    }
  } catch (error) {
    console.error(`❌ ${market} 단일 마켓 데이터 요청 오류:`, error);
    return null;
  }
}

// 배열을 객체로 변환하는 헬퍼 함수
function arrayToObject(dataArray: any[]) {
  const result: { [key: string]: any } = {};
  if (Array.isArray(dataArray)) {
    dataArray.forEach((item) => {
      if (item && item.token) {
        result[item.token] = item;
      }
    });
  }
  return result;
}

// 클라이언트 컴포넌트에서 사용되는 결합된 토큰 데이터 가져오기
export async function getClientCombinedTokenData(
  firstMarket: MarketType,
  secondMarket: MarketType
) {
  try {
    const url = new URL(clientEnv.MARKET_COMBINED_DATA_URL);
    url.searchParams.set('first', firstMarket);
    url.searchParams.set('second', secondMarket);

    const response = await clientRequest.get(url.toString(), {
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
      cache: 'no-store',
    });

    if (response.success) {
      const firstMarketDataList = arrayToObject(
        response.data.firstMarketDataList || []
      );
      const secondMarketDataList = arrayToObject(
        response.data.secondMarketDataList || []
      );

      return {
        firstMarketDataList,
        secondMarketDataList,
      };
    } else {
      console.error(
        '❌ 클라이언트 결합 토큰 데이터 가져오기 실패:',
        response.error
      );
      return null;
    }
  } catch (error) {
    console.error('❌ 클라이언트 결합 토큰 데이터 요청 오류:', error);
    return null;
  }
}
