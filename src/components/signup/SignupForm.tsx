import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { signupDataFetch } from './server/signupDataFetch';

interface SignupFormProps {
  setIsLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const StyledButton = styled.button<{ $isDisabled: boolean }>`
  background-color: ${(props) => (props.$isDisabled ? '#cccccc' : '#007bff')};
  color: ${(props) => (props.$isDisabled ? '#666666' : '#ffffff')};
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.$isDisabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => (props.$isDisabled ? '#cccccc' : '#0056b3')};
  }

  &:disabled {
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed;
  }
`;

interface verifyCodeResponse {
  isVerified: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({ setIsLoginForm }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const [isEmailVerifying, setIsEmailVerifying] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  const [verifyCode, setVerifyCode] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const verifyEmailUrl = process.env.NEXT_PUBLIC_VERIFY_EMAIL_URL;
  const sendVerificationCodeEmailUrl =
    process.env.NEXT_PUBLIC_SEND_VERIFICATION_CODE_EMAIL_URL;

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
  }, [username, email, password, confirmPassword]);

  const validateForm = () => {
    const isValid =
      username.trim() !== '' &&
      email.trim() !== '' &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      password === confirmPassword &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      isVerified;

    setIsFormValid(isValid);
  };

  const handleEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('유효한 이메일을 입력해주세요.');
      return;
    }

    const requestInit: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    };

    try {
      const response = await fetch(sendVerificationCodeEmailUrl, requestInit);

      setIsEmailVerifying(true);
      setRemainingTime(300); // 5분
    } catch (error) {
      alert('이메일 인증 요청 중 오류 발생');
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(verifyEmailUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          verifyCode,
        }),
      });

      if (response.ok) {
        const verified: verifyCodeResponse = await response.json();
        if (verified.isVerified) {
          setIsVerified(true);
          setIsEmailVerifying(false);
          alert('이메일 인증이 완료되었습니다.');
        } else {
          alert('인증번호가 일치하지 않습니다.');
        }
      } else {
        alert('인증확인중 오류 발생');
      }
    } catch (error) {
      alert('인증 확인 중 오류가 발생했습니다.');
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
    <>
      <h1>회원가입</h1>
      <form onSubmit={handleSignup}>
        <div>
          <label>사용자 이름</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>이메일</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              required
            />
            <StyledButton
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
            </StyledButton>
          </div>
          {isEmailVerifying && (
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="인증번호 6자리 입력"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                maxLength={6}
              />
              <StyledButton
                type="button"
                onClick={handleVerifyCode}
                $isDisabled={!verifyCode}
                disabled={!verifyCode}
              >
                확인
              </StyledButton>
            </div>
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
          />
          {password !== confirmPassword && (
            <span style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</span>
          )}
        </div>
        <StyledButton
          type="submit"
          $isDisabled={!isFormValid}
          disabled={!isFormValid}
        >
          가입하기
        </StyledButton>
      </form>
      <p>이미 계정이 있으신가요?</p>
      <button onClick={() => setIsLoginForm(true)}>로그인으로 돌아가기</button>
    </>
  );
};

export default SignupForm;
