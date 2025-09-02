'use client';

import styled, { keyframes } from 'styled-components';
import { palette } from '@/styles/palette';

export const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const DropdownButton = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid ${palette.border};
  border-radius: 10px;
  background: ${palette.input};
  color: ${palette.textPrimary};
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.$disabled ? 0.6 : 1)};

  &:hover {
    color: ${(p) => (p.$disabled ? palette.textPrimary : palette.accent)};
    background-color: ${(p) => (p.$disabled ? palette.input : palette.input)};
  }
`;

export const DropdownValue = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  img {
    width: 14px;
    height: 14px;
    border-radius: 3px;
    object-fit: contain;
  }
`;
const fadeSlide = keyframes`
  0% { opacity: 0; transform: translateY(-6px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

export const DropdownMenu = styled.ul<{ $open: boolean }>`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 10px;
  box-shadow: ${palette.shadow};
  margin: 0;
  padding: 6px;
  list-style: none;
  z-index: 5000;
  max-height: 220px;
  overflow-y: auto;
  display: ${(p) => (p.$open ? 'block' : 'none')};
  animation: ${(p) => (p.$open ? fadeSlide : 'none')} 160ms ease-out;
`;

export const DropdownItem = styled.li<{
  $disabled?: boolean;
  $active?: boolean;
}>`
  padding: 8px 10px;
  border-radius: 8px;
  color: ${(p) => (p.$disabled ? palette.textMuted : palette.textPrimary)};
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  background: ${(p) => (p.$active ? palette.input : 'transparent')};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  font-size: 13px;
  line-height: 1.25;
  img {
    width: 14px;
    height: 14px;
    border-radius: 3px;
    object-fit: contain;
  }

  &:hover {
    color: ${(p) => (p.$disabled ? palette.textMuted : palette.accent)};
    background: ${(p) => (p.$disabled ? 'transparent' : palette.input)};
  }
`;

export const DropdownLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
`;
