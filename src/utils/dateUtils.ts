/**
 * 통합 날짜 포맷팅 유틸리티
 * 중복된 날짜 포맷팅 로직들을 하나로 통합
 */

export const formatKoreanDate = (date: string | Date): string => {
  const targetDate = new Date(date);
  return targetDate
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
    })
    .replace(/\./g, '.')
    .replace(/ /g, '');
};

export const formatKoreanDateTime = (date: string | Date): string => {
  const targetDate = new Date(date);
  return targetDate.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(/\./g, '.').replace(/ /g, '');
};

export const getDaysAgo = (date: string | Date): number => {
  const targetDate = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - targetDate.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const formatDateWithDaysAgo = (date: string | Date): { date: string; daysAgo: number } => {
  return {
    date: formatKoreanDate(date),
    daysAgo: getDaysAgo(date),
  };
};

export const formatRelativeDate = (date: string | Date): string => {
  const targetDate = new Date(date);
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

export const formatCommentDate = (date: string | Date): string => {
  const targetDate = new Date(date);
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