import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

type ToastVariant = 'default' | 'destructive';

export interface ToastProps {
  id?: string;
  title?: string;
  description?: React.ReactNode;
  variant?: ToastVariant;
}

interface ToastContextType {
  toasts: ToastProps[];
  toast: (props: ToastProps) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = useCallback(({ ...props }: ToastProps) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prevToasts) => [...prevToasts, { id, ...props }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
