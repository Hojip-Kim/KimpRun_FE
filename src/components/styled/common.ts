/**
 * 공통 styled 컴포넌트 유틸리티
 * 자주 사용되는 스타일 패턴들을 모아서 중복을 줄임
 */

import styled, { css } from 'styled-components';
import { palette } from '@/styles/palette';

// 공통 flexbox mixins
export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const flexBetween = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

export const flexColumnCenter = css`
  ${flexColumn}
  align-items: center;
  justify-content: center;
`;

// 공통 transition
export const smoothTransition = css`
  transition: all 0.2s ease;
`;

export const hoverTransform = css`
  ${smoothTransition}
  
  &:hover {
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// 공통 card 스타일
export const cardStyle = css`
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 12px;
  box-shadow: ${palette.shadow};
  backdrop-filter: blur(12px);
`;

export const cardHover = css`
  ${cardStyle}
  ${hoverTransform}
  cursor: pointer;
  
  &:hover {
    background: ${palette.accentRing};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

// 공통 버튼 스타일
export const primaryButton = css`
  ${flexCenter}
  padding: 0.75rem 1.5rem;
  background: ${palette.accent};
  color: ${palette.bgPage};
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  ${hoverTransform}
  
  &:hover {
    box-shadow: 0 4px 12px ${palette.accentRing};
  }
`;

export const secondaryButton = css`
  ${flexCenter}
  padding: 0.75rem 1.5rem;
  background: ${palette.card};
  color: ${palette.textSecondary};
  border: 1px solid ${palette.border};
  border-radius: 8px;
  cursor: pointer;
  ${hoverTransform}
  
  &:hover {
    background: ${palette.bgPage};
    color: ${palette.textPrimary};
    border-color: ${palette.textPrimary};
  }
`;

// 공통 input 스타일
export const inputStyle = css`
  padding: 0.75rem 1rem;
  border: 1px solid ${palette.border};
  border-radius: 8px;
  background: ${palette.card};
  color: ${palette.textPrimary};
  font-family: inherit;
  ${smoothTransition}
  
  &:focus {
    outline: none;
    border-color: ${palette.accent};
    box-shadow: 0 0 0 3px ${palette.accentRing};
  }
  
  &::placeholder {
    color: ${palette.textMuted};
  }
`;

// 모바일 최적화 mixin
export const mobileOptimized = css`
  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 0.5rem 0.75rem;
  }
`;