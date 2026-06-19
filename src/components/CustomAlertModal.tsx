import React, { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { 
  CheckCircle2, 
  AlertOctagon, 
  AlertTriangle, 
  Info,
  X 
} from 'lucide-react';

export const CustomAlertModal: React.FC = () => {
  const { alertModal, closeAlertModal } = useStore();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAlertModal();
      }
    };
    if (alertModal) {
      document.addEventListener('keydown', handleEscape);
      // Auto focus close button for accessibility
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [alertModal]);

  if (!alertModal) return null;

  const { title, message, type } = alertModal;

  // Icon selector based on type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="text-emerald-500" size={28} />;
      case 'danger':
        return <AlertOctagon className="text-red-500" size={28} />;
      case 'warning':
        return <AlertTriangle className="text-amber-500" size={28} />;
      case 'info':
      default:
        return <Info className="text-blue-500" size={28} />;
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/20 bg-emerald-500/5';
      case 'danger':
        return 'border-red-500/20 bg-red-500/5';
      case 'warning':
        return 'border-amber-500/20 bg-amber-500/5';
      case 'info':
      default:
        return 'border-blue-500/20 bg-blue-500/5';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/20 dark:bg-black/45 backdrop-blur-md animate-fade-in"
      onClick={closeAlertModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={`glass-panel p-6 rounded-2xl max-w-md w-full border ${getTypeStyles()} shadow-2xl relative space-y-4 text-center`}
        onClick={e => e.stopPropagation()} // prevent closing when clicking inside modal
      >
        {/* Top-right close button */}
        <button
          onClick={closeAlertModal}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-650 hover:bg-slate-100 dark:hover:bg-zinc-800/80 cursor-pointer transition-colors"
          aria-label="Close alert"
        >
          <X size={16} />
        </button>

        {/* Dynamic Icon */}
        <div className="inline-flex p-3 rounded-full bg-white dark:bg-zinc-950 shadow-md">
          {getIcon()}
        </div>

        {/* Title & Message */}
        <div className="space-y-2">
          <h3 id="modal-title" className="text-base font-bold font-display text-slate-800 dark:text-slate-100">
            {title}
          </h3>
          <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-line text-left bg-slate-50/50 dark:bg-zinc-950/30 p-3.5 rounded-xl border border-slate-100 dark:border-zinc-900/50 font-mono">
            {message}
          </div>
        </div>

        {/* Primary Confirmation Action */}
        <div>
          <button
            ref={closeButtonRef}
            onClick={closeAlertModal}
            className="w-full py-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-md shadow-brand-500/10 transition-colors"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
