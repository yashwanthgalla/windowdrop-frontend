import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Share2,
  Sun,
  Moon,
  LogIn,
  LogOut,
  History,
  User,
} from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const { user, signOut } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-colors duration-200">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* Left: Logo & Nav Links */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded-[12px] p-1 -m-1"
          >
            <div className="w-9 h-9 rounded-[10px] bg-[#0071E3] dark:bg-[#0A84FF] text-white flex items-center justify-center shadow-sm shadow-[#0071E3]/25 transition-transform group-hover:scale-105">
              <Share2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
              DropCode
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 pl-1">
            <Link
              to="/how-it-works"
              className="px-3 py-1.5 rounded-[12px] text-xs font-medium text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            >
              How It Works
            </Link>
            <Link
              to="/security"
              className="px-3 py-1.5 rounded-[12px] text-xs font-medium text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            >
              Security
            </Link>
            <Link
              to="/faq"
              className="px-3 py-1.5 rounded-[12px] text-xs font-medium text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            >
              FAQ
            </Link>
            <Link
              to="/support"
              className="px-3 py-1.5 rounded-[12px] text-xs font-medium text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            >
              Support
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sun / Moon Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="w-9 h-9 rounded-[12px] flex items-center justify-center text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 stroke-[2] text-[#1D1D1F]" />
            ) : (
              <Sun className="w-4 h-4 stroke-[2] text-[#F5F5F7]" />
            )}
          </button>

          {/* Signed OUT */}
          {!user ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/auth?mode=signin')}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-[14px] text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign in</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/auth?mode=signup')}
                className="hidden sm:inline-flex items-center justify-center h-9 px-3.5 rounded-[14px] bg-[#0071E3] hover:bg-[#0077ED] dark:bg-[#0A84FF] text-white text-xs font-semibold shadow-sm shadow-[#0071E3]/20 transition-all"
              >
                Get started
              </button>
            </div>
          ) : (
            /* Signed IN */
            <div className="flex items-center gap-2.5">
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-expanded={menuOpen}
                  aria-haspopup="true"
                  className="w-9 h-9 rounded-full bg-[#0071E3] dark:bg-[#0A84FF] text-white flex items-center justify-center text-xs font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:ring-offset-2"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Avatar'}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'
                  )}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-2xl py-2 z-50 text-xs">
                    <div className="px-4 py-2.5 border-b border-black/[0.06] dark:border-white/[0.08]">
                      <p className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
                        {user.displayName || 'DropCode User'}
                      </p>
                      <p className="text-[#6E6E73] dark:text-[#98989D] truncate text-[11px]">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-[#34C759] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
                        <span>Active (30m session)</span>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-[#1D1D1F] dark:text-[#F5F5F7] transition-colors"
                    >
                      <User className="w-4 h-4 text-[#6E6E73] dark:text-[#98989D]" />
                      <span>Profile & Account</span>
                    </Link>

                    <Link
                      to="/history"
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-[#1D1D1F] dark:text-[#F5F5F7] transition-colors"
                    >
                      <History className="w-4 h-4 text-[#6E6E73] dark:text-[#98989D]" />
                      <span>History</span>
                    </Link>

                    <div className="border-t border-black/[0.06] dark:border-white/[0.08] my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-red-500/10 text-[#FF3B30] font-medium transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
