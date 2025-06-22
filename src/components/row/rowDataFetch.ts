import { firstDataSet, secondDataSet } from "@/app/types";

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
  } else if (firstTokenDataList && typeof firstTokenDataList === "object") {
    // 객체인 경우 (거래소 변경 후)
    firstTokenNameList.forEach((tokenName) => {
      if (firstTokenDataList[tokenName]) {
        mergeData[tokenName] = firstTokenDataList[tokenName];
      }
    });
  }

  return mergeData;
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

  // 메인 거래소 데이터 업데이트
  Object.entries(firstDataset).forEach(([token, data]) => {
    updatedRowData[token] = {
      ...updatedRowData[token],
      ...data,
    };
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
