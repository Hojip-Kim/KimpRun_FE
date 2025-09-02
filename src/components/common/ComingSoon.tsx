'use client';

import React from 'react';
import styled from 'styled-components';
import { palette } from '@/styles/palette';

interface ComingSoonProps {
  title?: string;
  description?: string;
  icon?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  variant?: 'default' | 'embedded'; // 레이아웃 변형
}

const Container = styled.div<{ $variant: 'default' | 'embedded' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: ${(props) => (props.$variant === 'embedded' ? '40vh' : '60vh')};
  padding: 2rem;
  text-align: center;
  background: ${palette.card};
  border-radius: ${(props) => (props.$variant === 'embedded' ? '0' : '16px')};
  margin: ${(props) => (props.$variant === 'embedded' ? '0' : '2rem')};
  box-shadow: ${(props) =>
    props.$variant === 'embedded' ? 'none' : palette.shadow};
  border: ${(props) =>
    props.$variant === 'embedded' ? 'none' : `1px solid ${palette.border}`};
  backdrop-filter: blur(10px);
`;

const IconWrapper = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: bounce 2s infinite;

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${palette.textPrimary};
  margin-bottom: 1rem;
  background: linear-gradient(
    135deg,
    ${palette.accent} 0%,
    ${palette.textSecondary} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: ${palette.textSecondary};
  margin-bottom: 2rem;
  max-width: 500px;
  line-height: 1.6;
`;

const SubText = styled.p`
  font-size: 0.9rem;
  color: ${palette.textMuted};
  margin-top: 1rem;
`;

const BackButton = styled.button`
  margin-top: 2rem;
  padding: 0.75rem 2rem;
  background: ${palette.accent};
  color: ${palette.bgPage};
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${palette.shadow};

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
    box-shadow: 0 6px 20px ${palette.accentRing};
  }

  &:active {
    transform: translateY(0);
  }
`;

const ComingSoon: React.FC<ComingSoonProps> = ({
  title = '준비중입니다',
  description = '더 나은 서비스로 곧 찾아뵙겠습니다.',
  icon = '🚀',
  showBackButton = false,
  onBackClick,
  variant = 'default',
}) => {
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      window.history.back();
    }
  };

  return (
    <Container $variant={variant}>
      <IconWrapper>{icon}</IconWrapper>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <SubText>빠른 시일 내에 서비스를 준비하여 제공하겠습니다.</SubText>
      {showBackButton && (
        <BackButton onClick={handleBackClick}>← 이전 페이지로</BackButton>
      )}
    </Container>
  );
};

export default ComingSoon;
