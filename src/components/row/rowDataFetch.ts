import { firstDataSet, secondDataSet } from '@/app/page';

export async function getRowData(
  firstTokenNameList: string[],
  firstTokenDataList: any
) {
  const mergeData = {};

  for (let i = 0; i < firstTokenNameList.length; i++) {
    mergeData[firstTokenNameList[i]] = firstTokenDataList[i];
  }

  return mergeData;
}

export async function updateRowDataFirstRender(
  rowData: any,
  firstDataList: { [key: string]: firstDataSet },
  secondDataList: { [key: string]: secondDataSet },
  dollar: number
) {
  const updatedRowData = { ...rowData };

  Object.entries(firstDataList).forEach(([token, data]) => {
    updatedRowData[token] = data;
  });

  Object.entries(secondDataList).forEach(([token, data]) => {
    if (updatedRowData[data.token]) {
      updatedRowData[data.token] = {
        ...updatedRowData[data.token],
        secondPrice: data.trade_price * dollar,
        kimp:
          data.trade_price !== 0
            ? (updatedRowData[data.token].trade_price /
                (data.trade_price * dollar) -
                1) *
              100
            : -100,
      };
    }
  });
  return updatedRowData;
}

export async function updateRowData(
  rowData: any,
  firstDataset: { [key: string]: firstDataSet },
  secondDataset: { [key: string]: secondDataSet },
  dollar: number
) {
  const updatedRowData = { ...rowData };

  Object.entries(firstDataset).forEach(([token, data]) => {
    updatedRowData[token] = {
      ...updatedRowData[token],
      ...data,
    };
  });

  Object.entries(secondDataset).forEach(([token, data]) => {
    if (updatedRowData[data.token]) {
      updatedRowData[data.token] = {
        ...updatedRowData[data.token],
        secondPrice: data.trade_price * dollar,
        kimp:
          data.trade_price !== 0
            ? (updatedRowData[data.token].trade_price /
                (data.trade_price * dollar) -
                1) *
              100
            : -100,
      };
    }
  });
  return updatedRowData;
}
