'use client';

import React, { useState } from 'react';
import { useGlobalAlert } from '@/providers/AlertProvider';
import { clientEnv } from '@/utils/env';
import { FormContainer, LoginButton } from '../login/style';
import {
  ResetContainer,
  StepIndicator,
  StepContent,
  VerificationCodeInput,
  SuccessMessage,
} from '@/components/reset-password/style';

interface ResetPasswordFormProps {
  closeModal: () => void;
}

type ResetStep = 'email' | 'verification' | 'password' | 'success';

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  closeModal,
}) => {
  const [currentStep, setCurrentStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { showSuccess, showError } = useGlobalAlert();

  // 1단계: 이메일 인증 요청
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showError('이메일을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${clientEnv.API_BASE_URL}/user/password/reset-request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        showSuccess('인증 코드가 이메일로 전송되었습니다.');
        setCurrentStep('verification');
      } else {
        const errorData = await response.json();
        showError(errorData.message || '이메일 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('이메일 인증 요청 오류:', error);
      showError('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2단계: 인증 코드 확인
  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode.trim()) {
      showError('인증 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${clientEnv.API_BASE_URL}/user/password/verify-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            verificationCode,
          }),
        }
      );

      if (response.ok) {
        showSuccess('인증이 완료되었습니다.');
        setCurrentStep('password');
      } else {
        const errorData = await response.json();
        showError(errorData.message || '인증 코드가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('인증 코드 확인 오류:', error);
      showError('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3단계: 새 비밀번호 설정
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      showError('새 비밀번호를 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 8) {
      showError('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${clientEnv.API_BASE_URL}/user/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: newPassword,
        }),
      });

      if (response.ok) {
        showSuccess('비밀번호가 성공적으로 변경되었습니다.');
        setCurrentStep('success');
      } else {
        const errorData = await response.json();
        showError(errorData.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      showError('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'email':
        return (
          <StepContent>
            <h2>이메일 주소 입력</h2>
            <p>가입하신 이메일 주소를 입력하면 인증 코드를 전송해드립니다.</p>
            <form onSubmit={handleEmailSubmit}>
              <div>
                <label>이메일 주소</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                />
              </div>
              <LoginButton type="submit" disabled={isLoading}>
                {isLoading ? '전송 중...' : '인증 코드 전송'}
              </LoginButton>
            </form>
          </StepContent>
        );

      case 'verification':
        return (
          <StepContent>
            <h2>이메일 인증</h2>
            <p>{email}로 전송된 인증 코드를 입력해주세요.</p>
            <form onSubmit={handleVerificationSubmit}>
              <div>
                <label>인증 코드</label>
                <VerificationCodeInput
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="6자리 인증 코드"
                  maxLength={6}
                  required
                />
              </div>
              <LoginButton type="submit" disabled={isLoading}>
                {isLoading ? '확인 중...' : '인증 확인'}
              </LoginButton>
              <button
                type="button"
                className="back-btn"
                onClick={() => setCurrentStep('email')}
              >
                이메일 다시 입력
              </button>
            </form>
          </StepContent>
        );

      case 'password':
        return (
          <StepContent>
            <h2>새 비밀번호 설정</h2>
            <p>새로운 비밀번호를 입력해주세요.</p>
            <form onSubmit={handlePasswordSubmit}>
              <div>
                <label>새 비밀번호</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="최소 8자 이상"
                  minLength={8}
                  required
                />
              </div>
              <div>
                <label>비밀번호 확인</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력"
                  minLength={8}
                  required
                />
              </div>
              <LoginButton type="submit" disabled={isLoading}>
                {isLoading ? '변경 중...' : '비밀번호 변경'}
              </LoginButton>
            </form>
          </StepContent>
        );

      case 'success':
        return (
          <StepContent>
            <SuccessMessage>
              <div className="success-icon">✅</div>
              <h2>비밀번호 변경 완료</h2>
              <p>비밀번호가 성공적으로 변경되었습니다.</p>
              <LoginButton onClick={() => (window.location.href = '/login')}>
                로그인 페이지로 이동
              </LoginButton>
            </SuccessMessage>
          </StepContent>
        );

      default:
        return null;
    }
  };

  return (
    <ResetContainer>
      <StepIndicator>
        <div
          className={`step ${
            currentStep === 'email'
              ? 'active'
              : currentStep === 'verification' ||
                currentStep === 'password' ||
                currentStep === 'success'
              ? 'completed'
              : ''
          }`}
        >
          <span>1</span>
          <label>이메일</label>
        </div>
        <div
          className={`step ${
            currentStep === 'verification'
              ? 'active'
              : currentStep === 'password' || currentStep === 'success'
              ? 'completed'
              : ''
          }`}
        >
          <span>2</span>
          <label>인증</label>
        </div>
        <div
          className={`step ${
            currentStep === 'password'
              ? 'active'
              : currentStep === 'success'
              ? 'completed'
              : ''
          }`}
        >
          <span>3</span>
          <label>비밀번호</label>
        </div>
      </StepIndicator>

      <FormContainer>{renderStepContent()}</FormContainer>
    </ResetContainer>
  );
};

export default ResetPasswordForm;
