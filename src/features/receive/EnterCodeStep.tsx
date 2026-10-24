import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownToLine, Lock, AlertCircle, KeyRound } from 'lucide-react';
import { OtpInput } from '../../components/ui/OtpInput';
import { Button } from '../../components/ui/Button';
import { useTransferStore } from '../../store/useTransferStore';

export const EnterCodeStep: React.FC = () => {
  const {
    code,
    setCode,
    isVerifying,
    verificationError,
    cooldownSeconds,
    verifyCode,
  } = useTransferStore();

  const [cooldownRemaining, setCooldownRemaining] = useState<number>(cooldownSeconds || 0);

  useEffect(() => {
    if (!cooldownSeconds || cooldownSeconds <= 0) return;
    const startTimer = setTimeout(() => {
      setCooldownRemaining(cooldownSeconds);
    }, 0);
    const interval = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
    };
  }, [cooldownSeconds]);

  const clean = code.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  const isComplete = clean.length === 8;
  const isLocked = cooldownRemaining > 0;

  const handleVerify = () => {
    if (isComplete && !isLocked && !isVerifying) {
      verifyCode(clean);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 text-center space-y-7">
      {/* Icon & Heading */}
      <div className="space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-[#0071E3]/10 dark:bg-[#0A84FF]/15 text-[#0071E3] dark:text-[#0A84FF] flex items-center justify-center mx-auto shadow-sm">
          {isLocked ? (
            <Lock className="w-7 h-7 text-[#FF3B30]" />
          ) : (
            <ArrowDownToLine className="w-7 h-7 stroke-[2.2]" />
          )}
        </div>
        <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
          {isLocked ? 'Temporarily Locked' : 'Enter 8-Digit Code'}
        </h3>
        <p className="text-sm text-[#6E6E73] dark:text-[#98989D] max-w-sm mx-auto">
          {isLocked
            ? `Too many failed attempts. Try again in ${cooldownRemaining}s.`
            : 'Enter the single-use transfer code to retrieve and decrypt your package.'}
        </p>
      </div>

      {/* Code Input */}
      <div className="w-full max-w-md mx-auto space-y-4">
        <motion.div
          key={verificationError || 'idle'}
          animate={verificationError ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex justify-center"
        >
          <OtpInput
            value={code}
            onChange={setCode}
            onComplete={() => handleVerify()}
            disabled={isLocked || isVerifying}
            isError={Boolean(verificationError)}
          />
        </motion.div>

        {/* Error / Lock Notice */}
        {verificationError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-xs font-medium text-[#FF3B30] bg-[#FF3B30]/10 px-3 py-2 rounded-xl"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{verificationError}</span>
          </motion.div>
        )}

        {/* Cooldown Timer Alert */}
        {isLocked && (
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-500 bg-amber-500/10 px-3 py-2 rounded-xl">
            <Lock className="w-3.5 h-3.5" />
            <span>Rate limited: Escalating lockout active ({cooldownRemaining}s remaining)</span>
          </div>
        )}
      </div>

      {/* Continue button */}
      <div className="w-full max-w-xs mx-auto">
        <Button
          type="button"
          variant="primary"
          size="lg"
          className="w-full font-semibold"
          disabled={!isComplete || isLocked || isVerifying}
          isLoading={isVerifying}
          leftIcon={<KeyRound className="w-4 h-4" />}
          onClick={handleVerify}
        >
          Continue
        </Button>
      </div>

      {/* Security note */}
      <div className="text-xs text-[#6E6E73] dark:text-[#98989D] max-w-xs mx-auto">
        Single-use redemption • AES-256-GCM decrypted directly on download
      </div>
    </div>
  );
};
