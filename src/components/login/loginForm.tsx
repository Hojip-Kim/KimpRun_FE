'use client';
import { useEffect, useState } from 'react';
import './loginForm.css';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAuthenticated, setUser } from '@/redux/reducer/authReducer';
import styled from 'styled-components';
import SignupForm from '../signup/SignupForm';
import { loginDataFetch } from './server/loginDataFetch';
import { fetchUserInfo } from '../auth/fetchUserInfo';

interface LoginFormProps {
  closeModal: () => void;
  setModalSize: React.Dispatch<
    React.SetStateAction<{
      width: number;
      height: number;
    }>
  >;
}

const LoginForm: React.FC<LoginFormProps> = ({ closeModal, setModalSize }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoginForm, setIsLoginForm] = useState<boolean>(true);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const statusUrl = process.env.NEXT_PUBLIC_STATUS_URL;
  const loginUrl = process.env.NEXT_PUBLIC_LOGIN_URL;

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  });

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

  const fetchLoginData = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    const isLoginSuccess = await loginDataFetch(loginUrl, email, password);

    if (isLoginSuccess) {
      return true;
    } else {
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rememberMe) {
      localStorage.setItem('email', email);
    } else {
      localStorage.removeItem('email');
    }

    // Spring Boot의 /login 엔드포인트로 POST 요청
    const isSuccess = await fetchLoginData(email, password);
    if (isSuccess) {
      // true면
      await dispatch(setIsAuthenticated());
      await fetchUserInfo(statusUrl, dispatch);
      alert('로그인 성공');
      closeModal();
    } else {
      alert('로그인 실패');
    }
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
            <button type="submit">Login</button>
          </form>
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

const FormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  h1 {
    text-align: center;
    margin-bottom: 16px;
  }

  form {
    display: flex;
    flex-direction: column;

    input {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
      color: black;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    label {
      display: block;
      margin-bottom: 4px;
      color: white;
    }

    .error {
      color: red;
      margin-bottom: 12px;
      text-align: center;
    }

    button {
      padding: 10px;
      background-color: #2196f3;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 4px;

      &:hover {
        background-color: #1976d2;
      }
    }
  }
`;
