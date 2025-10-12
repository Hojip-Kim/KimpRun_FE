'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import SignupForm from '@/components/signup/SignupForm';
import AuthLayout from '@/app/components/AuthLayout';

const SignupPage: React.FC = () => {
  const router = useRouter();

  // Adapt the existing toggle to navigate to the login page
  const goToLogin = () => router.push('/login');

  return (
    <AuthLayout
      title="회원가입"
      subtitle="이메일 인증 후 가입을 완료하세요"
      footerText="이미 계정이 있으신가요?"
      footerActionText="로그인"
      onFooterAction={goToLogin}
    >
      <div style={{ width: '100%' }}>
        <SignupForm
          setIsLoginForm={() => goToLogin()}
          hideInlineTitle
          hideBackToLogin
        />
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
