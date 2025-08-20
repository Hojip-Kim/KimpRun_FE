'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FormContainer, LoginButton } from '@/components/login/style';
import { signupDataFetch } from './server/signupDataFetch';
import { clientEnv } from '@/utils/env';
import {
  emailValidation,
  emailVerification,
  signupValidation,
  verifyEmail,
} from './client/client';

interface SignupFormProps {
  setIsLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
  hideInlineTitle?: boolean;
  hideBackToLogin?: boolean;
}

const InlineActionButton = styled.button<{ $isDisabled?: boolean }>`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, #1e1e1e, #171b24);
  color: ${(props) => (props.$isDisabled ? '#8b93a7' : '#e6e8ee')};
  cursor: ${(props) => (props.$isDisabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s ease, color 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: ${(props) => (props.$isDisabled ? '#8b93a7' : 'rgba(255, 215, 0)')};
    background-color: #131722;
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

  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const verifyEmailUrl = clientEnv.VERIFY_EMAIL_URL;
  const sendVerificationCodeEmailUrl =
    clientEnv.SEND_VERIFICATION_CODE_EMAIL_URL;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const responseJson = await signupDataFetch(username, email, password);
    if (responseJson) {
      alert(
        '회원가입 성공! \n' + '환영합니다. ' + responseJson.nickname + '님'
      );
    }
    setIsLoginForm(true);
  };

  useEffect(() => {
    validateForm();
  }, [username, email, password, confirmPassword, isVerified]);

  const validateForm = () => {
    const isValid = signupValidation(
      username,
      email,
      password,
      confirmPassword,
      isVerified
    );

    isValid ? setIsFormValid(true) : setIsFormValid(false);
  };

  const handleEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailValidation(email)) {
      alert('유효한 이메일을 입력해주세요.');
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
        alert('이메일 인증이 완료되었습니다.');
      } else {
        alert('인증번호가 일치하지 않습니다.');
      }
    } catch (error) {
      alert('인증확인중 오류 발생');
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
        <LoginButton type="submit" disabled={!isFormValid}>
          가입하기
        </LoginButton>
      </form>
      {!hideBackToLogin && (
        <>
          <p>이미 계정이 있으신가요?</p>
          <button onClick={() => setIsLoginForm(true)}>로그인으로 돌아가기</button>
        </>
      )}
    </FormContainer>
  );
};

export default SignupForm;
