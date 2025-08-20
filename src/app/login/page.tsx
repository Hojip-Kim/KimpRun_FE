'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/login/loginForm';
import AuthLayout from '@/app/components/AuthLayout';

const LoginPage: React.FC = () => {
  const router = useRouter();

  const [modalSize, setModalSize] = useState<{ width: number; height: number }>(
    { width: 400, height: 350 }
  );

  const handleClose = () => {
    router.push('/');
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
