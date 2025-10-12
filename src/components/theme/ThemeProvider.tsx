'use client';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { darkPalette, lightPalette } from '@/styles/palette';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const currentTheme = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    const palette = currentTheme === 'dark' ? darkPalette : lightPalette;

    // CSS Variables로 전역 테마 설정
    const root = document.documentElement;

    // 테마 색상을 CSS Variables로 설정
    root.style.setProperty('--bg-page', palette.bgPage);
    root.style.setProperty('--bg-container', palette.bgContainer);
    root.style.setProperty('--card', palette.card);
    root.style.setProperty('--input', palette.input);
    root.style.setProperty('--border', palette.border);
    root.style.setProperty('--border-soft', palette.borderSoft);
    root.style.setProperty('--text-primary', palette.textPrimary);
    root.style.setProperty('--text-secondary', palette.textSecondary);
    root.style.setProperty('--text-muted', palette.textMuted);
    root.style.setProperty('--accent', palette.accent);
    root.style.setProperty('--accent-ring', palette.accentRing);
    root.style.setProperty('--shadow', palette.shadow);

    // body 스타일 업데이트
    document.body.style.backgroundColor = palette.bgPage;
    document.body.style.color = palette.textPrimary;
    document.body.style.transition =
      'background-color 0.3s ease, color 0.3s ease';

    // 전체 페이지 배경색 설정
    root.style.backgroundColor = palette.bgPage;
    root.style.transition = 'background-color 0.3s ease';

    // CSS Variables에도 transition 추가
    root.style.setProperty('--transition-theme', '0.3s ease');
  }, [currentTheme]);

  return <>{children}</>;
};

export default ThemeProvider;
