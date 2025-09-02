import styled from 'styled-components';
import { palette } from '@/styles/palette';

export const FooterContainer = styled.footer`
  background: var(--card);
  color: var(--text-secondary);
  padding: 20px 20px 12px;
  margin-top: auto;
  border-top: 1px solid var(--border);
  width: 100%;
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;

  @media (max-width: 768px) {
    padding: 16px 16px 80px;
  }

  @media (max-width: 480px) {
    padding: 12px 12px 80px;
  }
`;

export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 32px;
  align-items: flex-start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    text-align: center;
  }

  @media (max-width: 480px) {
    gap: 16px;
  }
`;

export const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const FooterMainSection = styled.div`
  flex: 1;
`;

export const FooterLinksSection = styled.div`
  display: contents; /* Grid를 사용하므로 contents로 변경 */
`;

export const FooterTitle = styled.h3`
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  margin-top: 0;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 10px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

export const FooterCompanyTitle = styled.h3`
  color: var(--accent);
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px 0;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 6px;
  }

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

export const FooterDescription = styled.p`
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.5;
  margin: 0 0 12px 0;
  max-width: 320px;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    max-width: none;
    font-size: 11px;
    margin-bottom: 8px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

export const FooterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (max-width: 768px) {
    gap: 5px;
  }
`;

export const FooterListItem = styled.li`
  font-size: 12px;
  line-height: 1.4;
  color: var(--text-muted);
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 11px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

export const FooterLink = styled.a`
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 12px;
  display: inline-block;
  padding: 1px 0;

  &:hover {
    color: var(--accent);
    transform: translateX(2px);
  }

  @media (max-width: 768px) {
    font-size: 11px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

export const FooterEmail = styled.a`
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  font-size: 12px;
  transition: all 0.3s ease;
  display: inline-block;
  padding: 2px 0;

  &:hover {
    color: var(--accent);
    opacity: 0.8;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    font-size: 11px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

export const FooterCopyright = styled.div`
  text-align: center;
  font-size: 10px;
  color: var(--text-muted);
  max-width: 1200px;
  margin: 16px auto 0;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  line-height: 1.3;
  transition: color 0.3s ease, border-color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 9px;
    padding-top: 10px;
    margin-top: 12px;
  }

  @media (max-width: 480px) {
    font-size: 9px;
    padding-top: 8px;
    margin-top: 10px;
  }
`;
