'use client';
import { useState } from 'react';
import './page.css';

const LoginPage = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spring Boot의 /login 엔드포인트로 POST 요청
    const loginUrl = process.env.NEXT_PUBLIC_LOGIN_URL;

    const requestInit: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // 쿠키 포함
      body: JSON.stringify({
        loginId: username,
        password: password,
      }),
    };

    try {
      const response = await fetch(loginUrl, requestInit);
      console.log(response);
      if (response.ok) {
        alert('로그인 성공');
      } else {
        alert('로그인 실패');
      }
    } catch (e) {
      console.error(e);
      return false;
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
