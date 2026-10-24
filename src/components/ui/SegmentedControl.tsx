import React from 'react';
import { motion } from 'framer-motion';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  disabledTooltip?: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label="Action selector"
      className={`relative inline-flex p-1 bg-black/[0.06] dark:bg-white/[0.1] rounded-full border border-black/[0.04] dark:border-white/[0.08] backdrop-blur-md select-none ${className}`}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        const isDisabled = Boolean(option.disabled);

        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={isSelected}
            aria-disabled={isDisabled}
            title={isDisabled ? option.disabledTooltip : undefined}
            tabIndex={isDisabled ? -1 : 0}
            type="button"
            onClick={() => {
              if (!isDisabled) onChange(option.value);
            }}
            className={`relative flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 rounded-full text-sm sm:text-base font-medium transition-colors duration-200 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] dark:focus-visible:ring-[#0A84FF] ${
              isDisabled
                ? 'opacity-40 cursor-not-allowed text-[#6E6E73]'
                : isSelected
                ? 'text-[#1D1D1F] dark:text-[#F5F5F7]'
                : 'text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]'
            }`}
          >
            {isSelected && !isDisabled && (
              <motion.div
                layoutId="segmented-pill"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className="absolute inset-0 bg-white dark:bg-[#2C2C2E] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.5)] border border-black/[0.04] dark:border-white/[0.1] -z-10"
              />
            )}
            <span className="w-4 h-4 flex items-center justify-center">
              {option.icon}
            </span>
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
