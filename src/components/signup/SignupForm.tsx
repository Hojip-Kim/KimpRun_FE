'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FormContainer, LoginButton } from '@/components/login/style';
import { signupDataFetch } from './server/signupDataFetch';
import { clientEnv } from '@/utils/env';
import { useGlobalAlert } from '@/providers/AlertProvider';
import {
  emailValidation,
  emailVerification,
  signupValidation,
  verifyEmail,
  validatePassword,
} from './client/client';

interface SignupFormProps {
  setIsLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
  hideInlineTitle?: boolean;
  hideBackToLogin?: boolean;
}

const InlineActionButton = styled.button<{ $isDisabled?: boolean }>`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--input);
  color: ${(props) =>
    props.$isDisabled ? 'var(--text-muted)' : 'var(--text-primary)'};
  cursor: ${(props) => (props.$isDisabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: ${(props) =>
      props.$isDisabled ? 'var(--text-muted)' : 'var(--accent)'};
    background-color: var(--bg-container);
    border-color: var(--accent);
  }

  &:disabled {
    opacity: 0.7;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

interface verifyCodeResponse {
  isVerified: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({
  setIsLoginForm,
  hideInlineTitle = false,
  hideBackToLogin = false,
}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const [isEmailVerifying, setIsEmailVerifying] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  const [verifyCode, setVerifyCode] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const { showError, showSuccess, showWarning } = useGlobalAlert();

  const [termsServiceAgreed, setTermsServiceAgreed] = useState<boolean>(false);
  const [privacyPolicyAgreed, setPrivacyPolicyAgreed] =
    useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [passwordValidationError, setPasswordValidationError] = useState<
    string | null
  >(null);

  const verifyEmailUrl = clientEnv.VERIFY_EMAIL_URL;
  const sendVerificationCodeEmailUrl =
    clientEnv.SEND_VERIFICATION_CODE_EMAIL_URL;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showWarning('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!termsServiceAgreed || !privacyPolicyAgreed) {
      showWarning('서비스 이용약관에 동의해주세요.');
      return;
    }

    const responseJson = await signupDataFetch(username, email, password);
    if (responseJson) {
      showSuccess(
        '회원가입 성공! \n' + '환영합니다. ' + responseJson.nickname + '님'
      );
    }
    setIsLoginForm(true);
  };

  useEffect(() => {
    validateForm();
  }, [
    username,
    email,
    password,
    confirmPassword,
    isVerified,
    termsServiceAgreed,
    privacyPolicyAgreed,
  ]);

  const validateForm = () => {
    const isValid = signupValidation(
      username,
      email,
      password,
      confirmPassword,
      isVerified,
      termsServiceAgreed,
      privacyPolicyAgreed
    );

    isValid ? setIsFormValid(true) : setIsFormValid(false);
  };

  const handleEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailValidation(email)) {
      showWarning('유효한 이메일을 입력해주세요.');
      return;
    }

    setIsEmailVerifying(true);
    setRemainingTime(300); // 5분
    const response = emailVerification(email);
    if (!response) {
      setIsEmailVerifying(false);
      setRemainingTime(0);
      return;
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await verifyEmail(email, verifyCode);
      if (response) {
        setIsVerified(true);
        setIsEmailVerifying(false);
        showSuccess('이메일 인증이 완료되었습니다.');
      } else {
        showError('인증번호가 일치하지 않습니다.');
      }
    } catch (error) {
      showError('인증확인중 오류 발생');
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isEmailVerifying && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      setIsEmailVerifying(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isEmailVerifying, remainingTime]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        // 비밀번호 유효성 검사
        const validationError = validatePassword(value);
        setPasswordValidationError(validationError);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
  };

  return (
    <FormContainer>
      {!hideInlineTitle && <h1>회원가입</h1>}
      <form onSubmit={handleSignup}>
        <div>
          <label>사용자 이름</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleInputChange}
            required
            placeholder="닉네임을 입력하세요"
          />
        </div>
        <div>
          <label>이메일</label>
          <Row>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              required
              placeholder="example@email.com"
            />
            <InlineActionButton
              type="button"
              onClick={handleEmailVerification}
              $isDisabled={isEmailVerifying}
              disabled={isEmailVerifying}
            >
              {isEmailVerifying
                ? `${Math.floor(remainingTime / 60)} : ${(remainingTime % 60)
                    .toString()
                    .padStart(2, '0')}`
                : '인증하기'}
            </InlineActionButton>
          </Row>
          {isEmailVerifying && (
            <Row style={{ marginTop: '10px' }}>
              <input
                type="text"
                placeholder="인증번호 6자리 입력"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                maxLength={6}
              />
              <InlineActionButton
                type="button"
                onClick={handleVerifyCode}
                $isDisabled={!verifyCode}
                disabled={!verifyCode}
              >
                확인
              </InlineActionButton>
            </Row>
          )}
        </div>
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleInputChange}
            required
            placeholder="비밀번호를 입력하세요"
          />
          {passwordValidationError && (
            <span style={{ color: 'red', fontSize: '0.8rem' }}>
              {passwordValidationError}
            </span>
          )}
          {!passwordValidationError && password && (
            <span style={{ color: '#666', fontSize: '0.75rem' }}>
              비밀번호는 최소 8자 이상이며, 숫자와 특수문자를 각각 1개 이상
              포함해야 합니다.
            </span>
          )}
        </div>
        <div>
          <label>비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleInputChange}
            required
            placeholder="비밀번호를 다시 입력하세요"
          />
          {password !== confirmPassword && (
            <span style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</span>
          )}
        </div>

        <div>
          <label>서비스 이용약관 동의</label>

          <div className="remember-row">
            <input
              type="checkbox"
              id="terms-service"
              checked={termsServiceAgreed}
              onChange={(e) => setTermsServiceAgreed(e.target.checked)}
            />
            <label htmlFor="terms-service">
              (필수){' '}
              <a
                href="/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
              >
                서비스 이용약관
              </a>
              에 동의합니다.
            </label>
          </div>

          <div className="remember-row">
            <input
              type="checkbox"
              id="privacy-policy"
              checked={privacyPolicyAgreed}
              onChange={(e) => setPrivacyPolicyAgreed(e.target.checked)}
            />
            <label htmlFor="privacy-policy">
              (필수){' '}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                개인정보 수집 및 이용
              </a>
              에 동의합니다.
            </label>
          </div>
        </div>

        <LoginButton type="submit" disabled={!isFormValid}>
          가입하기
        </LoginButton>
      </form>
      {!hideBackToLogin && (
        <>
          <p>이미 계정이 있으신가요?</p>
          <button onClick={() => setIsLoginForm(true)}>
            로그인으로 돌아가기
          </button>
        </>
      )}
    </FormContainer>
  );
};

export default SignupForm;
