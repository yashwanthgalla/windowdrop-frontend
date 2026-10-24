import React from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  speed?: string;
  bytesFormatted?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percent,
  size = 140,
  strokeWidth = 10,
  speed,
  bytesFormatted,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercent = Math.min(100, Math.max(0, percent));
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <progress className="sr-only" value={clampedPercent} max={100}>
        {clampedPercent}%
      </progress>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="w-full h-full -rotate-90 transform"
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-black/[0.06] dark:text-white/[0.08]"
            fill="transparent"
          />

          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#0071E3"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
            className="dark:stroke-[#0A84FF]"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
            {clampedPercent}%
          </span>
          {speed && (
            <span className="text-xs font-medium text-[#6E6E73] dark:text-[#98989D] mt-0.5">
              {speed}
            </span>
          )}
        </div>
      </div>

      {bytesFormatted && (
        <p className="text-sm text-[#6E6E73] dark:text-[#98989D] mt-3 font-medium">
          {bytesFormatted}
        </p>
      )}
    </div>
  );
};
