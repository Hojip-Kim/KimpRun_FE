export function numberToKorean(number) {
  var inputNumber = number < 0 ? false : number;
  var unitWords = ['만', '억', '조', '경'];
  var splitUnit = 10000;
  var splitCount = unitWords.length;
  var resultArray = [];
  var resultString = '';

  for (var i = 0; i < splitCount; i++) {
    var unitResult =
      (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
    unitResult = Math.floor(unitResult);
    if (unitResult > 0) {
      resultArray[i] = unitResult;
    }
  }

  for (var i = 0; i < resultArray.length; i++) {
    if (!resultArray[i]) continue;
    resultString = String(resultArray[i]) + unitWords[i] + resultString;
  }

  return resultString;
}

export function rateCompareByOriginPrice(number: number) {
  let num = number - 1;

  return num % 100;
}

export const formatNoticeDate = (date : Date) => {
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
}