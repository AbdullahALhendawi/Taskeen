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
        <div className="modal-overlay">
          <div className="modal-card">
            <p className="modal-message">{options.message}</p>
            <div className="modal-actions">
              <button onClick={handleCancel} className="btn btn-secondary">
                {options.cancelLabel ?? 'Cancel'}
              </button>
              <button onClick={handleConfirm} className="btn btn-danger">
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
