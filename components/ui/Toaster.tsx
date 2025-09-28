import React, { useEffect } from 'react';
import { useToast, ToastProps } from '../../contexts/ToastContext';
import { cn } from '../../lib/utils';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

export const Toaster: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 right-0 z-[100] p-4 space-y-2 w-full max-w-sm">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

const Toast: React.FC<ToastProps> = ({ id, title, description, variant = 'default' }) => {
  const { removeToast } = useToast();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id!);
    }, 5000);
    return () => clearTimeout(timer);
  }, [id, removeToast]);

  const toastVariants = {
    default: 'bg-background border-border',
    destructive: 'bg-destructive border-destructive text-destructive-foreground',
  };

  const Icon = variant === 'destructive' ? AlertCircle : CheckCircle;

  return (
    <div
      className={cn(
        'relative w-full p-4 pr-8 rounded-md border shadow-lg flex items-start gap-3 animate-in slide-in-from-top-5',
        toastVariants[variant]
      )}
    >
        <Icon className="h-5 w-5 mt-0.5" />
        <div className="flex-1">
            {title && <h3 className="font-semibold">{title}</h3>}
            {description && <p className="text-sm opacity-90">{description}</p>}
        </div>
         <button onClick={() => removeToast(id!)} className="absolute top-2 right-2 p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity">
            <X className="h-4 w-4" />
        </button>
    </div>
  );
};
