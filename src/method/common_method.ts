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

  // 오늘 자정 시간
  const todayMidnight = new Date(now);
  todayMidnight.setHours(0, 0, 0, 0);

  // 어제 자정 시간
  const yesterdayMidnight = new Date(todayMidnight);
  yesterdayMidnight.setDate(yesterdayMidnight.getDate() - 1);

  // 3일 전 자정 시간
  const threeDaysAgoMidnight = new Date(todayMidnight);
  threeDaysAgoMidnight.setDate(threeDaysAgoMidnight.getDate() - 3);

  if (noticeDate >= todayMidnight) {
    // 오늘 (자정 이후): 시간만 표시 (11:23:50)
    return noticeDate.toLocaleTimeString('ko-KR', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } else if (noticeDate >= yesterdayMidnight) {
    // 어제
    return '어제';
  } else if (noticeDate >= threeDaysAgoMidnight) {
    // 2일전
    return '2일전';
  } else {
    // 3일전 이후: 전체 날짜 시간 (2020-05-12 11:23:50)
    return noticeDate
      .toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      .replace(/\. /g, '-')
      .replace('.', '');
  }
};

// 자정을 넘긴 공지사항인지 확인하는 함수 (오늘 자정 이후 작성된 것만 NEW 표시)
export const isNewNotice = (date: Date): boolean => {
  const now = new Date();
  const noticeDate = new Date(date);

  // 오늘 자정 시간
  const todayMidnight = new Date(now);
  todayMidnight.setHours(0, 0, 0, 0);

  // 자정 이후에 작성된 공지사항만 NEW 표시
  return noticeDate >= todayMidnight;
};
