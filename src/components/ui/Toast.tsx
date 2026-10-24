import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore, type ToastItem } from '../../store/useToastStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2.5 w-full max-w-md px-4 pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastCard: React.FC<{ toast: ToastItem; onDismiss: () => void }> = ({
  toast,
  onDismiss,
}) => {
  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-[#34C759] flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-[#FF3B30] flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-[#0071E3] dark:text-[#0A84FF] flex-shrink-0" />,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      role="alert"
      className="pointer-events-auto w-full flex items-center justify-between gap-3 px-4 py-3 rounded-[16px] glass-toast text-[#1D1D1F] dark:text-[#F5F5F7] shadow-apple-card dark:shadow-apple-dark border border-black/[0.08] dark:border-white/[0.12]"
    >
      <div className="flex items-center gap-3 min-w-0">
        {iconMap[toast.type]}
        <div className="min-w-0">
          {toast.title && (
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D]">
              {toast.title}
            </p>
          )}
          <p className="text-sm font-medium leading-snug break-words">{toast.message}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="p-1 rounded-full text-[#6E6E73] hover:text-[#1D1D1F] dark:text-[#98989D] dark:hover:text-[#F5F5F7] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
