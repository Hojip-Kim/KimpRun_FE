'use client';

import React from 'react';
import styled from 'styled-components';

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
  background: radial-gradient(
      1200px 800px at 20% -10%,
      #1b2230 0%,
      transparent 60%
    ),
    radial-gradient(1000px 600px at 110% 10%, #121826 0%, transparent 60%),
    linear-gradient(180deg, #0b0f17 0%, #0a0e14 100%);

  @media (max-width: 768px) {
    min-height: calc(100vh - 72px - 72px);
    padding: 24px 12px;
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 480px;
  background: rgba(20, 24, 34, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;

  & > * {
    width: 100%;
  }

  h1 {
    color: #e6e8ee;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 0.2px;
    margin: 0 0 8px;
    text-align: center;
  }
  p.subtitle {
    color: #a6b0c3;
    font-size: 13px;
    text-align: center;
    margin: 0 0 18px;
  }

  form {
    display: grid;
    gap: 12px;
    width: 100%;
  }
  label {
    color: #cfd6e4;
    font-size: 12px;
    margin-bottom: 6px;
    display: block;
  }
  input[type='text'],
  input[type='email'],
  input[type='password'] {
    width: 100%;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(8, 12, 20, 0.9);
    color: #e9eef9;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    -webkit-text-fill-color: #e9eef9 !important;
    -webkit-box-shadow: 0 0 0px 1000px rgba(8, 12, 20, 0.9) inset !important;
    box-shadow: 0 0 0px 1000px rgba(8, 12, 20, 0.9) inset !important;
    caret-color: #e9eef9;
    border: 1px solid rgba(255, 255, 255, 0.12);
  }
  input::placeholder {
    color: #7b87a3;
  }
  input:focus {
    border-color: rgba(255, 215, 0, 0.45);
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  }
`;

const Footer = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: center;
  gap: 8px;
  color: #9aa6bf;
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
