import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`skeleton-shimmer rounded-[12px] bg-black/[0.06] dark:bg-white/[0.08] ${className}`}
      aria-hidden="true"
    />
  );
};
