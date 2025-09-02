// 다크 테마
export const darkPalette = {
  bgPage: '#0b0f17',
  bgContainer: '#121212',
  card: 'rgba(20, 24, 34, 0.9)',
  input: 'rgba(8, 12, 20, 0.9)',
  border: 'rgba(255, 255, 255, 0.06)',
  borderSoft: 'rgba(255, 255, 255, 0.08)',
  textPrimary: '#e6e8ee',
  textSecondary: '#cfd6e4',
  textMuted: '#9aa6bf',
  accent: '#ffd700',
  accentRing: 'rgba(255, 215, 0, 0.1)',
  shadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
};

// 라이트 테마
export const lightPalette = {
  bgPage: '#ffffff',
  bgContainer: '#f8f9fa',
  card: 'rgba(255, 255, 255, 0.9)',
  input: 'rgba(248, 249, 250, 0.9)',
  border: 'rgba(0, 0, 0, 0.08)',
  borderSoft: 'rgba(0, 0, 0, 0.12)',
  textPrimary: '#1a1a1a',
  textSecondary: '#4a4a4a',
  textMuted: '#6c757d',
  accent: '#ffa500',
  accentRing: 'rgba(255, 165, 0, 0.1)',
  shadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
};

// CSS Variables 기반 palette
export const palette = {
  bgPage: 'var(--bg-page, #0b0f17)',
  bgContainer: 'var(--bg-container, #121212)',
  card: 'var(--card, rgba(20, 24, 34, 0.9))',
  input: 'var(--input, rgba(8, 12, 20, 0.9))',
  border: 'var(--border, rgba(255, 255, 255, 0.06))',
  borderSoft: 'var(--border-soft, rgba(255, 255, 255, 0.08))',
  textPrimary: 'var(--text-primary, #e6e8ee)',
  textSecondary: 'var(--text-secondary, #cfd6e4)',
  textMuted: 'var(--text-muted, #9aa6bf)',
  accent: 'var(--accent, #ffd700)',
  accentRing: 'var(--accent-ring, rgba(255, 215, 0, 0.1))',
  shadow: 'var(--shadow, 0 8px 24px rgba(0, 0, 0, 0.25))',
};
