'use client';

import React, { createContext, useContext } from 'react';
import { useAlert } from '@/hooks/useAlert';
import AlertModal from '@/components/common/AlertModal';

interface AlertContextType {
  showAlert: (message: string, options?: any) => void;
  showSuccess: (message: string, options?: any) => void;
  showError: (message: string, options?: any) => void;
  showWarning: (message: string, options?: any) => void;
  showInfo: (message: string, options?: any) => void;
  showConfirm: (message: string, onConfirm: () => void, options?: any) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const {
    alertState,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  } = useAlert();

  const contextValue: AlertContextType = {
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    hideAlert,
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={hideAlert}
        message={alertState.message}
        title={alertState.title}
        type={alertState.type}
        confirmText={alertState.confirmText}
        onConfirm={alertState.onConfirm}
        cancelText={alertState.cancelText}
        onCancel={alertState.onCancel}
      />
    </AlertContext.Provider>
  );
}

export function useGlobalAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useGlobalAlert must be used within an AlertProvider');
  }
  return context;
}
