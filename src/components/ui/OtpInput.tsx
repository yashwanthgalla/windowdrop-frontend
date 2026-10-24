import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  onComplete?: (val: string) => void;
  isError?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 8,
  value,
  onChange,
  onComplete,
  isError = false,
  disabled = false,
  autoFocus = true,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split value into array of single chars padded to length
  const chars = Array.from({ length }, (_, i) => value[i] || '');

  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      const currentVal = chars[index];
      const newChars = [...chars];

      if (currentVal) {
        newChars[index] = '';
        const nextVal = newChars.join('').trimEnd();
        onChange(nextVal);
      } else if (index > 0) {
        newChars[index - 1] = '';
        const nextVal = newChars.join('').trimEnd();
        onChange(nextVal);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const raw = e.target.value;
    const char = raw.slice(-1).toUpperCase();

    // Allow alphanumeric
    if (/[A-Z0-9]/.test(char)) {
      const newChars = [...chars];
      newChars[index] = char;
      const nextVal = newChars.join('');
      onChange(nextVal);

      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      if (nextVal.length === length && !nextVal.includes('')) {
        onComplete?.(nextVal);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    e.preventDefault();

    const pasted = e.clipboardData
      .getData('text')
      .replace(/[^A-Za-z0-9]/g, '')
      .toUpperCase()
      .slice(0, length);

    if (pasted.length > 0) {
      onChange(pasted);
      const targetIndex = Math.min(pasted.length, length - 1);
      inputRefs.current[targetIndex]?.focus();

      if (pasted.length === length) {
        onComplete?.(pasted);
      }
    }
  };

  return (
    <motion.div
      animate={
        isError
          ? {
              x: [-10, 10, -8, 8, -4, 4, 0],
              transition: { duration: 0.45, ease: 'easeInOut' },
            }
          : { x: 0 }
      }
      className="flex items-center justify-center gap-1.5 sm:gap-2.5 max-w-full"
    >
      {chars.map((char, index) => {
        const isMiddle = index === 3;
        return (
          <React.Fragment key={index}>
            <input
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="text"
              maxLength={1}
              value={char}
              disabled={disabled}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
              aria-label={`Digit ${index + 1} of 8`}
              className={`w-9 h-12 sm:w-11 sm:h-14 text-center font-mono text-lg sm:text-2xl font-bold rounded-[14px] transition-all duration-200 select-none ${
                isError
                  ? 'border-2 border-[#FF3B30] bg-[#FF3B30]/5 text-[#FF3B30] dark:bg-[#FF3B30]/10'
                  : char
                  ? 'border border-[#0071E3] dark:border-[#0A84FF] bg-white dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-[#F5F5F7] shadow-sm'
                  : 'border border-black/[0.1] dark:border-white/[0.12] bg-white/70 dark:bg-[#1C1C1E]/60 text-[#1D1D1F] dark:text-[#F5F5F7] hover:border-black/[0.2] dark:hover:border-white/[0.25]'
              } focus:border-[#0071E3] dark:focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0071E3]/20 dark:focus:ring-[#0A84FF]/25 outline-none disabled:opacity-40`}
            />

            {/* Separator dash between 4th and 5th characters */}
            {isMiddle && (
              <span
                className="text-[#6E6E73] dark:text-[#98989D] font-medium text-lg px-0.5 sm:px-1 select-none"
                aria-hidden="true"
              >
                —
              </span>
            )}
          </React.Fragment>
        );
      })}
    </motion.div>
  );
};
