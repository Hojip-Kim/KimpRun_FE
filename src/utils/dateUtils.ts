/**
 * 통합 날짜 포맷팅 유틸리티
 * 중복된 날짜 포맷팅 로직들을 하나로 통합
 */

/**
 * 백엔드에서 받은 날짜 배열을 Date 객체로 변환
 * 백엔드 LocalDateTime 형식: [year, month, day, hour, minute, second, nanosecond?]
 *
 * @param dateArray - [2025, 10, 6, 11, 0, 6] 형태의 배열
 * @returns Date 객체 또는 null
 */
export function parseBackendDate(dateArray: number[] | null | undefined): Date | null {
  if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
    return null;
  }

  const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;

  // JavaScript Date는 month가 0-based (0 = January)
  // 백엔드는 1-based (1 = January)이므로 -1 필요
  return new Date(year, month - 1, day, hour, minute, second);
}

/**
 * 백엔드 날짜 배열을 Unix timestamp (milliseconds)로 변환
 *
 * @param dateArray - [2025, 10, 6, 11, 0, 6] 형태의 배열
 * @returns Unix timestamp (milliseconds) 또는 null
 */
export function parseBackendDateToTimestamp(dateArray: number[] | null | undefined): number | null {
  const date = parseBackendDate(dateArray);
  return date ? date.getTime() : null;
}

/**
 * 타입 가드: 날짜가 배열 형식인지 확인
 */
export function isDateArray(value: any): value is number[] {
  return Array.isArray(value) && value.length >= 3 && typeof value[0] === 'number';
}

/**
 * 날짜 형식 자동 감지 및 변환
 * - Date 객체: Date
 * - 배열 형식: [2025, 10, 6, 11, 0, 6]
 * - ISO 문자열: "2025-10-06T11:00:06"
 * - Unix timestamp: 1728194406000
 *
 * @param dateValue - 다양한 형식의 날짜 값
 * @returns Date 객체 또는 null
 */
export function parseDate(dateValue: number[] | string | number | Date | null | undefined): Date | null {
  if (!dateValue) {
    return null;
  }

  // Date 객체는 그대로 반환
  if (dateValue instanceof Date) {
    return isNaN(dateValue.getTime()) ? null : dateValue;
  }

  // 배열 형식 (백엔드 LocalDateTime)
  if (isDateArray(dateValue)) {
    return parseBackendDate(dateValue);
  }

  // 문자열 형식 (ISO 8601)
  if (typeof dateValue === 'string') {
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? null : date;
  }

  // 숫자 형식 (Unix timestamp)
  if (typeof dateValue === 'number') {
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
}

export const formatKoreanDate = (date: string | Date | number[]): string => {
  const targetDate = parseDate(date);
  if (!targetDate) return '';

  return targetDate
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\./g, '.')
    .replace(/ /g, '');
};

export const formatKoreanDateTime = (date: string | Date | number[]): string => {
  const targetDate = parseDate(date);
  if (!targetDate) return '';

  return targetDate.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(/\./g, '.').replace(/ /g, '');
};

export const getDaysAgo = (date: string | Date | number[]): number => {
  const targetDate = parseDate(date);
  if (!targetDate) return 0;

  const now = new Date();
  const diffTime = Math.abs(now.getTime() - targetDate.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const formatDateWithDaysAgo = (date: string | Date | number[]): { date: string; daysAgo: number } => {
  return {
    date: formatKoreanDate(date),
    daysAgo: getDaysAgo(date),
  };
};

export const formatRelativeDate = (date: string | Date | number[]): string => {
  const targetDate = parseDate(date);
  if (!targetDate) return '';

  const now = new Date();

  // 오늘 자정 시간
  const todayMidnight = new Date(now);
  todayMidnight.setHours(0, 0, 0, 0);

  // 어제 자정 시간
  const yesterdayMidnight = new Date(todayMidnight);
  yesterdayMidnight.setDate(yesterdayMidnight.getDate() - 1);

  // 3일 전 자정 시간
  const threeDaysAgoMidnight = new Date(todayMidnight);
  threeDaysAgoMidnight.setDate(threeDaysAgoMidnight.getDate() - 3);

  if (targetDate >= todayMidnight) {
    // 오늘: 시간만 표시
    return targetDate.toLocaleTimeString('ko-KR', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
  } else if (targetDate >= yesterdayMidnight) {
    // 어제: "어제" 표시
    return '어제';
  } else if (targetDate >= threeDaysAgoMidnight) {
    // 3일 이내: "N일 전" 표시
    const daysAgo = getDaysAgo(targetDate);
    return `${daysAgo}일 전`;
  } else {
    // 3일 초과: 날짜 표시
    return formatKoreanDate(targetDate);
  }
};

export const formatCommentDate = (date: string | Date | number[]): string => {
  const targetDate = parseDate(date);
  if (!targetDate) return '';

  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60));

  if (diffMinutes < 1) {
    return '방금 전';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffMinutes < 1440) { // 24시간
    const hours = Math.floor(diffMinutes / 60);
    return `${hours}시간 전`;
  } else {
    return formatRelativeDate(targetDate);
  }
};