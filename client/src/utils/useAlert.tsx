import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertOptions {
  title?: string;
  message: string;
  type?: AlertType;
  confirmText?: string;
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

const iconMap: Record<AlertType, React.FC<{ size?: number; className?: string }>> = {
  success: CheckCircle2,
  error: X,
  warning: AlertTriangle,
  info: Info,
};

const colorMap: Record<AlertType, { bg: string; icon: string; border: string; btn: string }> = {
  success: {
    bg: 'bg-[#f0f5f0]',
    icon: 'text-[#2E7D32]',
    border: 'border-[#2E7D32]/20',
    btn: 'bg-[#2E7D32] hover:bg-[#256328] text-white',
  },
  error: {
    bg: 'bg-[#fdf5f5]',
    icon: 'text-rose-600',
    border: 'border-rose-200',
    btn: 'bg-rose-500 hover:bg-rose-600 text-white',
  },
  warning: {
    bg: 'bg-[#fdf9f0]',
    icon: 'text-amber-600',
    border: 'border-amber-200',
    btn: 'bg-[#8D6E63] hover:bg-[#7a5f55] text-white',
  },
  info: {
    bg: 'bg-[#f9f6f2]',
    icon: 'text-[#8D6E63]',
    border: 'border-[#8D6E63]/20',
    btn: 'bg-[#8D6E63] hover:bg-[#7a5f55] text-white',
  },
};

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alertState, setAlertState] = useState<{
    show: boolean;
    options: AlertOptions;
  }>({ show: false, options: { message: '' } });

  const [confirmState, setConfirmState] = useState<{
    show: boolean;
    options: ConfirmOptions;
    resolve: ((val: boolean) => void) | null;
  }>({ show: false, options: { title: '', message: '' }, resolve: null });

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertState({ show: true, options });
  }, []);

  const showConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({ show: true, options, resolve });
    });
  }, []);

  const closeAlert = () => setAlertState((s) => ({ ...s, show: false }));

  const closeConfirm = (result: boolean) => {
    confirmState.resolve?.(result);
    setConfirmState((s) => ({ ...s, show: false, resolve: null }));
  };

  const alertType = alertState.options.type ?? 'info';
  const AlertIcon = iconMap[alertType];
  const alertColors = colorMap[alertType];

  const confirmVariant = confirmState.options.variant ?? 'primary';
  const confirmColors =
    confirmVariant === 'danger'
      ? { btn: 'bg-rose-500 hover:bg-rose-600 text-white', icon: 'text-rose-600', bg: 'bg-rose-50' }
      : { btn: 'bg-[#8D6E63] hover:bg-[#7a5f55] text-white', icon: 'text-[#8D6E63]', bg: 'bg-[#f9f6f2]' };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      {/* Alert Modal */}
      {alertState.show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div
            className={`bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border ${alertColors.border} animate-in zoom-in-95 duration-200`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-xl ${alertColors.bg} flex-shrink-0`}>
                <AlertIcon size={22} className={alertColors.icon} />
              </div>
              <div className="flex-1 min-w-0">
                {alertState.options.title && (
                  <h3 className="font-bold text-[#3d2e28] text-base mb-1">{alertState.options.title}</h3>
                )}
                <p className="text-[#6b5a52] text-sm leading-relaxed">{alertState.options.message}</p>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={closeAlert}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 ${alertColors.btn}`}
              >
                {alertState.options.confirmText ?? 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmState.show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-[#D8C3A5]/50 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4 mb-4">
              <div className={`p-2.5 rounded-xl ${confirmColors.bg} flex-shrink-0`}>
                <AlertTriangle size={22} className={confirmColors.icon} />
              </div>
              <div>
                <h3 className="font-bold text-[#3d2e28] text-base mb-1">{confirmState.options.title}</h3>
                <p className="text-[#6b5a52] text-sm leading-relaxed">{confirmState.options.message}</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => closeConfirm(false)}
                className="px-4 py-2.5 rounded-xl font-medium text-sm text-[#6b5a52] hover:bg-[#f0ebe5] transition-colors"
              >
                {confirmState.options.cancelText ?? 'Cancel'}
              </button>
              <button
                onClick={() => closeConfirm(true)}
                className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 ${confirmColors.btn}`}
              >
                {confirmState.options.confirmText ?? 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used within AlertProvider');
  return ctx;
};