export function numberToKorean(number) {
  if (typeof number !== 'number' || number < 0) return '';

  const unitWords = ['', '만', '억', '조', '경'];
  const splitUnit = 10000;
  const resultArray = [];

  let result = number;

  while (result > 0) {
    resultArray.push(result % splitUnit);
    result = Math.floor(result / splitUnit);
  }

  let resultString = '';

  for (let i = resultArray.length - 1; i >= 0; i--) {
    if (resultArray[i] === 0) continue;
    resultString += `${resultArray[i]}${unitWords[i]}`;
  }

  return resultString || '0';
}

export function rateCompareByOriginPrice(number: number) {
  let num = number - 1;

  return num % 100;
}

export const formatNoticeDate = (date: Date) => {
  const now = new Date();
  const noticeDate = new Date(date);
  const diffTime = Math.abs(now.getTime() - noticeDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return '오늘';
  } else if (diffDays === 2) {
    return '어제';
  } else if (diffDays <= 7) {
    return `${diffDays - 1}일 전`;
  } else {
    return noticeDate.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  }
};

// 1일 이내의 공지사항인지 확인하는 함수
export const isNewNotice = (date: Date): boolean => {
  const now = new Date();
  const noticeDate = new Date(date);
  const diffTime = Math.abs(now.getTime() - noticeDate.getTime());
  const diffHours = diffTime / (1000 * 60 * 60);

  return diffHours <= 24;
};
