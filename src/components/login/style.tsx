import styled from 'styled-components';

export const LoginButton = styled.button`
  margin-top: 10px;
  color: white;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  cursor: pointer;
  background: linear-gradient(180deg, #1e1e1e, #171b24);

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
    color: #e6e8ee;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 12px;

    /* form row spacing */
    > div {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    input {
      width: 100%;
      padding: 12px 14px;
      box-sizing: border-box;
      color: #e9eef9;
      background-color: rgba(8, 12, 20, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    /* Autofill overrides (Chrome/Safari) */
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus {
      -webkit-text-fill-color: #e9eef9 !important;
      -webkit-box-shadow: 0 0 0px 1000px rgba(8, 12, 20, 0.9) inset !important;
      box-shadow: 0 0 0px 1000px rgba(8, 12, 20, 0.9) inset !important;
      caret-color: #e9eef9;
      border: 1px solid rgba(255, 255, 255, 0.12);
    }
    input::placeholder {
      color: #7b87a3;
    }
    input:focus {
      border-color: rgba(255, 215, 0, 0.45);
      box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
    }
    label {
      display: block;
      margin-bottom: 0;
      color: #cfd6e4;
      font-size: 12px;
    }

    .error {
      color: red;
      margin-bottom: 12px;
      text-align: center;
    }
  }
  /* Remember me row */
  .remember-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
    color: #cfd6e4;
    font-size: 13px;

    input[type='checkbox'] {
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.16);
      background: rgba(8, 12, 20, 0.9);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
      outline: none;
    }
    input[type='checkbox']:checked {
      border-color: rgba(255, 215, 0, 0.55);
      background: linear-gradient(180deg, #2a2a2a, #1b1f2a);
      box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
    }
    /* checkmark */
    input[type='checkbox']::after {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 2px;
      background: transparent;
      transform: scale(0.6);
      transition: background 0.15s ease-in-out;
    }
    input[type='checkbox']:checked::after {
      background: rgba(255, 215, 0, 0.95);
    }
    label {
      margin: 0;
      user-select: none;
      cursor: pointer;
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
  background: rgba(8, 12, 20, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
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
