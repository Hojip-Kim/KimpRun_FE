import styled from 'styled-components';

export const LoginButton = styled.button`
  margin-top: 10px;
  color: white;
  border: 1px solid #1e1e1e;
  border-radius: 4px;
  cursor: pointer;
  background-color: #1e1e1e;

  &:hover {
    color: rgba(255, 215, 0);
    background-color: #131722;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
`;

export const FormContainer = styled.div`
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
  }
`;

export const GoogleLoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  background-color: #1e1e1e;
  border: 1px solid #1e1e1e;
  border-radius: 4px;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }

  &:hover {
    color: rgba(255, 215, 0);
    background-color: #131722;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
`;
