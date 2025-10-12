'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginForm from '@/components/login/loginForm';
import AuthLayout from '@/app/components/AuthLayout';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [modalSize, setModalSize] = useState<{ width: number; height: number }>(
    { width: 400, height: 350 }
  );

  // 이전 페이지 URL을 저장
  useEffect(() => {
    const redirectUrl = searchParams.get('redirect');
    if (redirectUrl) {
      sessionStorage.setItem('loginRedirectUrl', redirectUrl);
    } else if (!sessionStorage.getItem('loginRedirectUrl')) {
      // redirect 파라미터가 없고 저장된 URL도 없으면 document.referrer 사용
      if (document.referrer && !document.referrer.includes('/login')) {
        sessionStorage.setItem('loginRedirectUrl', document.referrer);
      }
    }
  }, [searchParams]);

  const handleClose = () => {
    const redirectUrl = sessionStorage.getItem('loginRedirectUrl');
    sessionStorage.removeItem('loginRedirectUrl');
    
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      router.push('/');
    }
  };

  return (
    <AuthLayout
      title="로그인"
      subtitle="이메일로 로그인하거나 Google로 계속하세요"
      footerText="아직 계정이 없으신가요?"
      footerActionText="회원가입"
      onFooterAction={() => router.push('/signup')}
    >
      <div style={{ width: '100%' }}>
        <LoginForm
          closeModal={handleClose}
          setModalSize={setModalSize}
          onClickSignup={() => router.push('/signup')}
          hideInlineTitle
          hideInlineFooter
        />
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
