'use client';
import { use, useState } from 'react';
import './loginForm.css';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAuthenticated, setUser } from '@/redux/reducer/authReducer';
import { RootState } from '@/redux/store';
import styled from 'styled-components';

interface LoginFormProps {
  closeModal: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ closeModal }) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const fetchLoginData = async (
    loginId: string,
    password: string
  ): Promise<boolean> => {
    const loginUrl = process.env.NEXT_PUBLIC_LOGIN_URL;

    const requestInit: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // 쿠키 포함
      body: JSON.stringify({
        loginId,
        password,
      }),
    };

    try {
      const response = await fetch(loginUrl, requestInit);
      if (response.ok) {
        const data = await response.json();
        dispatch(setIsAuthenticated(true));
        dispatch(setUser(data.user));
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spring Boot의 /login 엔드포인트로 POST 요청
    const isSuccess = await fetchLoginData(username, password);
    if (isSuccess) {
      // true면
      alert('로그인 성공');
      closeModal();
    } else {
      alert('로그인 실패');
    }
  };

  return (
    <FormContainer>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
