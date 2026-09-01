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
      ? 'bg-brutal-yellow text-brutal-black border-brutal-black'
      : type === 'error'
      ? 'bg-brutal-red text-white border-brutal-black'
      : 'bg-brutal-blue text-white border-brutal-black';

  const Icon = type === 'success' ? CheckCircle2 : type === 'error' ? AlertCircle : Info;

  return (
    <div
      ref={toastRef}
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 p-4 border-3 shadow-brutal-lg max-w-sm ${bgStyles}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-xs font-bold font-mono tracking-tight flex-1">{message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:bg-black/10 transition-colors border border-black/20"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
