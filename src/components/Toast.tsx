import React, { useEffect, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { toastSlideIn } from '../lib/animations';

export interface ToastProps {
  id?: string;
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (toastRef.current) {
      toastSlideIn(toastRef.current);
    }
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgStyles =
    type === 'success'
      ? 'bg-[#0B1F33] text-[#FAF8F3] border border-emerald-500/50 shadow-academic'
      : type === 'error'
      ? 'bg-[#0B1F33] text-[#FAF8F3] border border-red-500/50 shadow-academic'
      : 'bg-[#0B1F33] text-[#FAF8F3] border border-[#D9A441]/50 shadow-academic';

  const Icon = type === 'success' ? CheckCircle2 : type === 'error' ? AlertCircle : Info;
  const iconColor = type === 'success' ? 'text-emerald-400' : type === 'error' ? 'text-red-400' : 'text-[#D9A441]';

  return (
    <div
      ref={toastRef}
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 p-4 rounded-xl max-w-sm ${bgStyles}`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
      <span className="text-xs font-semibold tracking-tight flex-1">{message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
