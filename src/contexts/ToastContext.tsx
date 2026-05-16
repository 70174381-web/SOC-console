import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  const colors: Record<string, string> = {
    success: 'border-green-500 text-green-400',
    error: 'border-red-500 text-red-400',
    info: 'border-cyan-500 text-cyan-400',
    warning: 'border-yellow-500 text-yellow-400',
  };
  const icons: Record<string, string> = {
    success: '✓', error: '✕', info: 'ℹ', warning: '⚠',
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`bg-[#0f1629] border ${colors[toast.type]} rounded-lg px-4 py-3 flex items-center gap-3 shadow-xl min-w-[280px] max-w-[380px] pointer-events-auto animate-slide-in`}
          style={{ animation: 'slideIn 0.3s ease-out' }}
        >
          <span className={`text-lg font-bold ${colors[toast.type].split(' ')[1]}`}>{icons[toast.type]}</span>
          <span className="text-sm text-gray-200">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast outside ToastProvider');
  return ctx;
}
