import { clientRequest } from '@/server/fetch';
import { clientEnv } from '@/utils/env';

const sendVerificationCodeEmailUrl = clientEnv.SEND_VERIFICATION_CODE_EMAIL_URL;
const verifyEmailUrl = clientEnv.VERIFY_EMAIL_URL;

// 비밀번호 유효성 검사 함수
export const validatePassword = (password: string): string | null => {
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

export const signupValidation = (
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  isVerified: boolean,
  termsServiceAgreed: boolean,
  privacyPolicyAgreed: boolean
) => {
  if (
    username.trim() === '' ||
    email.trim() === '' ||
    password.trim() === '' ||
    confirmPassword.trim() === ''
  ) {
    return false;
  }
  if (password !== confirmPassword) {
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return false;
  }
  
  // 비밀번호 유효성 검사
  const passwordValidationError = validatePassword(password);
  if (passwordValidationError) {
    return false;
  }
  
  if (!isVerified) {
    return false;
  }
  if (!termsServiceAgreed || !privacyPolicyAgreed) {
    return false;
  }
  return true;
};

export const emailValidation = (email: string) => {
  if (email.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return false;
  }
  return true;
};

export const emailVerification = async (email: string) => {
  const response = await clientRequest.post(sendVerificationCodeEmailUrl, {
    email,
  });

  if (response.success) {
    return true;
  }
  return false;
};

export const verifyEmail = async (email: string, verifyCode: string) => {
  const response = await clientRequest.post(verifyEmailUrl, {
    email,
    verifyCode,
  });
  if (response.success) {
    return true;
  }
  return false;
};
