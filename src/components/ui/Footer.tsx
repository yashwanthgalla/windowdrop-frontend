import React from 'react';
import { Link } from 'react-router-dom';
import {
  Share2,
  ShieldCheck,
  Lock,
  Flame,
  HelpCircle,
  AlertTriangle,
  FileText,
  CheckCircle2,
} from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-[10px] bg-[#0071E3] dark:bg-[#0A84FF] text-white flex items-center justify-center shadow-sm shadow-[#0071E3]/20 transition-transform group-hover:scale-105">
                <Share2 className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span
                className="text-2xl font-bold tracking-tight text-[#0071E3] dark:text-[#0A84FF] font-sf-pro"
                style={{ fontFamily: '"SF Pro Display", "SF Pro Text", "SF Pro", -apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                WindowsDrop
              </span>
            </Link>
            <p className="text-sm text-[#6E6E73] dark:text-[#98989D] max-w-sm leading-relaxed">
              Fast, private, peer-to-peer file transfer engine. Share files and nested folders using single-use 8-character codes with automatic post-download shredding.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#34C759] font-medium pt-1">
              <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse"></span>
              <span>All Systems Operational • End-to-End Ephemeral Staging</span>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#1D1D1F] dark:text-[#F5F5F7]">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-[#6E6E73] dark:text-[#98989D] hover:text-[#0071E3] dark:hover:text-[#0A84FF] transition-colors"
                >
                  Send & Receive
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-[#6E6E73] dark:text-[#98989D] hover:text-[#0071E3] dark:hover:text-[#0A84FF] transition-colors flex items-center gap-1.5"
                >
                  <span>How It Works</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/security"
                  className="text-[#6E6E73] dark:text-[#98989D] hover:text-[#0071E3] dark:hover:text-[#0A84FF] transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Security & Crypto</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-[#6E6E73] dark:text-[#98989D] hover:text-[#0071E3] dark:hover:text-[#0A84FF] transition-colors flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>FAQ</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Safety Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#1D1D1F] dark:text-[#F5F5F7]">
              Trust & Safety
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/support"
                  className="text-[#6E6E73] dark:text-[#98989D] hover:text-[#0071E3] dark:hover:text-[#0A84FF] transition-colors"
                >
                  Help Center & Support
                </Link>
              </li>
              <li>
                <Link
                  to="/report-abuse"
                  className="text-[#FF3B30] dark:text-[#FF453A] hover:underline flex items-center gap-1.5 font-medium"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Report Abuse / Takedown</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-[#6E6E73] dark:text-[#98989D] hover:text-[#0071E3] dark:hover:text-[#0A84FF] transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-[#6E6E73] dark:text-[#98989D] hover:text-[#0071E3] dark:hover:text-[#0A84FF] transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Terms of Service</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture Badges Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#1D1D1F] dark:text-[#F5F5F7]">
              Guarantees
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-[#6E6E73] dark:text-[#98989D]">
                <Flame className="w-4 h-4 text-[#FF9500] shrink-0" />
                <span>Auto-Purged on Download</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6E6E73] dark:text-[#98989D]">
                <CheckCircle2 className="w-4 h-4 text-[#34C759] shrink-0" />
                <span>Zero File Indexing</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6E6E73] dark:text-[#98989D]">
                <Lock className="w-4 h-4 text-[#0071E3] dark:text-[#0A84FF] shrink-0" />
                <span>AES-256-GCM Staging</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E6E73] dark:text-[#98989D]">
          <p>© {CURRENT_YEAR} <span className="font-bold text-[#0071E3] dark:text-[#0A84FF]" style={{ fontFamily: '"SF Pro Display", "SF Pro Text", "SF Pro", -apple-system, BlinkMacSystemFont, sans-serif' }}>WindowsDrop</span>. All rights reserved. Zero-content ephemeral transfer engine.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <span>•</span>
            <Link to="/security" className="hover:underline">Security</Link>
            <span>•</span>
            <Link to="/support" className="hover:underline">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
