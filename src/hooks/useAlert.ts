'use client';

import { useState, useCallback } from 'react';

interface AlertOptions {
  title?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  confirmText?: string;
  onConfirm?: () => void;
  cancelText?: string;
  onCancel?: () => void;
}

interface AlertState {
  isOpen: boolean;
  message: string;
  title?: string;
  type: 'info' | 'success' | 'warning' | 'error';
  confirmText: string;
  onConfirm?: () => void;
  cancelText: string;
  onCancel?: () => void;
}

/**
 * 전역 알림 모달을 관리하는 커스텀 훅
 */
export function useAlert() {
  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    message: '',
    type: 'info',
    confirmText: '확인',
    cancelText: '취소',
  });

  const showAlert = useCallback(
    (message: string, options: AlertOptions = {}) => {
      setAlertState({
        isOpen: true,
        message,
        title: options.title,
        type: options.type || 'info',
        confirmText: options.confirmText || '확인',
        onConfirm: options.onConfirm,
        cancelText: options.cancelText || '취소',
        onCancel: options.onCancel,
      });
    },
    []
  );

  const hideAlert = useCallback(() => {
    setAlertState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  // 편의 메서드들
  const showSuccess = useCallback(
    (message: string, options: Omit<AlertOptions, 'type'> = {}) => {
      showAlert(message, { ...options, type: 'success' });
    },
    [showAlert]
  );

  const showError = useCallback(
    (message: string, options: Omit<AlertOptions, 'type'> = {}) => {
      showAlert(message, { ...options, type: 'error' });
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (message: string, options: Omit<AlertOptions, 'type'> = {}) => {
      showAlert(message, { ...options, type: 'warning' });
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (message: string, options: Omit<AlertOptions, 'type'> = {}) => {
      showAlert(message, { ...options, type: 'info' });
    },
    [showAlert]
  );

  const showConfirm = useCallback(
    (
      message: string,
      onConfirm: () => void,
      options: Omit<AlertOptions, 'onConfirm'> = {}
    ) => {
      showAlert(message, {
        ...options,
        onConfirm,
        type: options.type || 'warning',
      });
    },
    [showAlert]
  );

  return {
    alertState,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  };
}
