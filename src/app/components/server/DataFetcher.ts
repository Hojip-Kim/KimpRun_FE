'use server';

import serverFetch from '@/server/fetch/server';
import { tokenNameList, TokenNameList } from '@/app/page';

const marketListURL = process.env.NEXT_PUBLIC_MARKET_FIRST_NAME;
const marketDataURL = process.env.NEXT_PUBLIC_MARKET_COMBINE_DATA;
const upbitMarketDataURL = process.env.NEXT_PUBLIC_MARKET_UPBIT_DATA;

const requestInit: RequestInit = {
  method: 'GET',
  credentials: 'include',
  headers: { 'Content-type': 'application/json' },
};

export async function fetchTokenNames(): Promise<tokenNameList | null> {
  try {
    const nameList = await serverFetch(marketListURL, requestInit);

    if (nameList.ok) {
      const text: string = nameList.text;
      const tokenNameList: tokenNameList = JSON.parse(text);
      return tokenNameList;
    } else {
      throw new Error('Data Name parse Error Occured!');
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchTokenCombinedDatas(firstMarket: string, secondMarket: string) {
  try {
    const url = new URL(marketDataURL);
    url.searchParams.set('first', firstMarket);
    url.searchParams.set('second', secondMarket);

    const result = await serverFetch(url.toString(), requestInit);
    if (result.ok) {
      return JSON.parse(result.text);
    } else {
      throw new Error('Error Occured');
    }
  } catch (error) {
    console.error(error);
  }
}

export async function fetchTokenDatas(market: string) {
  try {
    const url = new URL(upbitMarketDataURL);
    url.searchParams.set('market', market);

    const result = await serverFetch(url.toString(), requestInit);
    if (result.ok) {
      return JSON.parse(result.text);
    } else {
      throw new Error('Error Occured');
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}