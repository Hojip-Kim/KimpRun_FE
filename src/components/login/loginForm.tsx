'use client';
import { useEffect, useState } from 'react';
import './loginForm.css';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAuthenticated, setUser } from '@/redux/reducer/authReducer';
import SignupForm from '../signup/SignupForm';
import { loginDataFetch, responseData } from './server/loginDataFetch';
import { fetchUserInfo } from '../auth/fetchUserInfo';
import { clientEnv } from '@/utils/env';
import { FormContainer, LoginButton, GoogleLoginButton } from './style';
interface LoginFormProps {
  closeModal: () => void;
  setModalSize: React.Dispatch<
    React.SetStateAction<{
      width: number;
      height: number;
    }>
  >;
}

const googleLoginUrl = clientEnv.GOOGLE_LOGIN_URL;

interface loginResponse {
  result: 'check' | 'success';
  message: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ closeModal, setModalSize }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoginForm, setIsLoginForm] = useState<boolean>(true);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const statusUrl = clientEnv.STATUS_URL;
  const loginUrl = clientEnv.LOGIN_URL;

  useEffect(() => {
    if (isLoginForm) {
      setModalSize({ width: 400, height: 350 });
    } else {
      setModalSize({ width: 450, height: 450 });
    }
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    } else {
      setRememberMe(false);
    }
  }, [isLoginForm, setModalSize]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rememberMe) {
      localStorage.setItem('email', email);
    } else {
      localStorage.removeItem('email');
    }

    // Spring Boot의 /login 엔드포인트로 POST 요청
    const loginResponse: responseData = await loginDataFetch(
      loginUrl,
      email,
      password
    );
    if (loginResponse) {
      if (loginResponse.result === 'success') {
        await dispatch(setIsAuthenticated());
        await fetchUserInfo();
        alert('로그인 성공');
        closeModal();
      } else if (loginResponse.result === 'check') {
        const userConfirmed = window.confirm(
          `다른 기기에서 접속이 감지되었습니다.\n접속 IP: ${loginResponse.data}\n\n계속 진행하시겠습니까?`
        );

        if (userConfirmed) {
          await dispatch(setIsAuthenticated());
          await fetchUserInfo();
          alert('로그인 성공');
          closeModal();
        } else {
          window.location.href = '/change-password'; // 비밀번호 변경 페이지 URL로 수정 필요
        }
      }
    } else {
      alert('로그인 실패');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = googleLoginUrl;
  };

  return (
    <FormContainer>
      {isLoginForm ? (
        <>
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <div>
              <label>Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <LoginButton type="submit">로그인</LoginButton>
          </form>
          <GoogleLoginButton onClick={handleGoogleLogin}>
            <img src="/google.png" alt="google icon" />
            Google로 로그인
          </GoogleLoginButton>
          <p>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            아이디 기억하기
          </p>

          <h1>아이디가 없으세요?</h1>
          <button onClick={() => setIsLoginForm(false)}>회원가입</button>
        </>
      ) : (
        <SignupForm setIsLoginForm={setIsLoginForm} />
      )}
    </FormContainer>
  );
};

export default LoginForm;
