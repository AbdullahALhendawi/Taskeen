import { createContext, useContext, useState, type ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'error' | 'success' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function showToast(message: string, type: Toast['type'] = 'error') {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }

  const colors: Record<Toast['type'], { accent: string; text: string }> = {
    error: { accent: '#DC2626', text: '#111827' },
    success: { accent: '#16A34A', text: '#111827' },
    info: { accent: '#4F46E5', text: '#111827' },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', top: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 1000 }}>
        {toasts.map((toast) => {
          const c = colors[toast.type];
          return (
            <div
              key={toast.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                backgroundColor: '#fff', border: '1px solid #F0F0F2', borderLeft: `3px solid ${c.accent}`,
                color: c.text, padding: '14px 18px', borderRadius: '12px', fontSize: '14px', fontWeight: 500,
                boxShadow: '0 8px 20px rgba(16, 24, 40, 0.1)', maxWidth: '340px',
              }}
            >
              {toast.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}