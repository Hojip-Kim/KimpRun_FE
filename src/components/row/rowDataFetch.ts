import { firstDataSet, secondDataSet } from '@/app/types';
import { clientEnv } from '@/utils/env';
import { clientRequest } from '@/server/fetch';
import { CoinDetail } from './types';

export async function getRowData(
  firstTokenNameList: string[],
  firstTokenDataList: any
) {
  const mergeData = {};

  // firstTokenDataList가 배열인지 객체인지 확인
  if (Array.isArray(firstTokenDataList)) {
    // 배열인 경우 (초기 로딩)
    for (let i = 0; i < firstTokenNameList.length; i++) {
      mergeData[firstTokenNameList[i]] = firstTokenDataList[i];
    }
  } else if (firstTokenDataList && typeof firstTokenDataList === 'object') {
    // 객체인 경우 (거래소 변경 후)
    firstTokenNameList.forEach((tokenName) => {
      if (firstTokenDataList[tokenName]) {
        mergeData[tokenName] = firstTokenDataList[tokenName];
      }
    });
  }

  return mergeData;
}

// Coin 상세 정보 가져오기
export async function getCoinDetail(
  coinId: string
): Promise<CoinDetail | null> {
  const url = new URL(clientEnv.CMC_SINGLE_COIN_URL);
  url.searchParams.set('coinId', coinId);

  try {
    const response = await clientRequest.get<CoinDetail>(url.toString(), {
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
    });

    if (response.success && response.data) {
      return response.data;
    } else {
      console.error('코인 상세 정보 가져오기 실패:', response.error);
      return null;
    }
  } catch (error) {
    console.error('코인 상세 정보 요청 오류:', error);
    return null;
  }
}

export async function updateRowDataFirstRender(
  rowData: any,
  firstDataList: { [key: string]: firstDataSet },
  secondDataList: { [key: string]: secondDataSet } | secondDataSet[]
) {
  const updatedRowData = { ...rowData };

  // 메인 거래소 데이터 업데이트 (firstDataList)
  Object.entries(firstDataList).forEach(([token, data]) => {
    updatedRowData[token] = {
      ...updatedRowData[token],
      ...data,
    };
  });

  let secondDataObject: { [key: string]: secondDataSet };

  // 배열인지 객체인지 확인하고 처리
  if (Array.isArray(secondDataList)) {
    secondDataObject = secondDataList.reduce((acc, item) => {
      acc[item.token] = item;
      return acc;
    }, {} as { [key: string]: secondDataSet });
  } else {
    // 이미 객체인 경우
    secondDataObject = secondDataList;
  }

  if (Object.keys(secondDataObject).length === 0) {
    return updatedRowData;
  }

  // 비교 거래소 데이터로 secondPrice와 kimp 계산
  Object.entries(secondDataObject).forEach(([token, data]) => {
    if (updatedRowData[token]) {
      const adjustedPrice = data.trade_price;

      // kimp 계산: (메인거래소가격 / 비교거래소가격 - 1)
      const kimpValue =
        adjustedPrice !== 0
          ? updatedRowData[token].trade_price / adjustedPrice - 1
          : -1;

      updatedRowData[token] = {
        ...updatedRowData[token],
        secondPrice: adjustedPrice,
        kimp: kimpValue,
      };
    }
  });
  return updatedRowData;
}

export async function updateRowData(
  rowData: any,
  firstDataset: { [key: string]: firstDataSet },
  secondDataset: { [key: string]: secondDataSet }
) {
  const updatedRowData = { ...rowData };

  // 메인 거래소 데이터 업데이트 - 52주 고가/저가는 선택적으로 업데이트
  Object.entries(firstDataset).forEach(([token, data]) => {
    if (!updatedRowData[token]) {
      // 새 토큰인 경우 모든 데이터 설정
      updatedRowData[token] = { ...data };
    } else {
      // 기존 토큰인 경우 선택적 업데이트
      const existing = updatedRowData[token];
      
      // 기본 필드들은 항상 업데이트
      updatedRowData[token] = {
        ...existing,
        token: data.token,
        trade_price: data.trade_price,
        change_rate: data.change_rate,
        rate_change: data.rate_change,
      };
      
      // 선택적 필드들 - 웹소켓에 데이터가 있을 때만 업데이트
      if (data.acc_trade_price24 !== undefined) {
        updatedRowData[token].acc_trade_price24 = data.acc_trade_price24;
      }
      if (data.opening_price !== undefined) {
        updatedRowData[token].opening_price = data.opening_price;
      }
      if (data.trade_volume !== undefined) {
        updatedRowData[token].trade_volume = data.trade_volume;
      }
      
      // 52주 고가/저가는 실제 데이터가 있고 0이 아닐 때만 업데이트
      if (data.highest_price !== undefined && data.highest_price !== 0) {
        updatedRowData[token].highest_price = data.highest_price;
      }
      if (data.lowest_price !== undefined && data.lowest_price !== 0) {
        updatedRowData[token].lowest_price = data.lowest_price;
      }
    }
  });

  // 비교 거래소 데이터 업데이트
  Object.entries(secondDataset).forEach(([token, data]) => {
    if (updatedRowData[data.token]) {
      const adjustedPrice = data.trade_price;

      // kimp 계산: (메인거래소가격 / 비교거래소가격 - 1)
      const kimpValue =
        adjustedPrice !== 0
          ? updatedRowData[data.token].trade_price / adjustedPrice - 1
          : -1;

      updatedRowData[data.token] = {
        ...updatedRowData[data.token],
        secondPrice: adjustedPrice,
        kimp: kimpValue,
      };
    }
  });
  return updatedRowData;
}
