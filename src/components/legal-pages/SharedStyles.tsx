import styled from 'styled-components';
import { palette } from '@/styles/palette';

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 24px 80px;
  line-height: 1.6;
  color: ${palette.textSecondary};
  background: ${palette.bgPage};
  min-height: calc(100vh - 400px);

  @media (max-width: 768px) {
    padding: 40px 20px 60px;
    max-width: 100%;
  }
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 60px;
  position: relative;

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

export const Title = styled.h1`
  color: ${palette.textPrimary};
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
  background: linear-gradient(
    135deg,
    ${palette.textPrimary},
    ${palette.accent}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 12px;
  }
`;

export const Subtitle = styled.p`
  color: ${palette.textMuted};
  font-size: 18px;
  margin-bottom: 24px;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 20px;
  }
`;

export const Divider = styled.div`
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, ${palette.accent}, transparent);
  margin: 0 auto;
  border-radius: 2px;
`;

export const ContentGrid = styled.div`
  display: grid;
  gap: 40px;

  @media (max-width: 768px) {
    gap: 32px;
  }
`;

export const Section = styled.section`
  background: ${palette.card};
  border-radius: 16px;
  padding: 32px;
  border: 1px solid ${palette.border};
  box-shadow: ${palette.shadow};
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 12px;
  }
`;

export const SectionTitle = styled.h2`
  color: ${palette.accent};
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.01em;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background: ${palette.accent};
    border-radius: 50%;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 16px;
    gap: 10px;

    &::before {
      width: 5px;
      height: 5px;
    }
  }
`;

export const Paragraph = styled.p`
  margin-bottom: 20px;
  color: ${palette.textSecondary};
  line-height: 1.7;
  font-size: 16px;
  letter-spacing: -0.01em;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    font-size: 15px;
    line-height: 1.6;
    margin-bottom: 16px;
  }
`;

export const HighlightBox = styled.div`
  background: var(--accent-ring);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  margin: 32px 0;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 5px;
    background: var(--accent);
  }

  &::after {
    content: '⚠️';
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 24px;
    opacity: 0.3;
  }

  @media (max-width: 768px) {
    padding: 20px;
    margin: 24px 0;

    &::after {
      font-size: 20px;
      top: 16px;
      right: 16px;
    }
  }
`;

export const HighlightTitle = styled.h3`
  color: ${palette.accent};
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 10px;
  }
`;

export const HighlightText = styled.p`
  color: ${palette.textPrimary};
  line-height: 1.6;
  font-weight: 500;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

export const List = styled.ul`
  margin: 20px 0;
  padding: 0;
  display: grid;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 10px;
    margin: 16px 0;
  }
`;

export const ListItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: ${palette.textSecondary};
  line-height: 1.6;
  font-size: 16px;
  list-style: none;

  &::before {
    content: '→';
    color: ${palette.accent};
    font-weight: bold;
    flex-shrink: 0;
    margin-top: 2px;
  }

  strong {
    color: ${palette.accent};
    font-weight: 600;
  }

  @media (max-width: 768px) {
    font-size: 15px;
    gap: 10px;
  }
`;

export const InfoCard = styled.div`
  background: var(--bg-container);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin: 24px 0;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  @media (max-width: 768px) {
    padding: 16px;
    margin: 20px 0;
    gap: 12px;
    flex-direction: column;
    text-align: center;
  }
`;

export const InfoIcon = styled.div`
  width: 48px;
  height: 48px;
  background: var(--accent);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
`;

export const InfoContent = styled.div`
  flex: 1;

  h4 {
    color: ${palette.textPrimary};
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 8px 0;

    @media (max-width: 768px) {
      font-size: 16px;
      margin: 0 0 6px 0;
    }
  }

  p {
    color: ${palette.textMuted};
    margin: 0;
    line-height: 1.5;

    @media (max-width: 768px) {
      font-size: 14px;
    }
  }
`;

export const Footer = styled.footer`
  margin-top: 60px;
  text-align: center;
  padding: 32px;
  background: ${palette.card};
  border-radius: 16px;
  border: 1px solid ${palette.border};

  @media (max-width: 768px) {
    margin-top: 40px;
    padding: 24px;
    border-radius: 12px;
  }
`;

export const FooterText = styled.p`
  color: ${palette.textMuted};
  font-size: 14px;
  margin: 0;
  line-height: 1.5;

  strong {
    color: ${palette.accent};
    font-weight: 600;
  }
`;
