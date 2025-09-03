'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { palette } from '@/styles/palette';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  confirmText?: string;
  onConfirm?: () => void;
  cancelText?: string;
  onCancel?: () => void;
}

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? 'visible' : 'hidden')};
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 1rem;
`;

const ModalContainer = styled.div<{ $isOpen: boolean; $type: string }>`
  background: ${palette.card};
  border: none;
  border-radius: 20px;
  padding: 0;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: ${(props) => (props.$isOpen ? scaleIn : 'none')} 0.4s
    cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    margin: 1rem;
    border-radius: 16px;
    max-width: calc(100vw - 2rem);
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem 2rem 0 2rem;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1.5rem 0 1.5rem;
    margin-bottom: 0.25rem;
  }
`;

const ModalIcon = styled.div<{ $type: string }>`
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  flex-shrink: 0;
  position: relative;

  ${(props) => {
    switch (props.$type) {
      case 'success':
        return `
          background: linear-gradient(135deg, #10b981, #22c55e);
          color: white;
          box-shadow: 0 8px 25px -8px rgba(34, 197, 94, 0.4);
        `;
      case 'warning':
        return `
          background: linear-gradient(135deg, #f59e0b, #fbbf24);
          color: white;
          box-shadow: 0 8px 25px -8px rgba(245, 158, 11, 0.4);
        `;
      case 'error':
        return `
          background: linear-gradient(135deg, #ef4444, #f87171);
          color: white;
          box-shadow: 0 8px 25px -8px rgba(239, 68, 68, 0.4);
        `;
      default:
        return `
          background: linear-gradient(135deg, ${palette.accent}, #fbbf24);
          color: ${palette.bgPage};
          box-shadow: 0 8px 25px -8px rgba(255, 215, 0, 0.4);
        `;
    }
  }}
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${palette.textPrimary};
  margin: 0;
  flex: 1;
  letter-spacing: -0.025em;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const ModalMessage = styled.div`
  color: ${palette.textSecondary};
  line-height: 1.7;
  padding: 0 2rem;
  margin-bottom: 2rem;
  font-size: 1rem;
  font-weight: 400;

  @media (max-width: 768px) {
    padding: 0 1.5rem;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 0 2rem 2rem 2rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem 1.5rem 1.5rem;
    flex-direction: column-reverse;
    gap: 0.75rem;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: none;
  min-width: 100px;
  position: relative;
  overflow: hidden;

  ${(props) =>
    props.$variant === 'primary'
      ? `
    background: linear-gradient(135deg, ${palette.accent}, #fbbf24);
    color: ${palette.bgPage};
    box-shadow: 0 4px 15px -4px rgba(255, 215, 0, 0.4);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px -8px rgba(255, 215, 0, 0.5);
    }
    
    &:active {
      transform: translateY(0);
    }
  `
      : `
    background: ${palette.input};
    color: ${palette.textSecondary};
    border: 1px solid ${palette.borderSoft};
    
    &:hover {
      background: ${palette.border};
      color: ${palette.textPrimary};
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}

  @media (max-width: 768px) {
    padding: 1rem;
    min-width: unset;
    font-size: 1rem;
  }
`;

export default function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmText = '확인',
  onConfirm,
  cancelText = '취소',
  onCancel,
}: AlertModalProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '!';
      case 'error':
        return '×';
      default:
        return 'i';
    }
  };

  const getTitle = () => {
    if (title) return title;

    switch (type) {
      case 'success':
        return '성공';
      case 'warning':
        return '주의';
      case 'error':
        return '오류';
      default:
        return '알림';
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const showCancel = onCancel || onConfirm;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer $isOpen={isOpen} $type={type}>
        <ModalHeader>
          <ModalIcon $type={type}>{getIcon()}</ModalIcon>
          <ModalTitle>{getTitle()}</ModalTitle>
        </ModalHeader>

        <ModalMessage>{message}</ModalMessage>

        <ButtonGroup>
          {showCancel && <Button onClick={handleCancel}>{cancelText}</Button>}
          <Button $variant="primary" onClick={handleConfirm}>
            {confirmText}
          </Button>
        </ButtonGroup>
      </ModalContainer>
    </ModalOverlay>
  );
}
