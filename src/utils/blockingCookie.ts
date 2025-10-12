'use client';

/**
 * 차단 목록 쿠키 관리 유틸리티
 */

const BLOCKED_GUESTS_COOKIE = 'blockedGuests';
const BLOCKED_MEMBERS_COOKIE = 'blockedMembers';

// 쿠키 설정 (1년 유지)
const setCookie = (name: string, value: string) => {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
};

// 쿠키 읽기
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
};

// 차단된 게스트 목록 가져오기
export const getBlockedGuests = (): string[] => {
  try {
    const blockedGuestsStr = getCookie(BLOCKED_GUESTS_COOKIE);
    return blockedGuestsStr ? JSON.parse(blockedGuestsStr) : [];
  } catch (error) {
    console.error('차단된 게스트 목록 읽기 오류:', error);
    return [];
  }
};

// 차단된 멤버 목록 가져오기
export const getBlockedMembers = (): string[] => {
  try {
    const blockedMembersStr = getCookie(BLOCKED_MEMBERS_COOKIE);
    return blockedMembersStr ? JSON.parse(blockedMembersStr) : [];
  } catch (error) {
    console.error('차단된 멤버 목록 읽기 오류:', error);
    return [];
  }
};

// 차단된 게스트 목록 설정
export const setBlockedGuests = (blockedGuests: string[]) => {
  try {
    setCookie(BLOCKED_GUESTS_COOKIE, JSON.stringify(blockedGuests));
  } catch (error) {
    console.error('차단된 게스트 목록 저장 오류:', error);
  }
};

// 차단된 멤버 목록 설정
export const setBlockedMembers = (blockedMembers: string[]) => {
  try {
    setCookie(BLOCKED_MEMBERS_COOKIE, JSON.stringify(blockedMembers));
  } catch (error) {
    console.error('차단된 멤버 목록 저장 오류:', error);
  }
};

// 게스트 차단 추가
export const addBlockedGuest = (guestUuid: string) => {
  const currentBlocked = getBlockedGuests();
  if (!currentBlocked.includes(guestUuid)) {
    const updatedBlocked = [...currentBlocked, guestUuid];
    setBlockedGuests(updatedBlocked);
  }
};

// 멤버 차단 추가
export const addBlockedMember = (memberId: string) => {
  const currentBlocked = getBlockedMembers();
  if (!currentBlocked.includes(memberId)) {
    const updatedBlocked = [...currentBlocked, memberId];
    setBlockedMembers(updatedBlocked);
  }
};

// 게스트 차단 해제
export const removeBlockedGuest = (guestUuid: string) => {
  const currentBlocked = getBlockedGuests();
  const updatedBlocked = currentBlocked.filter((uuid) => uuid !== guestUuid);
  setBlockedGuests(updatedBlocked);
};

// 멤버 차단 해제
export const removeBlockedMember = (memberId: string) => {
  const currentBlocked = getBlockedMembers();
  const updatedBlocked = currentBlocked.filter((id) => id !== memberId);
  setBlockedMembers(updatedBlocked);
};

// 모든 차단 해제
export const clearAllBlocked = () => {
  setBlockedGuests([]);
  setBlockedMembers([]);
};
