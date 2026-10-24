import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { QrModal } from './QrModal';
import {
  Copy,
  Check,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Download,
  Link2,
  Maximize2,
  Share2,
  ArrowDownToLine,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useTransferStore } from '../../store/useTransferStore';
import { useToastStore } from '../../store/useToastStore';

export const CodeReadyStep: React.FC = () => {
  const {
    shareCode,
    codeExpiresAt,
    senderStatus,
    cancelSending,
    resetSendFlow,
  } = useTransferStore();

  const { showToast } = useToastStore();
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('05:00');
  const inlineCanvasRef = useRef<HTMLCanvasElement>(null);

  const rawCode = shareCode || 'ABCDEFGH';
  const cleanCode = rawCode.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  const formatted = cleanCode.length > 4 ? `${cleanCode.slice(0, 4)}-${cleanCode.slice(4, 8)}` : cleanCode;
  const codeChars = cleanCode.padEnd(8, ' ').slice(0, 8).split('');
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/?code=${cleanCode}` : '';
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  // Live countdown to expiresAt
  useEffect(() => {
    if (!codeExpiresAt) return;

    const targetTime = new Date(codeExpiresAt).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft('00:00');
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [codeExpiresAt]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      showToast(`Share code ${formatted} copied to clipboard`, 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Could not copy to clipboard', 'error');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      showToast('Direct download link copied to clipboard', 'success');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      showToast('Could not copy link to clipboard', 'error');
    }
  };

  const handleDownloadQrPng = () => {
    try {
      if (inlineCanvasRef.current) {
        const url = inlineCanvasRef.current.toDataURL('image/png');
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

  const isDelivered = senderStatus === 'delivered';
  const isClaimed = senderStatus === 'claimed';
  const isExpired = senderStatus === 'expired' || timeLeft === '00:00';

  return (
    <div className="w-full py-4 sm:py-6">
      {/* Hidden high-res canvas for PNG export */}
      <div className="hidden">
        <QRCodeCanvas
          ref={inlineCanvasRef}
          value={shareUrl || formatted}
          size={512}
          level="H"
          marginSize={3}
          fgColor="#1D1D1F"
          bgColor="#FFFFFF"
        />
      </div>

      {/* Main Container: clean, open, outside the black box */}
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 mb-2">
            {isDelivered ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#34C759]/15 text-[#34C759] text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Delivered & Auto-Cleaned
              </span>
            ) : isClaimed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0071E3]/15 text-[#0071E3] dark:text-[#0A84FF] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#0071E3] dark:bg-[#0A84FF] animate-ping" />
                Receiver connected (downloading...)
              </span>
            ) : isExpired ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF3B30]/15 text-[#FF3B30] text-xs font-semibold">
                <Clock className="w-4 h-4" /> Code Expired
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Ready to Claim • Waiting for Receiver
              </span>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
            {isDelivered
              ? 'Transfer Delivered!'
              : isExpired
              ? 'Transfer Code Expired'
              : 'Scan QR or Enter Code'}
          </h2>
          <p className="text-sm sm:text-base text-[#6E6E73] dark:text-[#98989D] max-w-xl mx-auto">
            {isDelivered
              ? 'All files were securely downloaded by the receiver. Staged memory was wiped clean.'
              : isExpired
              ? 'This transfer has expired. Staging data was securely purged.'
              : 'Scan the QR code with any mobile camera, or share the 8-character code below to claim the files.'}
          </p>
        </div>

        {/* Content Showcase Grid */}
        {!isDelivered && !isExpired ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white/70 dark:bg-[#1C1C1E]/60 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.1] rounded-[32px] p-6 sm:p-10 shadow-apple-card">
            {/* Left: The QR Code Card (open, bright, crisp white tile) */}
            <div className="md:col-span-5 flex flex-col items-center justify-center space-y-4">
              <div
                className="relative p-4 sm:p-5 rounded-[24px] bg-white shadow-xl border border-black/10 cursor-pointer group transition-transform hover:scale-[1.02]"
                onClick={() => setShowQrModal(true)}
                title="Click to view full screen"
              >
                {/* Viewfinder corner marks */}
                <div className="absolute -top-1 -left-1 w-5 h-5 border-t-[3px] border-l-[3px] border-[#0071E3] dark:border-[#0A84FF] rounded-tl-[8px]" />
                <div className="absolute -top-1 -right-1 w-5 h-5 border-t-[3px] border-r-[3px] border-[#0071E3] dark:border-[#0A84FF] rounded-tr-[8px]" />
                <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-[3px] border-l-[3px] border-[#0071E3] dark:border-[#0A84FF] rounded-bl-[8px]" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-[3px] border-r-[3px] border-[#0071E3] dark:border-[#0A84FF] rounded-br-[8px]" />

                {/* QR Code SVG */}
                <div className="relative">
                  <QRCodeSVG
                    value={shareUrl || formatted}
                    size={210}
                    level="H"
                    includeMargin={false}
                    fgColor="#1D1D1F"
                    bgColor="#FFFFFF"
                  />

                  {/* Brand Monogram in center */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-11 h-11 rounded-[12px] bg-white shadow-md border-2 border-white flex items-center justify-center">
                      <div className="w-8 h-8 rounded-[9px] bg-gradient-to-tr from-[#0071E3] to-[#6366F1] flex items-center justify-center text-white shadow-inner">
                        <ArrowDownToLine className="w-4 h-4 stroke-[2.4]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR helper & quick actions */}
              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                  onClick={handleDownloadQrPng}
                >
                  Save PNG
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  leftIcon={<Maximize2 className="w-3.5 h-3.5" />}
                  onClick={() => setShowQrModal(true)}
                >
                  Full Screen
                </Button>
              </div>

              <p className="text-xs text-[#6E6E73] dark:text-[#98989D] flex items-center gap-1.5 text-center">
                <Smartphone className="w-3.5 h-3.5 text-[#0071E3] dark:text-[#0A84FF]" />
                Point iPhone or Android camera to claim
              </p>
            </div>

            {/* Right: Code Details & Direct Actions */}
            <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
              {/* Transfer Code Title & Expiry */}
              <div className="space-y-1 w-full">
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D]">
                    Transfer Code
                  </span>
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Expires in {timeLeft}</span>
                  </div>
                </div>

                {/* Big Bold Code Tiles */}
                <div className="pt-2 flex items-center justify-center md:justify-start gap-1.5 sm:gap-2">
                  {codeChars.map((char, index) => (
                    <React.Fragment key={index}>
                      {index === 4 && (
                        <span className="text-2xl font-bold text-[#6E6E73] dark:text-[#98989D] px-1 select-none">
                          -
                        </span>
                      )}
                      <div
                        onClick={handleCopyCode}
                        className="w-10 h-14 sm:w-12 sm:h-16 rounded-2xl bg-white dark:bg-[#2C2C2E] border border-black/10 dark:border-white/10 shadow-sm flex items-center justify-center font-mono font-bold text-2xl sm:text-3xl text-[#1D1D1F] dark:text-[#F5F5F7] select-all cursor-pointer transition-all hover:scale-105 hover:border-[#0071E3]"
                      >
                        {char}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-3 pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    leftIcon={copied ? <Check className="w-4 h-4 text-[#34C759]" /> : <Copy className="w-4 h-4" />}
                    onClick={handleCopyCode}
                    className="flex-1 min-w-[140px]"
                  >
                    {copied ? 'Copied Code' : 'Copy Code'}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    leftIcon={copiedLink ? <Check className="w-4 h-4 text-[#34C759]" /> : <Link2 className="w-4 h-4" />}
                    onClick={handleCopyLink}
                    className="flex-1 min-w-[140px]"
                  >
                    {copiedLink ? 'Link Copied' : 'Copy Link'}
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {canShare && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      leftIcon={<Share2 className="w-4 h-4" />}
                      onClick={handleNativeShare}
                      className="flex-1"
                    >
                      Share Link via Apps
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    leftIcon={<XCircle className="w-4 h-4 text-[#FF3B30]" />}
                    onClick={cancelSending}
                    className="hover:text-[#FF3B30]"
                  >
                    Cancel Transfer
                  </Button>
                </div>
              </div>

              {/* Security guarantee line */}
              <div className="pt-2 text-xs text-[#6E6E73] dark:text-[#98989D] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#34C759]" />
                <span>Encrypted transit • Auto-deleted once claimed</span>
              </div>
            </div>
          </div>
        ) : (
          /* When delivered or expired: Clean status card with start over button */
          <div className="p-8 sm:p-12 text-center rounded-[32px] bg-white/70 dark:bg-[#1C1C1E]/60 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.1] shadow-apple-card space-y-6 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-[#34C759]/15 text-[#34C759]">
              {isDelivered ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <Clock className="w-8 h-8 text-[#FF3B30]" />
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                {isDelivered ? 'Transfer Delivered' : 'Code Expired'}
              </h3>
              <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                {isDelivered
                  ? 'The receiver has securely downloaded all files. Staged data is wiped.'
                  : 'The 5-minute single-use transfer window has closed.'}
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={resetSendFlow}
              className="w-full"
            >
              Start New Transfer
            </Button>
          </div>
        )}
      </div>

      {/* Full-Screen Apple-Themed Portaled QR Modal */}
      <QrModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        shareCode={rawCode}
        timeLeft={timeLeft}
        isExpired={isExpired}
      />
    </div>
  );
};
