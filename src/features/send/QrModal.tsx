import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import {
  X,
  QrCode,
  Copy,
  Check,
  Share2,
  Clock,
  ShieldCheck,
  Link2,
  ArrowDownToLine,
  Smartphone,
  Download,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToastStore } from '../../store/useToastStore';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareCode: string;
  timeLeft: string;
  isExpired?: boolean;
}

export const QrModal: React.FC<QrModalProps> = ({
  isOpen,
  onClose,
  shareCode,
  timeLeft,
  isExpired = false,
}) => {
  const { showToast } = useToastStore();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [laserActive, setLaserActive] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cleanCode = (shareCode || 'ABCDEFGH').replace(/[^A-Z0-9]/gi, '').toUpperCase();
  const formatted = cleanCode.length > 4 ? `${cleanCode.slice(0, 4)}-${cleanCode.slice(4, 8)}` : cleanCode;
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/?code=${cleanCode}` : '';

  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      showToast('Direct claiming link copied to clipboard', 'success');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      showToast('Could not copy link to clipboard', 'error');
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedCode(true);
      showToast(`Code ${formatted} copied`, 'success');
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      showToast('Could not copy code', 'error');
    }
  };

  const handleDownloadQrPng = () => {
    try {
      if (canvasRef.current) {
        const url = canvasRef.current.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `dropcode-${cleanCode}-qr.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('QR code saved as PNG image', 'success');
      }
    } catch (err) {
      console.error('Error saving QR image:', err);
      showToast('Could not save QR image', 'error');
    }
  };

  const handleNativeShare = async () => {
    if (!canShare) return;
    try {
      await navigator.share({
        title: 'DropCode Secure Transfer',
        text: `Claim files securely on DropCode using code ${formatted}`,
        url: shareUrl,
      });
    } catch {
      // User cancelled
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-modal-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* Hidden Canvas for High-Res PNG Export */}
          <div className="hidden">
            <QRCodeCanvas
              ref={canvasRef}
              value={shareUrl || formatted}
              size={600}
              level="H"
              marginSize={3}
              fgColor="#1D1D1F"
              bgColor="#FFFFFF"
            />
          </div>

          {/* Ambient Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-2xl transition-all"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 360 }}
            className="relative w-full max-w-[440px] rounded-[32px] bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-2xl p-6 sm:p-8 space-y-5 z-10 text-center overflow-hidden"
          >
            {/* Top decorative gradient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#0071E3] to-transparent opacity-80" />

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-full text-[#6E6E73] hover:text-[#1D1D1F] dark:text-[#98989D] dark:hover:text-[#F5F5F7] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 text-left pr-8">
              <div className="w-12 h-12 rounded-[16px] bg-gradient-to-tr from-[#0071E3]/15 to-[#6366F1]/15 dark:from-[#0A84FF]/20 dark:to-[#6366F1]/20 text-[#0071E3] dark:text-[#0A84FF] flex items-center justify-center shadow-sm flex-shrink-0 border border-[#0071E3]/20">
                <QrCode className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <h3
                  id="qr-modal-title"
                  className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-snug"
                >
                  Instant QR Claim
                </h3>
                <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-0.5">
                  Point iPhone or Android camera to receive
                </p>
              </div>
            </div>

            {/* QR Visual Showcase Stage */}
            <div className="relative p-6 rounded-[26px] bg-gradient-to-b from-black/[0.02] via-black/[0.04] to-black/[0.06] dark:from-white/[0.03] dark:via-white/[0.02] dark:to-transparent border border-black/[0.06] dark:border-white/[0.08] flex flex-col items-center justify-center overflow-hidden">
              {/* Dynamic Aura Glow behind QR canvas */}
              <div className="absolute w-52 h-52 rounded-full bg-gradient-to-tr from-[#0071E3]/20 via-[#6366F1]/15 to-[#34C759]/10 blur-2xl pointer-events-none animate-pulse" />

              {/* QR Card Canvas with Laser Viewfinder */}
              <div className="relative p-4 rounded-[22px] bg-white shadow-xl border border-black/[0.06] transition-transform hover:scale-[1.01]">
                {/* Viewfinder Corner Reticles */}
                <div className="absolute -top-1 -left-1 w-5 h-5 border-t-[3px] border-l-[3px] border-[#0071E3] dark:border-[#0A84FF] rounded-tl-[8px] shadow-[0_0_8px_rgba(0,113,227,0.4)]" />
                <div className="absolute -top-1 -right-1 w-5 h-5 border-t-[3px] border-r-[3px] border-[#0071E3] dark:border-[#0A84FF] rounded-tr-[8px] shadow-[0_0_8px_rgba(0,113,227,0.4)]" />
                <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-[3px] border-l-[3px] border-[#0071E3] dark:border-[#0A84FF] rounded-bl-[8px] shadow-[0_0_8px_rgba(0,113,227,0.4)]" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-[3px] border-r-[3px] border-[#0071E3] dark:border-[#0A84FF] rounded-br-[8px] shadow-[0_0_8px_rgba(0,113,227,0.4)]" />

                {/* Animated Scanner Laser Beam */}
                {laserActive && !isExpired && (
                  <motion.div
                    initial={{ top: '8%' }}
                    animate={{ top: ['8%', '90%', '8%'] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: 'easeInOut',
                    }}
                    className="absolute left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-[#0071E3] to-transparent z-10 pointer-events-none shadow-[0_0_8px_#0071E3]"
                  />
                )}

                {/* The Vector QR Code */}
                <div className="relative">
                  <QRCodeSVG
                    value={shareUrl || formatted}
                    size={210}
                    level="H"
                    includeMargin={false}
                    fgColor="#1D1D1F"
                    bgColor="#FFFFFF"
                  />

                  {/* Center Brand Monogram Badge */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-11 h-11 rounded-[12px] bg-white shadow-md border-2 border-white flex items-center justify-center">
                      <div className="w-8 h-8 rounded-[9px] bg-gradient-to-tr from-[#0071E3] to-[#6366F1] flex items-center justify-center text-white shadow-inner">
                        <ArrowDownToLine className="w-4 h-4 stroke-[2.4]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Options Row under QR */}
              <div className="mt-4 flex items-center justify-between w-full max-w-[240px] px-1 text-xs">
                {/* Expiry Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.1] text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] shadow-sm">
                  <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span>{isExpired ? 'Code expired' : `Expires in ${timeLeft}`}</span>
                </div>

                {/* Laser scanline toggle */}
                <button
                  type="button"
                  onClick={() => setLaserActive(!laserActive)}
                  title={laserActive ? 'Turn off scanner laser' : 'Turn on scanner laser'}
                  className={`p-1.5 rounded-full border transition-colors ${
                    laserActive
                      ? 'bg-[#0071E3]/10 border-[#0071E3]/30 text-[#0071E3] dark:text-[#0A84FF]'
                      : 'bg-black/5 dark:bg-white/5 border-transparent text-[#6E6E73] dark:text-[#98989D]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Code Chip & Copy Row */}
            <div className="flex items-center justify-between p-3.5 rounded-[18px] bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.08]">
              <div className="text-left min-w-0 pr-2">
                <div className="flex items-center gap-1 text-[11px] font-medium text-[#6E6E73] dark:text-[#98989D] uppercase tracking-wider">
                  <Smartphone className="w-3 h-3 text-[#0071E3] dark:text-[#0A84FF]" />
                  <span>Transfer Code</span>
                </div>
                <div className="font-mono text-xl font-bold tracking-widest text-[#1D1D1F] dark:text-[#F5F5F7] select-all mt-0.5">
                  {formatted}
                </div>
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                leftIcon={copiedCode ? <Check className="w-3.5 h-3.5 text-[#34C759]" /> : <Copy className="w-3.5 h-3.5" />}
                onClick={handleCopyCode}
                className="flex-shrink-0 font-medium"
              >
                {copiedCode ? 'Copied' : 'Copy Code'}
              </Button>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <Button
                type="button"
                variant="primary"
                size="md"
                leftIcon={copiedLink ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                onClick={handleCopyLink}
                className="w-full font-medium"
              >
                {copiedLink ? 'Link Copied' : 'Copy Link'}
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="md"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={handleDownloadQrPng}
                className="w-full font-medium"
              >
                Save QR Image
              </Button>

              {canShare ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  leftIcon={<Share2 className="w-4 h-4" />}
                  onClick={handleNativeShare}
                  className="col-span-2 w-full font-medium"
                >
                  Share Link via Apps
                </Button>
              ) : (
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="col-span-2 inline-flex items-center justify-center gap-2 p-2.5 rounded-[14px] text-xs font-medium text-[#0071E3] dark:text-[#0A84FF] hover:bg-[#0071E3]/5 dark:hover:bg-[#0A84FF]/10 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Preview claiming page in new tab</span>
                </a>
              )}
            </div>

            {/* Security Guarantee Microcopy */}
            <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-[#6E6E73] dark:text-[#98989D]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#34C759] flex-shrink-0" />
              <span>Decrypted directly on receiver device • AES-256-GCM encrypted</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
