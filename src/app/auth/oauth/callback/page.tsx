'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setIsAuthenticated, setUser } from '@/redux/reducer/authReducer';
import { fetchUserInfo } from '@/components/auth/fetchUserInfo';
import TermsAgreement from '@/components/signup/TermsAgreement';
import styled from 'styled-components';
import { LoginButton } from '@/components/login/style';
import { useGlobalAlert } from '@/providers/AlertProvider';

const CallbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: var(--bg-page);
`;

const CallbackCard = styled.div`
  background: var(--bg-container);
  border-radius: 12px;
  padding: 32px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  max-width: 500px;
  width: 100%;
`;

const Title = styled.h1`
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 16px;
  font-size: 24px;
`;

const Description = styled.p`
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 24px;
  line-height: 1.5;
`;

const LoadingSpinner = styled.div`
  border: 3px solid var(--border);
  border-top: 3px solid var(--accent);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const SecondaryButton = styled(LoginButton)`
  background: var(--bg-container);
  color: var(--text-primary);
  border: 1px solid var(--border);

  &:hover {
    background: var(--input);
  }
`;

const OAuthCallbackPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { showWarning } = useGlobalAlert();

  const [status, setStatus] = useState<
    'loading' | 'needs_agreement' | 'success' | 'error'
  >('loading');
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      // URL 파라미터에서 OAuth 결과 확인
      const success = searchParams.get('success');
      const newUser = searchParams.get('newUser'); // 신규 사용자인지 확인
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setErrorMessage('OAuth 로그인 중 오류가 발생했습니다.');
        return;
      }

      if (success === 'true') {
        // 사용자 정보 가져오기
        const userInfo = await fetchUserInfo();

        if (userInfo?.isAuthenticated) {
          setUserInfo(userInfo);

          // 신규 사용자인 경우 약관 동의 필요
          if (newUser === 'true') {
            setStatus('needs_agreement');
          } else {
            // 기존 사용자인 경우 바로 로그인 완료
            await completeLogin(userInfo);
          }
        } else {
          setStatus('error');
          setErrorMessage('사용자 정보를 가져올 수 없습니다.');
        }
      } else {
        setStatus('error');
        setErrorMessage('OAuth 로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      setStatus('error');
      setErrorMessage('로그인 처리 중 오류가 발생했습니다.');
    }
  };

  const completeLogin = async (userInfo: any) => {
    try {
      await dispatch(setIsAuthenticated());

      const parseUserInfo = {
        name: userInfo.member.name,
        email: userInfo.member.email,
        role: userInfo.member.role,
        memberId: userInfo.member.memberId,
      };

      await dispatch(setUser(parseUserInfo));
      setStatus('success');

      // 3초 후 홈페이지로 리디렉션
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error) {
      console.error('Login completion error:', error);
      setStatus('error');
      setErrorMessage('로그인 완료 중 오류가 발생했습니다.');
    }
  };

  const handleCompleteSignup = async () => {
    if (!termsAgreed) {
      showWarning('서비스 이용약관에 동의해주세요.');
      return;
    }

    // 약관 동의 정보를 백엔드에 전송 (필요시)
    // await updateUserTermsAgreement();

    await completeLogin(userInfo);
  };

  const handleCancel = () => {
    // OAuth 로그인 취소 시 백엔드에 알리고 홈페이지로 이동
    router.push('/');
  };

  if (status === 'loading') {
    return (
      <CallbackContainer>
        <CallbackCard>
          <Title>로그인 처리 중...</Title>
          <LoadingSpinner />
          <Description>잠시만 기다려주세요.</Description>
        </CallbackCard>
      </CallbackContainer>
    );
  }

  if (status === 'needs_agreement') {
    return (
      <CallbackContainer>
        <CallbackCard>
          <Title>서비스 이용약관 동의</Title>
          <Description>
            김프런 서비스 이용을 위해 아래 약관에 동의해주세요.
          </Description>

          <TermsAgreement onAgreementChange={setTermsAgreed} />

          <ButtonGroup>
            <SecondaryButton onClick={handleCancel}>취소</SecondaryButton>
            <LoginButton onClick={handleCompleteSignup} disabled={!termsAgreed}>
              가입 완료
            </LoginButton>
          </ButtonGroup>
        </CallbackCard>
      </CallbackContainer>
    );
  }

  if (status === 'success') {
    return (
      <CallbackContainer>
        <CallbackCard>
          <Title>로그인 완료! 🎉</Title>
          <Description>환영합니다! 잠시 후 홈페이지로 이동합니다.</Description>
          <LoadingSpinner />
        </CallbackCard>
      </CallbackContainer>
    );
  }

  if (status === 'error') {
    return (
      <CallbackContainer>
        <CallbackCard>
          <Title>로그인 오류</Title>
          <Description>{errorMessage}</Description>
          <LoginButton onClick={() => router.push('/')}>
            홈으로 돌아가기
          </LoginButton>
        </CallbackCard>
      </CallbackContainer>
    );
  }

  return null;
};

export default OAuthCallbackPage;
