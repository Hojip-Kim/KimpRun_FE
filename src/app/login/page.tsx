'use client';
import { useState } from 'react';
import './page.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spring Boot의 /login 엔드포인트로 POST 요청
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: new URLSearchParams({
        username,
        password,
      }),
      credentials: 'include', // 세션 쿠키를 포함한 요청
      redirect: 'manual',
    });
    console.log(response);
    if (response.status === 302) {
      // 리다이렉트 처리
      const location = response.headers.get('Location');
      if (location) {
        window.location.href = location; // 리다이렉트 처리
      }
    } else if (response.ok) {
      console.log('login 성공');
    } else {
      console.log(response);
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
