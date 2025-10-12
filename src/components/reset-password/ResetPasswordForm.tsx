'use client';

import React, { useState } from 'react';
import { useGlobalAlert } from '@/providers/AlertProvider';
import { clientRequest } from '@/server/fetch';
import { FormContainer, LoginButton } from '../login/style';
import {
  ResetContainer,
  StepIndicator,
  StepContent,
  VerificationCodeInput,
  SuccessMessage,
} from '@/components/reset-password/style';
import dynamic from 'next/dynamic';
import { clientEnv } from '@/utils/env';

const Modal = dynamic(() => import('@/components/modal/modal'), { ssr: false });

interface ResetPasswordFormProps {
  closeModal: () => void;
}

interface EmailVerificationResponse {
  isExisted: boolean;
  verificationCode?: string;
}

type ResetStep = 'email' | 'verification' | 'password' | 'success';

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  closeModal,
}) => {
  const [currentStep, setCurrentStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [receivedVerificationCode, setReceivedVerificationCode] =
    useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUserNotFoundModalOpen, setIsUserNotFoundModalOpen] =
    useState<boolean>(false);

  const { showSuccess, showError } = useGlobalAlert();

  // 1단계: 이메일 인증 요청
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showError('이메일을 입력해주세요.');
      return;
    }

    // 즉시 인증 단계로 이동
    setCurrentStep('verification');

    setIsLoading(true);
    try {
      const baseUrl = clientEnv.API_BASE_URL;
      console.log('email', email);
      const response = await clientRequest.post<EmailVerificationResponse>(
        `${baseUrl}/user/email`,
        { email }
      );

      if (response.success && response.data) {
        const { isExisted, verificationCode } = response.data;

        if (!isExisted) {
          // 사용자가 존재하지 않는 경우 모달 표시하고 이메일 단계로 돌아가기
          setCurrentStep('email');
          setIsUserNotFoundModalOpen(true);
        } else if (isExisted && verificationCode) {
          // 사용자가 존재하고 인증 코드가 있는 경우
          setReceivedVerificationCode(verificationCode);
        } else {
          setCurrentStep('email');
          showError('인증 코드 생성에 실패했습니다.');
        }
      } else {
        setCurrentStep('email');
        showError('이메일 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('이메일 인증 요청 오류:', error);
      setCurrentStep('email');
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

    // 로컬 검증 - 받은 인증코드와 비교
    if (verificationCode !== receivedVerificationCode) {
      showError('인증 코드가 올바르지 않습니다.');
      return;
    }

    setIsLoading(true);
    try {
      const baseUrl = clientEnv.API_BASE_URL;
      const response = await clientRequest.post(
        `${baseUrl}/user/email/verify`,
        {
          email,
          verificationCode,
        }
      );

      if (response.success) {
        showSuccess('인증이 완료되었습니다.');
        setCurrentStep('password');
      } else {
        showError('인증 코드가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('인증 코드 확인 오류:', error);
      showError('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 유효성 검사 함수
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

    const validationError = validatePassword(newPassword);
    if (validationError) {
      showError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const baseUrl = clientEnv.API_BASE_URL;
      const response = await clientRequest.patch(
        `${baseUrl}/user/password`,
        {
          email,
          password: newPassword,
        },
        {
          credentials: 'include',
        }
      );

      if (response.success) {
        showSuccess('비밀번호가 성공적으로 변경되었습니다.');
        setCurrentStep('success');
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

      {/* 사용자 없음 모달 */}
      {isUserNotFoundModalOpen && (
        <Modal
          width={400}
          height={200}
          element={
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>
                계정을 찾을 수 없습니다
              </h3>
              <p
                style={{
                  marginBottom: '1.5rem',
                  lineHeight: '1.5',
                  color: '#666',
                }}
              >
                입력하신 이메일 주소로 등록된 계정이 존재하지 않습니다.
                <br />
                이메일 주소를 다시 확인하거나 새로 회원가입을 해주세요.
              </p>
              <LoginButton
                onClick={() => setIsUserNotFoundModalOpen(false)}
                style={{ width: '100%' }}
              >
                확인
              </LoginButton>
            </div>
          }
          setModal={setIsUserNotFoundModalOpen}
        />
      )}
    </ResetContainer>
  );
};

export default ResetPasswordForm;
