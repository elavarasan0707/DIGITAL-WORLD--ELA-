import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ToastNotification: React.FC = () => {
  const { toast, hideToast } = useAuth();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div 
      id="app-global-toast"
      className="fixed top-20 right-4 sm:right-6 z-[120] max-w-sm w-full animate-in slide-in-from-top-4 fade-in duration-200"
    >
      <div 
        className={`flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl ${
          isSuccess 
            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100 shadow-[0_10px_30px_rgba(16,185,129,0.25)]' 
            : isError 
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-100 shadow-[0_10px_30px_rgba(244,63,94,0.25)]' 
              : 'bg-slate-900/90 border-amber-500/40 text-slate-100 shadow-[0_10px_30px_rgba(245,158,11,0.2)]'
        }`}
      >
        <div className="flex-shrink-0 mt-0.5">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-amber-400" />}
        </div>

        <div className="flex-1 pr-2">
          <p className="text-xs font-semibold leading-relaxed">
            {toast.message}
          </p>
        </div>

        <button 
          onClick={hideToast}
          className="flex-shrink-0 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
