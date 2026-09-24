import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Mail, 
  CheckCircle2, 
  Sparkles, 
  Info 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface OwnerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OwnerSettingsModal: React.FC<OwnerSettingsModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, adminEmails, addOwnerEmail, removeOwnerEmail, isOwner } = useAuth();
  const [newEmail, setNewEmail] = useState('');
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes('@')) return;
    addOwnerEmail(newEmail.trim());
    setSuccess(`Added "${newEmail.trim()}" as authorized owner/admin.`);
    setNewEmail('');
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading text-xl sm:text-2xl font-black text-white">
              Owner Email Settings
            </h3>
            <p className="text-xs text-slate-400">
              Manage email accounts with full administrative control.
            </p>
          </div>
        </div>

        {/* Current Active User Status */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <span className="text-xs font-bold text-white block">
                Active Session: {userProfile?.name || 'Authorized Owner'}
              </span>
              <span className="text-[11px] font-mono text-amber-300">
                {isOwner ? '👑 Verified Agency Owner & Project Admin' : 'Client Mode'}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500 text-slate-950">
            Active
          </span>
        </div>

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Authorized Owner Emails List */}
        <div className="mb-6">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-2">
            Authorized Owner Credentials ({adminEmails.length})
          </span>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {adminEmails.map((email) => {
              const isPrimary = email.toLowerCase() === 'elae2379@gmail.com' || email.toLowerCase() === 'eladigitalw@gmail.com';
              // Mask email for privacy
              const parts = email.split('@');
              const maskedName = parts[0].length > 3 
                ? `${parts[0].slice(0, 2)}••••${parts[0].slice(-2)}`
                : `${parts[0]}••••`;
              const maskedEmail = `${maskedName}@${parts[1] || 'gmail.com'}`;

              return (
                <div
                  key={email}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-xs font-mono text-white font-medium block">
                        {isPrimary ? 'Primary Owner Account' : maskedEmail}
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono">
                        {isPrimary ? 'Confidential Master Access' : 'Delegated Admin'}
                      </span>
                    </div>
                  </div>

                  {!isPrimary && (
                    <button
                      onClick={() => removeOwnerEmail(email)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                      title="Remove owner permission"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Add New Owner Form */}
        <form onSubmit={handleAdd} className="space-y-3">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Add Another Owner Email ID
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="new.owner@gmail.com"
              className="flex-1 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </form>

        {/* Explanatory Info */}
        <div className="mt-6 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            Signing in with any of these email IDs automatically enables the "+ Add Project", "Edit", and "Delete" buttons across the application.
          </span>
        </div>
      </div>
    </div>
  );
};
