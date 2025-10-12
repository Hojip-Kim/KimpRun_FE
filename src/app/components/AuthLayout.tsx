'use client';

import React from 'react';
import styled from 'styled-components';
import { palette } from '@/styles/palette';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footerText?: string;
  footerActionText?: string;
  onFooterAction?: () => void;
}

const Page = styled.div`
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  background: ${palette.bgPage};
  transition: background-color 0.3s ease;

  @media (max-width: 768px) {
    min-height: calc(100vh - 72px - 72px);
    padding: 24px 12px;
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 16px;
  padding: 28px;
  box-shadow: ${palette.shadow};
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease, border-color 0.3s ease,
    box-shadow 0.3s ease;

  & > * {
    width: 100%;
  }

  h1 {
    color: ${palette.textPrimary};
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 0.2px;
    margin: 0 0 8px;
    text-align: center;
    transition: color 0.3s ease;
  }
  p.subtitle {
    color: ${palette.textMuted};
    font-size: 13px;
    text-align: center;
    margin: 0 0 18px;
    transition: color 0.3s ease;
  }

  form {
    display: grid;
    gap: 12px;
    width: 100%;
  }
  label {
    color: ${palette.textSecondary};
    font-size: 12px;
    margin-bottom: 6px;
    display: block;
    transition: color 0.3s ease;
  }
  input[type='text'],
  input[type='email'],
  input[type='password'] {
    width: 100%;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid ${palette.border};
    background: ${palette.input};
    color: ${palette.textPrimary};
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    -webkit-text-fill-color: ${palette.textPrimary} !important;
    -webkit-box-shadow: 0 0 0px 1000px ${palette.input} inset !important;
    box-shadow: 0 0 0px 1000px ${palette.input} inset !important;
    caret-color: ${palette.textPrimary};
    border: 1px solid ${palette.borderSoft};
  }
  input::placeholder {
    color: ${palette.textMuted};
  }
  input:focus {
    border-color: ${palette.accent};
    box-shadow: 0 0 0 3px ${palette.accentRing};
  }
`;

const Footer = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: center;
  gap: 8px;
  color: ${palette.textMuted};
  font-size: 13px;
`;

const LinkBtn = styled.button`
  color: #ffd700;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  font-weight: 600;
  letter-spacing: 0.2px;
  &:hover {
    text-decoration: underline;
  }
`;

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  footerText,
  footerActionText,
  onFooterAction,
}) => {
  return (
    <Page>
      <Card>
        <h1>{title}</h1>
        {subtitle ? <p className="subtitle">{subtitle}</p> : null}
        {children}
        {footerText && footerActionText && onFooterAction && (
          <Footer>
            <span>{footerText}</span>
            <LinkBtn onClick={onFooterAction}>{footerActionText}</LinkBtn>
          </Footer>
        )}
      </Card>
    </Page>
  );
};

export default AuthLayout;
