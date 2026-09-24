import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  User as UserIcon, 
  LogOut, 
  Crown, 
  Plus, 
  Settings, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { getWhatsAppDirectUrl } from '../../lib/whatsapp';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  openBookingModal: () => void;
  openAddProjectModal: () => void;
  openOwnerSettingsModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  openBookingModal,
  openAddProjectModal,
  openOwnerSettingsModal
}) => {
  const { 
    user, 
    userProfile, 
    isAdmin, 
    isOwner, 
    logout, 
    openGoogleModal 
  } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', hash: '#hero' },
    { label: 'Services', hash: '#services' },
    { label: 'Projects', hash: '#projects' },
    { label: 'About', hash: '#about' },
    { label: 'Contact', hash: '#contact' },
  ];

  const handleNavClick = (hash: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
    }
    setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleWhatsAppClick = () => {
    window.open(getWhatsAppDirectUrl(), '_blank', 'noopener,noreferrer');
  };

  return (
    <header 
      id="main-navigation-bar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#030712]/95 backdrop-blur-2xl border-b border-slate-800 shadow-[0_12px_40px_rgba(0,0,0,0.85)] py-3' 
          : 'bg-[#030712]/70 backdrop-blur-md border-b border-slate-800/40 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex-shrink-0">
          <BrandLogo 
            size="md" 
            showTagline={true} 
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        </div>

        {/* Top Horizontal Navigation Links (Clean & Clear, No sidebar) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/70 border border-slate-800 rounded-full px-4 py-1.5 backdrop-blur-md">
          {navLinks.map((item) => (
            <button
              key={item.label}
              id={`nav-link-${item.label.toLowerCase()}`}
              onClick={() => handleNavClick(item.hash)}
              className="px-3.5 py-1.5 text-xs font-medium rounded-full text-slate-300 hover:text-amber-400 hover:bg-slate-800/60 transition-all duration-150"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick WhatsApp CTA */}
          <button
            id="navbar-whatsapp-button"
            onClick={handleWhatsAppClick}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:text-white hover:bg-emerald-600/30 text-xs font-medium transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp</span>
          </button>

          {/* Owner Project Add Button (Visible if logged in as Owner) */}
          {isOwner && (
            <button
              id="navbar-add-project-btn"
              onClick={openAddProjectModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span className="hidden sm:inline">Add Project</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}

          {/* User Account State */}
          {user || userProfile ? (
            <div className="relative">
              <button
                id="user-profile-menu-button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className={`flex items-center gap-2 p-1.5 pr-2.5 rounded-full border text-xs text-white transition-all ${
                  isOwner 
                    ? 'bg-amber-950/40 border-amber-500/50 hover:border-amber-400' 
                    : 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="relative">
                  <img
                    src={userProfile?.photoURL || user?.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.uid || 'ela'}`}
                    alt={userProfile?.name || 'Account'}
                    className={`w-6 h-6 rounded-full object-cover border ${isOwner ? 'border-amber-400' : 'border-slate-600'}`}
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center">
                    <svg className="w-1.5 h-1.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  </div>
                </div>
                <span className="max-w-[110px] truncate font-medium text-xs hidden sm:inline">
                  {userProfile?.name || user?.email?.split('@')[0] || 'User'}
                </span>
                {isOwner && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500 text-slate-950 rounded uppercase font-mono">
                    Owner
                  </span>
                )}
              </button>

              {userDropdownOpen && (
                <div 
                  id="user-dropdown-menu"
                  className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-3 py-2.5 border-b border-slate-800">
                    <p className="font-bold text-white truncate text-xs">
                      {userProfile?.name || 'Active Account'}
                    </p>
                    <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                      {userProfile?.email || user?.email}
                    </p>
                    {isOwner ? (
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-medium">
                        <Crown className="w-3 h-3 text-amber-400" />
                        <span>Owner & Administrator</span>
                      </div>
                    ) : (
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[10px] font-medium">
                        <ShieldCheck className="w-3 h-3 text-blue-400" />
                        <span>Client Account</span>
                      </div>
                    )}
                  </div>

                  {/* Owner Controls in dropdown */}
                  {isOwner && (
                    <>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openAddProjectModal();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-300 hover:bg-amber-500/10 text-left transition-colors font-semibold"
                      >
                        <Plus className="w-4 h-4 text-amber-400" />
                        <span>+ Add New Project</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openOwnerSettingsModal();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white text-left transition-colors"
                      >
                        <Settings className="w-4 h-4 text-amber-400" />
                        <span>Owner Email Settings</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      openBookingModal();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white text-left transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                    <span>Book Strategy Call</span>
                  </button>

                  <div className="border-t border-slate-800 my-1" />

                  <button
                    id="menu-logout-button"
                    onClick={async () => {
                      await logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 text-left transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              id="navbar-google-login-button"
              onClick={openGoogleModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm hover:bg-slate-800"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          )}

          {/* Quick "Start Project" CTA */}
          <button
            id="navbar-get-started-button"
            onClick={() => handleNavClick('#contact')}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:scale-105 active:scale-95 transition-all hidden lg:flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
};
