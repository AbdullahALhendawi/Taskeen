import { createContext, useContext, useState, type ReactNode } from 'react';

interface ConfirmOptions {
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  function confirm(opts: ConfirmOptions): Promise<boolean> {
    setOptions(opts);
    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  }

  function handleConfirm() {
    if (resolver) resolver(true);
    setOptions(null);
    setResolver(null);
  }

  function handleCancel() {
    if (resolver) resolver(false);
    setOptions(null);
    setResolver(null);
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {options && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(17, 24, 39, 0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff', borderRadius: '16px', padding: '32px',
              maxWidth: '400px', width: '90%', boxShadow: '0 20px 40px rgba(16, 24, 40, 0.18)',
              border: '1px solid #F0F0F2',
            }}
          >
            <p style={{ fontSize: '15px', color: '#111827', marginTop: 0, marginBottom: '28px', lineHeight: 1.6 }}>
              {options.message}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancel}
                style={{
                  padding: '10px 20px', fontSize: '14px', fontWeight: 600,
                  color: '#374151', backgroundColor: '#F3F4F6', border: 'none',
                  borderRadius: '10px', cursor: 'pointer',
                }}
              >
                {options.cancelLabel ?? 'Cancel'}
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  padding: '10px 20px', fontSize: '14px', fontWeight: 600,
                  color: '#fff', backgroundColor: '#DC2626', border: 'none',
                  borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(220, 38, 38, 0.25)',
                }}
              >
                {options.confirmLabel ?? 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error('useConfirm must be used within a ConfirmProvider');
  return context.confirm;
}