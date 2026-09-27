'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col space-y-2 pointer-events-none max-w-[calc(100vw-2rem)]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center space-x-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all duration-300 animate-slide-in backdrop-blur-sm ${
              toast.type === 'success'
                ? 'bg-white border-emerald-200 text-emerald-800 shadow-emerald-100'
                : toast.type === 'error'
                ? 'bg-white border-rose-200 text-rose-800 shadow-rose-100'
                : 'bg-white border-blue-200 text-blue-800 shadow-blue-100'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />}
            <span className="text-slate-700 max-w-xs">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
