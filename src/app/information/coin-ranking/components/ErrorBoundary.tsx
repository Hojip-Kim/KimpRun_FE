'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { palette } from '@/styles/palette';

const ErrorContainer = styled.div`
  background: ${palette.card};
  border: 1px solid #ef4444;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  margin: 2rem 0;
`;

const ErrorTitle = styled.h2`
  color: #ef4444;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const ErrorMessage = styled.p`
  color: ${palette.textSecondary};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  margin-top: 1rem;
  padding: 1rem;
  background: ${palette.bgPage};
  border-radius: 8px;
  text-align: left;

  summary {
    cursor: pointer;
    color: ${palette.textMuted};
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  pre {
    white-space: pre-wrap;
    font-size: 0.8rem;
    color: ${palette.textMuted};
    margin: 0;
    overflow: auto;
  }
`;

const RefreshButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${palette.accent};
  color: #000;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * 에러 바운더리 컴포넌트
 * React 애플리케이션의 JavaScript 에러를 포착하고 처리
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // 에러 리포팅 서비스에 전송 (예: Sentry)
    // reportError(error, errorInfo);
  }

  handleRefresh = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorTitle>앗! 문제가 발생했습니다</ErrorTitle>
          <ErrorMessage>
            페이지를 로드하는 중 예상치 못한 오류가 발생했습니다.
            <br />
            페이지를 새로고침하시거나 잠시 후 다시 시도해주세요.
          </ErrorMessage>

          <RefreshButton onClick={this.handleRefresh}>
            페이지 새로고침
          </RefreshButton>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <ErrorDetails>
              <summary>개발자 정보 (개발 환경에서만 표시)</summary>
              <pre>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
