'use server';

import { firstDataSet, secondDataSet } from '@/app/page';

export async function getRowData(firstTokenNameList: string[], firstTokenDataList: any) {
  const mergeData = {};

  for (let i = 0; i < firstTokenNameList.length; i++) {
    mergeData[firstTokenNameList[i]] = firstTokenDataList[i];
  }

  return mergeData;
}

export async function updateRowData(rowData: any, firstDataset: { [key: string]: firstDataSet }, secondDataset: { [key: string]: secondDataSet }, tether: number) {
  const updatedRowData = { ...rowData };

  Object.entries(firstDataset).forEach(([token, data]) => {
    updatedRowData[token] = data;
  });

  Object.entries(secondDataset).forEach(([token, data]) => {
    if (updatedRowData[token]) {
      updatedRowData[token] = {
        ...updatedRowData[token],
        secondPrice: (data.trade_price * tether).toLocaleString(),
      };
    }
  });

  return updatedRowData;
}