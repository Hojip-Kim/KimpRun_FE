'use client';

import styled from 'styled-components';

export const LoginButton = styled.button`
  margin-top: 10px;
  color: var(--text-primary);
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  background: var(--input);
  transition: all 0.3s ease;

  &:hover {
    color: var(--accent);
    background-color: var(--bg-container);
    border-color: var(--accent);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  transition: color 0.3s ease;

  h1 {
    text-align: center;
    margin-bottom: 16px;
    color: var(--text-primary);
    transition: color 0.3s ease;
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
      color: var(--text-primary);
      background-color: var(--input);
      border: 1px solid var(--border);
      border-radius: 10px;
      outline: none;
      transition: all 0.2s ease;

      &::placeholder {
        color: var(--text-muted);
      }

      &:focus {
        border-color: var(--accent);
        box-shadow: 0 0 0 3px var(--accent-ring);
      }
    }

    /* Autofill overrides (Chrome/Safari) */
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus {
      -webkit-text-fill-color: var(--text-primary) !important;
      -webkit-box-shadow: 0 0 0px 1000px var(--input) inset !important;
      box-shadow: 0 0 0px 1000px var(--input) inset !important;
      caret-color: var(--text-primary);
      border: 1px solid var(--border-soft);
    }

    label {
      display: block;
      margin-bottom: 0;
      color: var(--text-secondary);
      font-size: 12px;
      transition: color 0.3s ease;
    }

    .error {
      color: #ef4444;
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
    color: var(--text-secondary);
    font-size: 13px;
    transition: color 0.3s ease;

    input[type='checkbox'] {
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 6px;
      border: 1px solid var(--border);
      background: var(--input);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
      outline: none;

      &:checked {
        border-color: var(--accent);
        background: var(--accent);
        box-shadow: 0 0 0 3px var(--accent-ring);
      }

      /* checkmark */
      &::after {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 2px;
        background: transparent;
        transform: scale(0.6);
        transition: background 0.15s ease-in-out;
      }

      &:checked::after {
        background: var(--text-primary);
      }
    }

    label {
      margin: 0;
      user-select: none;
      cursor: pointer;

      a {
        color: var(--accent);
        text-decoration: underline;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }

  /* Password reset section */
  .password-reset-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--border);

    p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 13px;
      text-align: center;
    }

    .reset-password-btn {
      background: none;
      border: none;
      color: var(--accent);
      font-size: 13px;
      cursor: pointer;
      text-decoration: underline;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 0.8;
      }
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
  background: var(--input);
  border: 1px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.3s ease;

  img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }

  &:hover {
    color: var(--accent);
    background-color: var(--bg-container);
    border-color: var(--accent);
  }
`;
