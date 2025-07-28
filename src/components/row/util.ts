import { dataListType } from "./types";

export const sortDataByConfig = (
  data: { [key: string]: dataListType },
  key: string,
  direction: string
) => {
  return Object.entries(data).sort((a, b) => {
    const valueA = a[1][key];
    const valueB = b[1][key];

    if (key === "kimp") {
      const kimpA = a[1].secondPrice ? a[1].kimp * 100 : -Infinity;
      const kimpB = b[1].secondPrice ? b[1].kimp * 100 : -Infinity;

      return direction === "asc" ? kimpA - kimpB : kimpB - kimpA;
    }

    if (!isFinite(valueA)) return 1;
    if (!isFinite(valueB)) return -1;

    return direction === "asc" ? valueA - valueB : valueB - valueA;
  });
};
