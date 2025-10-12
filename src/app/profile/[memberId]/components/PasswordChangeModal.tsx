'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { palette } from '@/styles/palette';
import { useGlobalAlert } from '@/providers/AlertProvider';
import { clientRequest } from '@/server/fetch';
import { clientEnv } from '@/utils/env';
import { useRouter } from 'next/navigation';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PasswordVerifyResponse {
  isVerify: boolean;
}

interface PasswordChangeResponse {
  isCompleted: boolean;
}

type PasswordChangeStep = 'verify' | 'change';

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  padding: 1rem;
  
  @media (max-height: 700px) {
    align-items: flex-start;
    padding-top: 2rem;
  }
`;

const ModalContainer = styled.div`
  background: ${palette.card};
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid ${palette.border};
  margin: auto;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 12px;
    max-height: calc(100vh - 1rem);
  }

  @media (max-height: 600px) {
    max-height: calc(100vh - 1rem);
    padding: 1rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${palette.textSecondary};
  padding: 0.5rem;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${palette.bgContainer};
    color: ${palette.textPrimary};
  }
`;

const StepContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const StepContent = styled.div<{
  $step: PasswordChangeStep;
  $currentStep: PasswordChangeStep;
}>`
  transform: translateX(
    ${({ $step, $currentStep }) =>
      $step === 'verify' && $currentStep === 'verify'
        ? '0'
        : $step === 'verify' && $currentStep === 'change'
        ? '-100%'
        : $step === 'change' && $currentStep === 'verify'
        ? '100%'
        : '0'}
  );
  transition: transform 0.3s ease-in-out;
  width: 100%;

  ${({ $step, $currentStep }) =>
    $step !== $currentStep && 'position: absolute; top: 0; left: 0;'}
`;

const Title = styled.h2`
  color: ${palette.textPrimary};
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${palette.textSecondary};
  font-size: 0.875rem;
  font-weight: 500;
`;

const Input = styled.input`
  background: ${palette.input};
  border: 1px solid ${palette.border};
  border-radius: 6px;
  padding: 0.75rem;
  color: ${palette.textPrimary};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${palette.accent};
    box-shadow: 0 0 0 3px ${palette.accentRing};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  background: ${({ $variant }) =>
    $variant === 'secondary' ? palette.bgContainer : palette.accent};
  color: ${({ $variant }) =>
    $variant === 'secondary' ? palette.textPrimary : '#000'};
  border: 1px solid
    ${({ $variant }) =>
      $variant === 'secondary' ? palette.border : palette.accent};
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const PasswordRequirement = styled.div`
  font-size: 0.75rem;
  color: ${palette.textMuted};
  margin-top: 0.5rem;
  line-height: 1.4;
`;

const ForgotPasswordSection = styled.div`
  text-align: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${palette.border};
`;

const ForgotPasswordText = styled.p`
  font-size: 0.875rem;
  color: ${palette.textSecondary};
  margin-bottom: 0.75rem;
`;

const ForgotPasswordButton = styled.button`
  background: none;
  border: none;
  color: ${palette.accent};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  transition: all 0.2s ease;

  &:hover {
    color: ${palette.textPrimary};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// 비밀번호 유효성 검사 함수 (ResetPasswordForm과 동일)
const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return '비밀번호는 최소 8자 이상이어야 합니다.';
  }

  // 숫자 포함 검사
  if (!/\d/.test(password)) {
    return '비밀번호에 숫자를 최소 1개 포함해야 합니다.';
  }

  // 특수문자 포함 검사
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return '비밀번호에 특수문자를 최소 1개 포함해야 합니다.';
  }

  return null;
};

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState<PasswordChangeStep>('verify');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { showSuccess, showError } = useGlobalAlert();
  const router = useRouter();

  const handleClose = () => {
    setCurrentStep('verify');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  // 1단계: 현재 비밀번호 확인
  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword.trim()) {
      showError('현재 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const baseUrl = clientEnv.API_BASE_URL;
      const response = await clientRequest.post<PasswordVerifyResponse>(
        `${baseUrl}/user/password/verify`,
        { currentPassword }
      );

      if (response.success && response.data?.isVerify) {
        showSuccess('비밀번호 확인이 완료되었습니다.');
        setCurrentStep('change');
      } else {
        showError('현재 비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('비밀번호 확인 오류:', error);
      showError('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2단계: 새 비밀번호 설정
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      showError('새 비밀번호를 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showError('비밀번호가 일치하지 않습니다.');
      return;
    }

    const validationError = validatePassword(newPassword);
    if (validationError) {
      showError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const baseUrl = clientEnv.API_BASE_URL;
      const response = await clientRequest.patch<PasswordChangeResponse>(
        `${baseUrl}/user/password/change`,
        {
          currentPassword,
          newPassword,
        }
      );

      if (response.success && response.data?.isCompleted) {
        showSuccess('비밀번호가 성공적으로 변경되었습니다.');
        handleClose();
      } else {
        showError('비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      showError('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    handleClose();
    router.push('/reset-password');
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>×</CloseButton>

        <StepContainer>
          {/* 1단계: 현재 비밀번호 확인 */}
          <StepContent $step="verify" $currentStep={currentStep}>
            <Title>비밀번호 확인</Title>
            <Form onSubmit={handleVerifyPassword}>
              <FormGroup>
                <Label htmlFor="currentPassword">현재 비밀번호</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="현재 비밀번호를 입력하세요"
                  disabled={isLoading}
                />
              </FormGroup>

              <ButtonGroup>
                <Button
                  type="button"
                  $variant="secondary"
                  onClick={handleClose}
                >
                  취소
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? '확인 중...' : '확인'}
                </Button>
              </ButtonGroup>
            </Form>
            
            <ForgotPasswordSection>
              <ForgotPasswordText>비밀번호를 잊어버리셨나요?</ForgotPasswordText>
              <ForgotPasswordButton onClick={handleForgotPassword}>
                비밀번호 재설정 페이지로 이동
              </ForgotPasswordButton>
            </ForgotPasswordSection>
          </StepContent>

          {/* 2단계: 새 비밀번호 설정 */}
          <StepContent $step="change" $currentStep={currentStep}>
            <Title>새 비밀번호 설정</Title>
            <Form onSubmit={handleChangePassword}>
              <FormGroup>
                <Label htmlFor="newPassword">새 비밀번호</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호를 입력하세요"
                  disabled={isLoading}
                />
                <PasswordRequirement>
                  비밀번호는 최소 8자 이상이며, 숫자와 특수문자를 각각 1개 이상
                  포함해야 합니다.
                </PasswordRequirement>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력하세요"
                  disabled={isLoading}
                />
              </FormGroup>

              <ButtonGroup>
                <Button
                  type="button"
                  $variant="secondary"
                  onClick={() => setCurrentStep('verify')}
                >
                  이전
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? '변경 중...' : '변경하기'}
                </Button>
              </ButtonGroup>
            </Form>
          </StepContent>
        </StepContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default PasswordChangeModal;
