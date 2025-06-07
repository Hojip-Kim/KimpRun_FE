import { clientRequest } from '@/server/fetch';
import { clientEnv } from '@/utils/env';

const sendVerificationCodeEmailUrl = clientEnv.SEND_VERIFICATION_CODE_EMAIL_URL;
const verifyEmailUrl = clientEnv.VERIFY_EMAIL_URL;
export const signupValidation = (
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  isVerified: boolean
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
