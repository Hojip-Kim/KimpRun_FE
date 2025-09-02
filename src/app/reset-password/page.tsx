'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/app/components/AuthLayout';
import ResetPasswordForm from '@/components/reset-password/ResetPasswordForm';
import { Metadata } from 'next';

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();

  const handleClose = () => {
    router.push('/login');
  };

  return (
    <AuthLayout
      title="비밀번호 재설정"
      subtitle="이메일 인증을 통해 비밀번호를 재설정하세요"
      footerText="로그인 페이지로 돌아가기"
      footerActionText="로그인"
      onFooterAction={() => router.push('/login')}
    >
      <div style={{ width: '100%' }}>
        <ResetPasswordForm closeModal={handleClose} />
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
