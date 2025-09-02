'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { palette } from '@/styles/palette';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNickname: string;
  onNicknameUpdate: (newNickname: string) => Promise<boolean>;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
  padding: 1rem;
`;

const ModalContainer = styled.div<{ $isOpen: boolean }>`
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 480px;
  box-shadow: ${palette.shadow};
  transform: ${(props) =>
    props.$isOpen ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)'};
  transition: all 0.3s ease;
  position: relative;

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
    border-radius: 16px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${palette.textPrimary};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${palette.textMuted};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${palette.input};
    color: ${palette.textPrimary};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${palette.textSecondary};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid ${palette.border};
  border-radius: 12px;
  background: ${palette.input};
  color: ${palette.textPrimary};
  font-size: 1rem;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${palette.accent};
    box-shadow: 0 0 0 3px ${palette.accentRing};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${palette.textMuted};
  }
`;

const CharacterCount = styled.div<{ $isOverLimit: boolean }>`
  font-size: 0.8rem;
  color: ${(props) => (props.$isOverLimit ? '#ef4444' : palette.textMuted)};
  text-align: right;
  margin-top: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    margin-top: 1.5rem;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 100px;
  position: relative;

  ${(props) =>
    props.$variant === 'primary'
      ? `
    background: ${palette.accent};
    color: white;
    
    &:hover:not(:disabled) {
      background: #e6c200;
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `
      : `
    background: ${palette.input};
    color: ${palette.textSecondary};
    border: 1px solid ${palette.border};
    
    &:hover:not(:disabled) {
      background: ${palette.border};
      color: ${palette.textPrimary};
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    min-width: unset;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 6px;
  border-left: 3px solid #ef4444;
`;

const SuccessMessage = styled.div`
  color: #22c55e;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 6px;
  border-left: 3px solid #22c55e;
`;

export default function EditProfileModal({
  isOpen,
  onClose,
  currentNickname,
  onNicknameUpdate,
}: EditProfileModalProps) {
  const [nickname, setNickname] = useState(currentNickname);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const MAX_NICKNAME_LENGTH = 20;
  const MIN_NICKNAME_LENGTH = 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nickname.trim().length < MIN_NICKNAME_LENGTH) {
      setError(`닉네임은 최소 ${MIN_NICKNAME_LENGTH}자 이상이어야 합니다.`);
      return;
    }

    if (nickname.trim().length > MAX_NICKNAME_LENGTH) {
      setError(
        `닉네임은 최대 ${MAX_NICKNAME_LENGTH}자까지 입력할 수 있습니다.`
      );
      return;
    }

    if (nickname.trim() === currentNickname) {
      setError('현재 닉네임과 동일합니다.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const success = await onNicknameUpdate(nickname.trim());
      if (success) {
        setSuccess('닉네임이 성공적으로 변경되었습니다!');
        setTimeout(() => {
          onClose();
          setSuccess('');
        }, 1500);
      } else {
        setError('닉네임 변경에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      setError('닉네임 변경 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setNickname(currentNickname);
    setError('');
    setSuccess('');
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const isOverLimit = nickname.length > MAX_NICKNAME_LENGTH;
  const isValid =
    nickname.trim().length >= MIN_NICKNAME_LENGTH &&
    nickname.trim().length <= MAX_NICKNAME_LENGTH &&
    nickname.trim() !== currentNickname;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer $isOpen={isOpen}>
        <ModalHeader>
          <ModalTitle>닉네임 변경</ModalTitle>
          <CloseButton onClick={handleClose} disabled={isLoading}>
            ✕
          </CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="nickname">새 닉네임</Label>
            <Input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError('');
                setSuccess('');
              }}
              placeholder="새로운 닉네임을 입력해주세요"
              disabled={isLoading}
              maxLength={MAX_NICKNAME_LENGTH + 5} // 약간의 여유를 둠
            />
            <CharacterCount $isOverLimit={isOverLimit}>
              {nickname.length}/{MAX_NICKNAME_LENGTH}
            </CharacterCount>
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <ButtonGroup>
            <Button type="button" onClick={handleClose} disabled={isLoading}>
              취소
            </Button>
            <Button
              type="submit"
              $variant="primary"
              disabled={!isValid || isLoading}
            >
              {isLoading && <LoadingSpinner />}
              {isLoading ? '변경 중...' : '변경하기'}
            </Button>
          </ButtonGroup>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
}
