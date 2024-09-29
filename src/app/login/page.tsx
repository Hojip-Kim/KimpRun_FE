'use client';
import { use, useState } from 'react';
import './page.css';

const LoginPage = () => {
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
    const response = await fetchLoginData(username, password);
    if (response) {
      // true면
      alert('로그인 성공');
    } else {
      alert('로그인 실패');
    }
  };

  return (
    <div>
      <div className="login-container">
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
      </div>
    </div>
  );
};

export default LoginPage;
