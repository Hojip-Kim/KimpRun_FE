import styled from 'styled-components';

export const ResetContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  margin-bottom: 16px;

  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    position: relative;

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 12px;
      left: 100%;
      width: 32px;
      height: 2px;
      background: var(--border);
      transition: background 0.3s ease;
    }

    &.completed:not(:last-child)::after {
      background: var(--accent);
    }

    span {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      background: var(--input);
      border: 2px solid var(--border);
      color: var(--text-secondary);
      transition: all 0.3s ease;
    }

    label {
      font-size: 12px;
      color: var(--text-secondary);
      transition: color 0.3s ease;
    }

    &.active {
      span {
        background: var(--accent);
        border-color: var(--accent);
        color: white;
      }

      label {
        color: var(--accent);
        font-weight: 600;
      }
    }

    &.completed {
      span {
        background: var(--accent);
        border-color: var(--accent);
        color: white;
      }

      label {
        color: var(--text-primary);
      }
    }
  }
`;

export const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  h2 {
    text-align: center;
    margin: 0;
    color: var(--text-primary);
    font-size: 20px;
    font-weight: 600;
  }

  p {
    text-align: center;
    margin: 0;
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 1.5;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .back-btn {
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 13px;
      cursor: pointer;
      text-decoration: underline;
      margin-top: 8px;
      transition: color 0.2s ease;

      &:hover {
        color: var(--text-primary);
      }
    }
  }
`;

export const EmailVerificationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const VerificationCodeInput = styled.input`
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 4px;
  font-family: monospace;
`;

export const PasswordSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SuccessMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;

  .success-icon {
    font-size: 48px;
    margin-bottom: 8px;
  }

  h2 {
    color: var(--accent);
    margin: 0;
  }

  p {
    color: var(--text-secondary);
    margin: 0;
  }
`;
