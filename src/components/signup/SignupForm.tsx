import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { signupDataFetch } from './server/signupDataFetch';

interface SignupFormProps {
  setIsLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const StyledButton = styled.button<{ $isDisabled: boolean }>`
  background-color: ${props => props.$isDisabled ? '#cccccc' : '#007bff'};
  color: ${props => props.$isDisabled ? '#666666' : '#ffffff'};
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: ${props => props.$isDisabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => props.$isDisabled ? '#cccccc' : '#0056b3'};
  }

  &:disabled {
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed;
  }
`;

const SignupForm: React.FC<SignupFormProps> = ({ setIsLoginForm }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const responseJson = await signupDataFetch(username, email, password);
    if(responseJson){
    alert('회원가입 성공! \n' + '환영합니다. ' + responseJson.nickname + '님');
    }
    setIsLoginForm(true);
  };

  useEffect(() => {
    validateForm();
  }, [username, email, password, confirmPassword]);

  const validateForm = () => {
    const isValid = 
      username.trim() !== '' &&
      email.trim() !== '' &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      password === confirmPassword &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    setIsFormValid(isValid);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
  };


  return (
    <>
      <h1>회원가입</h1>
      <form onSubmit={handleSignup}>
        <div>
          <label>사용자 이름</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>이메일</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleInputChange}
            required
          />
          {password !== confirmPassword&&(<span style={{color: 'red'}}>비밀번호가 일치하지 않습니다.</span>)}
        </div>
        <StyledButton type="submit" $isDisabled={!isFormValid} disabled={!isFormValid}>가입하기</StyledButton>
      </form>
      <p>이미 계정이 있으신가요?</p>
      <button onClick={() => setIsLoginForm(true)}>로그인으로 돌아가기</button>
    </>
  );
};

export default SignupForm;
